# app.py
import os
import posixpath
from typing import List, Optional, Dict, Tuple

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import StreamingResponse

# load .env
load_dotenv("aws.env")

AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
S3_BUCKET = os.getenv("S3_BUCKET", "spaark-databucket")
PRESIGN_EXPIRES = int(os.getenv("PRESIGN_EXPIRES", "300"))  # seconds default

s3 = boto3.client("s3", region_name=AWS_REGION)

app = FastAPI(title="S3 Dataset Explorer (FastAPI)")

# configure CORS - change to your frontend origins in production
# app.py (or wherever your FastAPI app is defined)


# ---------- CORS configuration ----------
# Replace the list below with your frontend origin(s).
# For development you can use ["*"] temporarily, but it's safer to list hosts.
ALLOW_ORIGINS = [
    "http://localhost:3000",   # your React dev server
    "http://127.0.0.1:3000"
    # add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,  # or ["*"] for quick dev test
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],  # ensures presigned attachments can be downloaded
)
# ---------- end CORS config ----------



# ---------- helpers ----------

def s3_key_for_raw(domain: str, filename: str) -> str:
    return posixpath.join("processed", "raw", domain, filename)


def s3_key_for_curated(domain: str, filename: str) -> str:
    return posixpath.join("processed", "curated", domain, filename)


def s3_key_for_metadata(domain: str, base_name: str) -> str:
    # metadata pattern: <base>_metadata.json
    return posixpath.join("processed", "metadata", domain, f"{base_name}_metadata.json")


def head_exists(bucket: str, key: str) -> bool:
    try:
        s3.head_object(Bucket=bucket, Key=key)
        return True
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code", "")
        # 404 Not Found or NoSuchKey
        if code in ("404", "NoSuchKey", "NotFound"):
            return False
        # rethrow other errors
        raise


def generate_presigned_get(key: str, filename: Optional[str] = None, expires_in: int = PRESIGN_EXPIRES) -> str:
    params = {"Bucket": S3_BUCKET, "Key": key}
    if filename:
        params["ResponseContentDisposition"] = f'attachment; filename="{filename}"'
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params=params,
        ExpiresIn=expires_in
    )


def split_name_and_ext(name: str) -> Tuple[str, Optional[str]]:
    """
    Return (stem, ext) where ext includes leading dot if present, else None.
    Example: 'file_raw.csv' -> ('file_raw', '.csv'); 'file' -> ('file', None)
    """
    if "." in name:
        idx = name.rfind(".")
        return name[:idx], name[idx:]
    return name, None


def candidates_for_requested_dataset(requested: str) -> List[str]:
    """
    Given what user passed as dataset (could be base, or with suffix or full filename),
    return a deque of candidate filenames to try (in order).
    Examples it will try:
      - exactly what user provided
      - with .csv if missing
      - name_raw(.csv), name_curated(.csv)
      - if user provided a raw/curated name, also try removing suffix variants
    """
    candidates = []
    stem, ext = split_name_and_ext(requested)

    # 1) exact as provided
    if ext:
        candidates.append(requested)  # e.g. foo_raw.csv or foo.csv
    else:
        candidates.append(requested)  # e.g. foo

    # 2) if no extension provided, try common ones
    if not ext:
        candidates.append(f"{requested}.csv")
        candidates.append(f"{requested}.zip")

    # 3) variants with _raw and _curated (with and without extension)
    for suffix in ("_raw", "_curated"):
        if ext:
            # if requested already has ext, try adding suffix before ext
            candidates.append(f"{stem}{suffix}{ext}")  # foo_raw.csv
        else:
            candidates.append(f"{requested}{suffix}")     # foo_raw
            candidates.append(f"{requested}{suffix}.csv") # foo_raw.csv
            candidates.append(f"{requested}{suffix}.zip")

    # 4) if requested contains _raw or _curated, also try removing that suffix to get base
    for s in ("_raw", "_curated"):
        if requested.endswith(s):
            base = requested[: -len(s)]
            candidates.append(base)
            candidates.append(f"{base}.csv")
            candidates.append(f"{base}.zip")
        if ext and stem.endswith(s):
            base = stem[: -len(s)]
            candidates.append(f"{base}{ext}")
            candidates.append(base)
            candidates.append(f"{base}.csv")

    # dedupe while preserving order
    seen = set()
    out = []
    for c in candidates:
        if c not in seen:
            seen.add(c)
            out.append(c)
    return out


def derive_base_name_from_key(key: str) -> str:
    """
    Given a key like processed/raw/oceanographic/foo_raw.csv
    return base 'foo' (strip _raw/_curated/_metadata and extension)
    """
    filename = posixpath.basename(key)
    # strip extension
    if "." in filename:
        filename_no_ext = filename[: filename.rfind(".")]
    else:
        filename_no_ext = filename
    # remove suffixes
    for suf in ("_raw", "_curated", "_metadata"):
        if filename_no_ext.endswith(suf):
            filename_no_ext = filename_no_ext[: -len(suf)]
    return filename_no_ext


# ---------- Pydantic models ----------

class PresignRequest(BaseModel):
    domain: str
    dataset: str  # can be base name or full filename
    expires_in: Optional[int] = None


class PresignResponse(BaseModel):
    raw_url: Optional[str]
    curated_url: Optional[str]
    metadata_url: Optional[str]
    expires_in: int
    missing: List[str] = []
    tried_keys: Optional[Dict[str, List[str]]] = None  # debug: keys we tried


# ---------- endpoints ----------

@app.get("/api/datasets/{domain}", response_model=List[str])
def list_datasets(domain: str, include_curated: bool = Query(False, description="If true include curated filenames too")):
    """
    List base dataset names under processed/raw/{domain}/ (strips _raw/_curated/_metadata and extensions).
    This returns friendly names you can pass to /api/presign.
    """
    prefix = posixpath.join("processed", "raw", domain)
    if not prefix.endswith("/"):
        prefix = prefix + "/"

    try:
        paginator = s3.get_paginator("list_objects_v2")
        page_iterator = paginator.paginate(Bucket=S3_BUCKET, Prefix=prefix)

        bases = []
        for page in page_iterator:
            for obj in page.get("Contents", []):
                key = obj["Key"]
                # ensure it's directly under prefix (not nested folders)
                if key.startswith(prefix):
                    relative = key[len(prefix):]
                    if relative and "/" not in relative:
                        base = derive_base_name_from_key(key)
                        bases.append(base)

        # optionally also scan curated to pick up any datasets only in curated
        if include_curated:
            prefix_c = posixpath.join("processed", "curated", domain)
            if not prefix_c.endswith("/"):
                prefix_c = prefix_c + "/"
            page_iterator = s3.get_paginator("list_objects_v2").paginate(Bucket=S3_BUCKET, Prefix=prefix_c)
            for page in page_iterator:
                for obj in page.get("Contents", []):
                    key = obj["Key"]
                    if key.startswith(prefix_c):
                        relative = key[len(prefix_c):]
                        if relative and "/" not in relative:
                            base = derive_base_name_from_key(key)
                            bases.append(base)

        # dedupe and sort
        unique = sorted(list(dict.fromkeys(bases)))
        return unique
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"S3 list error: {e}")


@app.post("/api/presign", response_model=PresignResponse)
def presign(req: PresignRequest):
    """
    Try to find raw, curated and metadata objects intelligently (handles _raw/_curated endings).
    Returns presigned URLs for objects that exist. Also returns `missing` list and `tried_keys` for debugging.
    """
    expires = req.expires_in or PRESIGN_EXPIRES

    # prepare candidate filenames to try
    candidates = candidates_for_requested_dataset(req.dataset)

    tried_keys: Dict[str, List[str]] = {"raw": [], "curated": [], "metadata": []}
    missing = []
    raw_url = curated_url = metadata_url = None

    # find the first existing candidate for raw
    raw_found_key = None
    raw_used_filename = None
    for cand in candidates:
        key = s3_key_for_raw(req.domain, cand)
        tried_keys["raw"].append(key)
        try:
            if head_exists(S3_BUCKET, key):
                raw_found_key = key
                raw_used_filename = cand
                break
        except ClientError as e:
            raise HTTPException(status_code=500, detail=f"S3 head error for raw: {e}")

    if raw_found_key:
        raw_url = generate_presigned_get(raw_found_key, filename=raw_used_filename, expires_in=expires)
    else:
        missing.append("raw")

    # find first existing candidate for curated
    curated_found_key = None
    curated_used_filename = None
    for cand in candidates:
        key = s3_key_for_curated(req.domain, cand)
        tried_keys["curated"].append(key)
        try:
            if head_exists(S3_BUCKET, key):
                curated_found_key = key
                curated_used_filename = cand
                break
        except ClientError as e:
            raise HTTPException(status_code=500, detail=f"S3 head error for curated: {e}")

    if curated_found_key:
        curated_url = generate_presigned_get(curated_found_key, filename=curated_used_filename, expires_in=expires)
    else:
        missing.append("curated")

    # metadata uses base name (without _raw/_curated) and _metadata.json
    # determine base: if user gave a base, use it; otherwise strip suffix from first candidate that matched
    # simplest: derive base from the requested dataset (strip suffixes and extension)
    base = derive_base_name_from_key(req.dataset if "/" not in req.dataset else posixpath.basename(req.dataset))
    metadata_key = s3_key_for_metadata(req.domain, base)
    tried_keys["metadata"].append(metadata_key)
    try:
        if head_exists(S3_BUCKET, metadata_key):
            metadata_url = generate_presigned_get(metadata_key, filename=posixpath.basename(metadata_key), expires_in=expires)
        else:
            missing.append("metadata")
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"S3 head error for metadata: {e}")

    return PresignResponse(
        raw_url=raw_url,
        curated_url=curated_url,
        metadata_url=metadata_url,
        expires_in=expires,
        missing=missing,
        tried_keys=tried_keys
    )


@app.get("/api/proxy")
def proxy(domain: str = Query(...), dataset: str = Query(...), which: str = Query("raw", regex="^(raw|curated|metadata)$")):
    """
    Stream S3 object through the backend. Useful if clients cannot use presigned URLs.
    Example: /api/proxy?domain=oceanographic&dataset=foo&which=raw
    This will try to find foo_raw.csv / foo_raw / foo.csv etc using the same candidate logic.
    """
    candidates = candidates_for_requested_dataset(dataset)

    key_to_get = None
    if which == "raw":
        for cand in candidates:
            key = s3_key_for_raw(domain, cand)
            try:
                if head_exists(S3_BUCKET, key):
                    key_to_get = key
                    filename = cand
                    break
            except ClientError as e:
                raise HTTPException(status_code=500, detail=f"S3 head error: {e}")
    elif which == "curated":
        for cand in candidates:
            key = s3_key_for_curated(domain, cand)
            try:
                if head_exists(S3_BUCKET, key):
                    key_to_get = key
                    filename = cand
                    break
            except ClientError as e:
                raise HTTPException(status_code=500, detail=f"S3 head error: {e}")
    else:  # metadata
        base = derive_base_name_from_key(dataset)
        key = s3_key_for_metadata(domain, base)
        try:
            if head_exists(S3_BUCKET, key):
                key_to_get = key
                filename = posixpath.basename(key)
        except ClientError as e:
            raise HTTPException(status_code=500, detail=f"S3 head error: {e}")

    if not key_to_get:
        raise HTTPException(status_code=404, detail=f"{which} object not found for dataset '{dataset}' in domain '{domain}'")

    try:
        obj = s3.get_object(Bucket=S3_BUCKET, Key=key_to_get)
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"S3 get_object error: {e}")

    body = obj["Body"]
    content_type = obj.get("ContentType", "application/octet-stream")
    headers = {"Content-Disposition": f'attachment; filename="{posixpath.basename(key_to_get)}"'}
    return StreamingResponse(body.iter_chunks(), media_type=content_type, headers=headers)
