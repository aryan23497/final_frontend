# presign_service.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import boto3
from botocore.config import Config as BotoConfig

# Load local aws.env in development (safe: keep aws.env out of git)
load_dotenv("aws.env")

# Config - reading from aws.env file
BUCKET = os.environ.get("S3_BUCKET", "spaark-databucket")
REGION = os.environ.get("AWS_DEFAULT_REGION", "ap-south-1")
PRESIGN_EXPIRES = int(os.environ.get("PRESIGN_EXPIRES", "604800"))  # default 1 day
PROCESSED_PREFIX = os.environ.get("S3_PREFIX", "processed")  # root folder for processed files

# AWS credentials from aws.env
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")

# Create S3 client with explicit credentials
_s3_client = boto3.client(
    "s3",
    region_name=REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    config=BotoConfig(signature_version="s3v4")
)

app = FastAPI(title="S3 Batch Presign Service")


class PresignFileRequest(BaseModel):
    domain: str                 # e.g. "oceanography", "edna"
    filename: str               # e.g. "ocean.csv" or "ocean.txt"
    expires_in: Optional[int] = None  # optional override (seconds)
    # include_exists: Optional[bool] = False  # (optional) if you want existence flags (not used by default)


@app.post("/presign-file")
def presign_file(payload: PresignFileRequest):
    """
    Returns a JSON mapping of {'raw': url, 'curated': url, 'metadata': url}
    for the given domain and filename under the bucket's processed/ subfolders.
    """

    domain = payload.domain.strip().strip("/")
    filename = payload.filename.strip().lstrip("/")  # ensure no leading slash
    if not domain or not filename:
        raise HTTPException(status_code=400, detail="Both 'domain' and 'filename' are required and must be non-empty.")

    expires = int(payload.expires_in) if payload.expires_in else PRESIGN_EXPIRES

    # Build keys for each folder
    # e.g. processed/raw/oceanography/ocean.csv
    keys = {
        "raw": f"{PROCESSED_PREFIX}raw/{domain}/{filename}",
        "curated": f"{PROCESSED_PREFIX}/curated/{domain}/{filename}",
        "metadata": f"{PROCESSED_PREFIX}/metadata/{domain}/{filename}",
    }

    items = {}
    try:
        for k, key in keys.items():
            url = _s3_client.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": BUCKET, "Key": key},
                ExpiresIn=expires,
                HttpMethod="GET"
            )
            items[k] = url

    except Exception as e:
        # Provide the exception message so your pipeline can log/act on it
        raise HTTPException(status_code=500, detail=f"Error generating presigned URL: {str(e)}")

    # Response structure you requested: simple mapping per file-type
    return items