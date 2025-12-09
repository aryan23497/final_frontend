// DataInsightsModule.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import "./DataInsightsModule.css";
import axios from "axios";

/*
  DataInsightsModule (Domain: Taxonomy | Otolith | eDNA)
  - Robust eDNA upload:
    * previews first non-empty line from selected .fasta
    * validates presence of leading '>' (warns, but still allows upload)
    * attempts multiple multipart field names on 422 (fasta, file, fasta_file, upload)
    * surfaces server response JSON/text to UI (no [object Object])
  - eDNA analyze: sends text/plain to /edna/analyze (fallback to JSON)
  - Uploads go to /edna/upload_files on baseEdnaBackend
*/

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });
  } catch (e) {
    return iso;
  }
}

function shortId(id) {
  if (!id) return "";
  return id.length > 10 ? `${id.slice(0, 8)}…` : id;
}

function normalizeResponse(raw) {
  if (!raw) return { count: 0, data: [] };

  if (typeof raw === "object" && !Array.isArray(raw) && Array.isArray(raw.data)) {
    return {
      count: typeof raw.count === "number" ? raw.count : raw.data.length,
      data: raw.data,
    };
  }

  if (Array.isArray(raw)) {
    return { count: raw.length, data: raw };
  }

  if (typeof raw === "object" && Array.isArray(raw.results)) {
    return {
      count: typeof raw.count === "number" ? raw.count : raw.results.length,
      data: raw.results,
    };
  }

  if (typeof raw === "object" && Array.isArray(raw.items)) {
    return {
      count: typeof raw.total === "number" ? raw.total : raw.items.length,
      data: raw.items,
    };
  }

  if (typeof raw === "object" && (raw.id || raw.scientific_name || raw.species || raw.otolith_id || raw.sequence_id)) {
    return { count: 1, data: [raw] };
  }

  return { count: 0, data: [] };
}

function humanize(key) {
  if (!key) return "";
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ---------- Results view (table/cards/modal) ---------- */
function DataResultView({ normalized }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewAlt, setPreviewAlt] = useState("");
  const items = (normalized && normalized.data) || [];
  const count = typeof normalized?.count === "number" ? normalized.count : items.length;
  const speciesNames = items.map((r) => r.scientific_name || r.species || r.name).filter(Boolean);

  // collect union of keys
  const keysSet = new Set();
  items.forEach((it) => {
    Object.keys(it || {}).forEach((k) => keysSet.add(k));
  });

  // remove storage_path by default (if present)
  keysSet.delete("storage_path");

  // preferred order
  const preferred = [
    "id",
    "sequence_id",
    "otolith_id",
    "scientific_name",
    "species",
    "family",
    "genus",
    "locality",
    "original_image_url",
    "lat",
    "lon",
    "created_at",
  ];
  const remaining = Array.from(keysSet).filter((k) => !preferred.includes(k)).sort();
  const columns = [...preferred.filter((k) => keysSet.has(k)), ...remaining];

  const safeSrc = (url) => url || "";

  return (
    <div style={{ width: "100%" }}>
      {/* Summary & actions */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div>
          <h4 style={{ margin: 0, color: "#e6eef6" }}>Found {count} record{count !== 1 ? "s" : ""}</h4>
          <div style={{ color: "#9fb4d8", fontSize: 13, marginTop: 6 }}>
            Species (first {Math.min(5, speciesNames.length)}): {speciesNames.slice(0, 5).join(", ") || "—"}
            {speciesNames.length > 5 ? ` + ${speciesNames.length - 5} more` : ""}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="ins-action-btn"
            onClick={() => {
              try { navigator.clipboard.writeText(JSON.stringify(normalized, null, 2)); } catch (e) { console.warn(e); }
            }}
          >
            Copy JSON
          </button>

          <a
            className="ins-action-btn"
            style={{ textDecoration: "none" }}
            href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(normalized, null, 2))}`}
            download="response_pretty.json"
          >
            Download
          </a>
        </div>
      </div>

      {/* Dynamic table */}
      <div className="tax-table-wrap dynamic-table-wrap">
        <table className="tax-table dynamic-table">
          <thead>
            <tr>{columns.map((col) => <th key={col}>{humanize(col)}</th>)}</tr>
          </thead>
          <tbody>
            {items.map((it, rowIdx) => (
              <tr key={it.id || it.otolith_id || it.sequence_id || `${rowIdx}-${JSON.stringify(it).slice(0,20)}`}>
                {columns.map((col) => {
                  const value = it[col];

                  // thumbnail columns (display small clickable thumbnail)
                  if ((col === "original_image_url") && value) {
                    const src = safeSrc(value);
                    return (
                      <td key={col}>
                        <div className="thumb-cell">
                          <img
                            className="thumb-img"
                            src={src}
                            alt={it.scientific_name || it.otolith_id || "image"}
                            onClick={() => { setPreviewUrl(src); setPreviewAlt(it.scientific_name || it.otolith_id || "image"); }}
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                          <div className="thumb-actions">
                            <button className="ins-action-btn small" onClick={() => { setPreviewUrl(src); setPreviewAlt(it.scientific_name || it.otolith_id || "image"); }}>View</button>
                            <a className="ins-action-btn small" style={{ textDecoration: "none" }} href={src} target="_blank" rel="noreferrer">Open</a>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  // show sequence text lightly if it's a long FASTA sequence field
                  if ((col === "sequence" || col === "fasta" || col === "sequence_text") && typeof value === "string") {
                    const short = value.length > 140 ? `${value.slice(0, 140)}…` : value;
                    return <td key={col}><pre className="inline-pre">{short}</pre></td>;
                  }

                  // lat/lon linking when both exist
                  if ((col === "lat" || col === "lon") && (it.lat != null && it.lon != null)) {
                    if (col === "lat") {
                      return (
                        <td key={col}>
                          <a href={`https://www.openstreetmap.org/?mlat=${it.lat}&mlon=${it.lon}#map=12/${it.lat}/${it.lon}`} target="_blank" rel="noreferrer">{it.lat}</a>
                        </td>
                      );
                    }
                    return (
                      <td key={col}>
                        <a href={`https://www.openstreetmap.org/?mlat=${it.lat}&mlon=${it.lon}#map=12/${it.lat}/${it.lon}`} target="_blank" rel="noreferrer">{it.lon}</a>
                      </td>
                    );
                  }

                  if (col === "created_at" && value) return <td key={col}>{formatDate(value)}</td>;
                  if (col === "id" && value) return <td key={col} title={value}>{shortId(String(value))}</td>;

                  if (value === null || value === undefined || value === "") return <td key={col}>—</td>;
                  if (typeof value === "object") {
                    try { return <td key={col}><pre className="inline-pre">{JSON.stringify(value)}</pre></td>; }
                    catch (e) { return <td key={col}><pre className="inline-pre">[object]</pre></td>; }
                  }

                  return <td key={col}>{String(value)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image modal */}
      {previewUrl && (
        <div className="image-modal" role="dialog" aria-modal="true" onClick={() => setPreviewUrl(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <div style={{ color: "#e6eef6", fontWeight: 700 }}>{previewAlt}</div>
              <button className="ins-action-btn small close-btn" onClick={() => setPreviewUrl(null)}>Close</button>
            </div>
            <div className="image-modal-body">
              <img src={previewUrl} alt={previewAlt} className="image-modal-img" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <a className="ins-action-btn small" style={{ textDecoration: "none" }} href={previewUrl} target="_blank" rel="noreferrer">Open in new tab</a>
                <a className="ins-action-btn small" style={{ textDecoration: "none" }} href={previewUrl} download>Download</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card view */}
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        {items.map((it) => (
          <div key={it.id || it.otolith_id || it.sequence_id || Math.random()} className="tax-card">
            <div className="tax-card-head">
              <div style={{ fontWeight: 700 }}>{it.scientific_name || it.species || it.name || it.otolith_id || it.sequence_id || "Unknown"}</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>{it.family || it.genus || "—"}</div>
            </div>

            <div className="tax-card-body">
              <div><strong>Genus:</strong> {it.genus || "—"}</div>
              <div><strong>Locality:</strong> {it.locality || "—"}</div>
              <div><strong>Location:</strong> {it.lat != null ? `${it.lat}, ${it.lon}` : "—"}</div>
              <div><strong>Created:</strong> {formatDate(it.created_at)}</div>
            </div>

            <details style={{ marginTop: 8, color: "#cfe7ff" }}>
              <summary style={{ cursor: "pointer" }}>More fields</summary>
              <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "#e6eef6", fontSize: 13 }}>
                {Object.entries(it).map(([k, v]) => `${k}: ${v}\n`).join("")}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main component ---------- */
const DataInsightsModule = () => {
  const [domain, setDomain] = useState("Taxonomy");

  // Taxonomy state
  const [taxAction, setTaxAction] = useState("");
  const [taxListCount, setTaxListCount] = useState("");
  const [taxScientificName, setTaxScientificName] = useState("");
  const [taxFamily, setTaxFamily] = useState("");
  const [taxGenus, setTaxGenus] = useState("");
  const [taxOrder, setTaxOrder] = useState("");

  // Otolith state
  const [otAction, setOtAction] = useState("");
  const [otListCount, setOtListCount] = useState("");
  const [otOtolithID, setOtOtolithID] = useState("");

  // eDNA state
  const [edAction, setEdAction] = useState(""); // analyze | upload
  const [edFastaText, setEdFastaText] = useState("");
  const [edFile, setEdFile] = useState(null);
  const [edFilePreviewLine, setEdFilePreviewLine] = useState("");
  const [edFileWarning, setEdFileWarning] = useState("");

  // results & control
  const [normalizedResult, setNormalizedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // reset domain-specific states when domain changes
  useEffect(() => {
    setNormalizedResult(null);
    setError(null);
    setLoading(false);

    // reset taxonomy
    setTaxAction("");
    setTaxListCount("");
    setTaxScientificName("");
    setTaxFamily("");
    setTaxGenus("");
    setTaxOrder("");

    // reset otolith
    setOtAction("");
    setOtListCount("");
    setOtOtolithID("");

    // reset eDNA
    setEdAction("");
    setEdFastaText("");
    setEdFile(null);
    setEdFilePreviewLine("");
    setEdFileWarning("");
  }, [domain]);

  // file preview helper: reads first few lines (async)
  const readFilePreview = (file) => {
    setEdFilePreviewLine("");
    setEdFileWarning("");
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const txt = String(reader.result || "");
      // get first non-empty line
      const lines = txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const first = lines.length ? lines[0] : "";
      setEdFilePreviewLine(first);

      if (!first.startsWith(">")) {
        setEdFileWarning("Warning: FASTA header does not start with '>' — some servers expect a proper FASTA header.");
      } else {
        setEdFileWarning("");
      }
    };
    reader.onerror = () => {
      setEdFilePreviewLine("");
      setEdFileWarning("Unable to read file preview.");
    };
    reader.readAsText(file.slice(0, 1024 * 100)); // read up to 100KB for preview
  };

  // handle file select
  const onFileSelect = (file) => {
    setEdFile(file || null);
    setEdFilePreviewLine("");
    setEdFileWarning("");
    if (file) readFilePreview(file);
  };

  const handleApply = useCallback(async () => {
    setError(null);

    // Validation
    if (domain === "Taxonomy") {
      if (!taxAction) { setError(new Error("Select an action for Taxonomy.")); return; }
      if (taxAction === "list" && !taxListCount) { setError(new Error("Enter number of species.")); return; }
      if (taxAction === "species" && !taxScientificName) { setError(new Error("Enter scientific name.")); return; }
      if (taxAction === "filter" && !taxFamily && !taxGenus && !taxOrder) { setError(new Error("Enter at least one of Family/Genus/Order.")); return; }
    } else if (domain === "Otolith") {
      if (!otAction) { setError(new Error("Select an action for Otolith.")); return; }
      if (otAction === "list" && !otListCount) { setError(new Error("Enter number of species.")); return; }
      if (otAction === "byid" && !otOtolithID) { setError(new Error("Enter OtolithID.")); return; }
    } else if (domain === "eDNA") {
      if (!edAction) { setError(new Error("Select an action for eDNA.")); return; }
      if (edAction === "analyze" && !edFastaText) { setError(new Error("Enter FASTA code to analyze.")); return; }
      if (edAction === "upload" && !edFile) { setError(new Error("Choose a .fasta file to upload.")); return; }
    }

    setLoading(true);
    setNormalizedResult(null);

    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch (e) {}
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    // Backends (update host if needed)
    const baseTaxonomyBackend = "http://192.168.0.2:8000/taxonomy";
    const baseOtolithBackend = "http://192.168.0.2:8000/otolith";
    const baseEdnaBackend = "http://192.168.0.2:8000"; // base for eDNA endpoints

    try {
      if (domain === "Taxonomy") {
        let route = "/list";
        if (taxAction === "list") route = "/list";
        else if (taxAction === "species") route = `/species/${encodeURIComponent(taxScientificName)}`;
        else if (taxAction === "filter") route = "/filter";
        const suffix = route.replace(/^\/taxonomy/, "");
        const taxonomyUrl = `${baseTaxonomyBackend}${suffix}`;

        let q = "";
        if (taxAction === "filter") {
          const qp = [];
          if (taxFamily) qp.push(`family=${encodeURIComponent(taxFamily)}`);
          if (taxGenus) qp.push(`genus=${encodeURIComponent(taxGenus)}`);
          if (taxOrder) qp.push(`order=${encodeURIComponent(taxOrder)}`);
          q = qp.length ? `?${qp.join("&")}` : "";
        } else if (taxAction === "list") {
          if (taxListCount) q = `?limit=${encodeURIComponent(taxListCount)}&offset=0`; else q = `?offset=0`;
        }

        try {
          const resp = await axios.get(`${taxonomyUrl}${q}`, {
            responseType: "json",
            timeout: 45000,
            signal: controller.signal,
            headers: { Accept: "application/json" },
          });
          if (!mountedRef.current) return;
          const normalized = normalizeResponse(resp.data);
          setNormalizedResult(normalized);
          setError(null);
          return;
        } catch (getErr) {
          try {
            const postResp = await axios.post(`${baseTaxonomyBackend}${suffix}`, {
              taxonomy_action: taxAction,
              count: taxListCount,
              scientific_name: taxScientificName,
              family: taxFamily,
              genus: taxGenus,
              order: taxOrder,
            }, {
              responseType: "json",
              timeout: 45000,
              signal: controller.signal,
              headers: { "Content-Type": "application/json", Accept: "application/json" }
            });
            if (!mountedRef.current) return;
            const normalized = normalizeResponse(postResp.data);
            setNormalizedResult(normalized);
            setError(null);
            return;
          } catch (postErr) {
            throw postErr || getErr;
          }
        }
      } else if (domain === "Otolith") {
        let route = "/list";
        if (otAction === "list") route = "/list";
        else if (otAction === "byid") route = `/by-otolithid/${encodeURIComponent(otOtolithID)}`;
        const suffix = route.replace(/^\/otolith/, "");
        const otolithUrl = `${baseOtolithBackend}${suffix}`;

        let q = "";
        if (otAction === "list") {
          if (otListCount) q = `?limit=${encodeURIComponent(otListCount)}&offset=0`; else q = `?offset=0`;
        }

        try {
          const resp = await axios.get(`${otolithUrl}${q}`, {
            responseType: "json",
            timeout: 45000,
            signal: controller.signal,
            headers: { Accept: "application/json" },
          });
          if (!mountedRef.current) return;
          const normalized = normalizeResponse(resp.data);
          setNormalizedResult(normalized);
          setError(null);
          return;
        } catch (getErr) {
          try {
            const postResp = await axios.post(`${baseOtolithBackend}${suffix}`, {
              action: otAction,
              count: otListCount,
              otolith_id: otOtolithID,
            }, {
              responseType: "json",
              timeout: 45000,
              signal: controller.signal,
              headers: { "Content-Type": "application/json", Accept: "application/json" }
            });
            if (!mountedRef.current) return;
            const normalized = normalizeResponse(postResp.data);
            setNormalizedResult(normalized);
            setError(null);
            return;
          } catch (postErr) {
            throw postErr || getErr;
          }
        }
      } else if (domain === "eDNA") {
        // eDNA actions
        if (edAction === "analyze") {
          const analyzeTxtUrl = `${baseEdnaBackend}/edna/analyze`;
          const analyzeJsonUrl = `${baseEdnaBackend}/post/edna/analyze`;

          // Try text/plain first
          try {
            const resp = await axios.post(analyzeTxtUrl, edFastaText, {
              responseType: "json",
              timeout: 90000,
              signal: controller.signal,
              headers: { "Content-Type": "text/plain", Accept: "application/json" },
            });
            if (!mountedRef.current) return;
            const normalized = normalizeResponse(resp.data);
            setNormalizedResult(normalized);
            setError(null);
            return;
          } catch (txtErr) {
            // If text/plain failed, try JSON endpoint as fallback
            try {
              const resp2 = await axios.post(analyzeJsonUrl, { fasta: edFastaText }, {
                responseType: "json",
                timeout: 90000,
                signal: controller.signal,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
              });
              if (!mountedRef.current) return;
              const normalized = normalizeResponse(resp2.data);
              setNormalizedResult(normalized);
              setError(null);
              return;
            } catch (jsonErr) {
              throw txtErr || jsonErr;
            }
          }
        } else if (edAction === "upload") {
          // NEW: route uploads to /edna/upload_files
          const urlBase = `${baseEdnaBackend}/edna/upload-fasta`;

          // Candidate field names to try when server expects different multipart field name
          const candidateFieldNames = ["fasta", "file", "fasta_file", "upload"];

          // Build base FormData once (we will clone for each attempt)
          const buildForm = (fieldName) => {
            const f = new FormData();
            f.append(fieldName, edFile, edFile.name);
            // include optional metadata as convenience (server may accept them)
            f.append("original_filename", edFile.name);
            return f;
          };

          let lastErr = null;
          for (let i = 0; i < candidateFieldNames.length; i++) {
            const field = candidateFieldNames[i];
            const form = buildForm(field);
            try {
              // IMPORTANT: do NOT set Content-Type (browser/axios will set boundary)
              const resp = await axios.post(urlBase, form, {
                responseType: "json",
                timeout: 120000,
                signal: controller.signal,
                headers: { Accept: "application/json" } // no Content-Type
              });
              if (!mountedRef.current) return;
              const normalized = normalizeResponse(resp.data);
              setNormalizedResult(normalized);
              setError(null);
              return;
            } catch (errAttempt) {
              lastErr = errAttempt;
              // If server returned 422, try next field name. Otherwise break and rethrow.
              const status = errAttempt?.response?.status;
              if (status === 422) {
                // try next candidate
                continue;
              } else {
                throw errAttempt;
              }
            }
          }

          // If we exhausted candidates and still failed, throw lastErr to be handled below
          if (lastErr) throw lastErr;
        }
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("Request failed:", err);

      // Better error message extraction
      if (err.response) {
        const data = err.response.data;
        let msg;
        try {
          if (typeof data === "string") msg = data;
          else if (typeof data === "object") msg = JSON.stringify(data, null, 2);
          else msg = String(data);
        } catch (e) {
          msg = String(data);
        }
        setError(new Error(`Server returned ${err.response.status}: ${msg}`));
      } else if (err.request) {
        setError(new Error("No response from server. Check backend & CORS."));
      } else {
        setError(new Error(err.message || "Unknown error"));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [
    domain,
    taxAction, taxListCount, taxScientificName, taxFamily, taxGenus, taxOrder,
    otAction, otListCount, otOtolithID,
    edAction, edFastaText, edFile
  ]);

  return (
    <div className="ins-layout">
      <div className="ins-banner">
        <span className="ins-banner-label">DATA INSIGHTS</span>
        <span className="ins-banner-sub">Switch domain to view taxonomy, otolith or eDNA endpoints</span>
      </div>

      <section className="ins-grid">
        <div className="ins-panel ins-left">
          <h3 className="ins-title">Controls</h3>
          <p className="ins-text">Choose a domain and action, provide inputs and Apply.</p>

          {/* Domain selector */}
          <div className="ins-field">
            <label>Domain</label>
            <select value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="Taxonomy">Taxonomy</option>
              <option value="Otolith">Otolith</option>
              <option value="eDNA">eDNA</option>
            </select>
          </div>

          {/* Taxonomy UI */}
          {domain === "Taxonomy" && (
            <>
              <div className="ins-field">
                <label>Select:</label>
                <select value={taxAction} onChange={(e) => { setTaxAction(e.target.value); setNormalizedResult(null); }}>
                  <option value="">-- choose action --</option>
                  <option value="list">List Species</option>
                  <option value="species">Species Taxonomy</option>
                  <option value="filter">Filter Taxonomy</option>
                </select>
              </div>

              {taxAction === "list" && (
                <div className="ins-field">
                  <label>Enter number of species</label>
                  <input placeholder="Enter number of species" value={taxListCount} onChange={(e) => setTaxListCount(e.target.value)} />
                  <small className="ins-note">Requests /taxonomy/list?limit=&offset=0</small>
                </div>
              )}

              {taxAction === "species" && (
                <div className="ins-field">
                  <label>Enter Scientific Name</label>
                  <input placeholder="Enter Scientific Name" value={taxScientificName} onChange={(e) => setTaxScientificName(e.target.value)} />
                  <small className="ins-note">Requests /taxonomy/species/{`{name}`}</small>
                </div>
              )}

              {taxAction === "filter" && (
                <>
                  <div className="ins-field"><label>Family</label><input placeholder="Enter Family" value={taxFamily} onChange={(e) => setTaxFamily(e.target.value)} /></div>
                  <div className="ins-field"><label>Genus</label><input placeholder="Enter Genus" value={taxGenus} onChange={(e) => setTaxGenus(e.target.value)} /></div>
                  <div className="ins-field"><label>Order</label><input placeholder="Enter Order" value={taxOrder} onChange={(e) => setTaxOrder(e.target.value)} /></div>
                  <small className="ins-note">Requests /taxonomy/filter?family=&genus=&order=</small>
                </>
              )}
            </>
          )}

          {/* Otolith UI */}
          {domain === "Otolith" && (
            <>
              <div className="ins-field">
                <label>Select:</label>
                <select value={otAction} onChange={(e) => { setOtAction(e.target.value); setNormalizedResult(null); }}>
                  <option value="">-- choose action --</option>
                  <option value="list">List Species</option>
                  <option value="byid">Get by Otolith ID</option>
                </select>
              </div>

              {otAction === "list" && (
                <div className="ins-field">
                  <label>Enter number of species</label>
                  <input placeholder="Enter number of species" value={otListCount} onChange={(e) => setOtListCount(e.target.value)} />
                  <small className="ins-note">Requests /otolith/list?limit=&offset=0</small>
                </div>
              )}

              {otAction === "byid" && (
                <div className="ins-field">
                  <label>Enter OtolithID</label>
                  <input placeholder="Enter OtolithID" value={otOtolithID} onChange={(e) => setOtOtolithID(e.target.value)} />
                  <small className="ins-note">Requests /otolith/by-otolithid/{`{id}`}</small>
                </div>
              )}
            </>
          )}

          {/* eDNA UI */}
          {domain === "eDNA" && (
            <>
              <div className="ins-field">
                <label>Select:</label>
                <select value={edAction} onChange={(e) => { setEdAction(e.target.value); setNormalizedResult(null); }}>
                  <option value="">-- choose action --</option>
                  <option value="analyze">FASTA Analysis</option>
                  <option value="upload">Upload FASTA File</option>
                </select>
              </div>

              {edAction === "analyze" && (
                <div className="ins-field">
                  <label>Enter FASTA Code</label>
                  <textarea
                    placeholder="Enter FASTA Code (start with >header line)"
                    value={edFastaText}
                    onChange={(e) => setEdFastaText(e.target.value)}
                    rows={6}
                  />
                  <small className="ins-note">POST /edna/analyze with Content-Type: text/plain (fallback /post/edna/analyze)</small>
                </div>
              )}

              {edAction === "upload" && (
                <>
                  <div className="ins-field">
                    <label>Upload FASTA File</label>
                    <input
                      type="file"
                      accept=".fasta,.fa,.fna"
                      onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        onFileSelect(f || null);
                      }}
                    />
                    <small className="ins-note">POST /edna/upload_files (multipart/form-data). Field names tried: fasta,file,fasta_file,upload</small>
                  </div>

                  {edFile && (
                    <div style={{ marginTop: 8, color: "#cfe7ff" }}>
                      <div><strong>Selected:</strong> {edFile.name} — {(edFile.size/1024).toFixed(1)} KB</div>
                      <div style={{ marginTop: 6 }}>
                        <strong>Preview (first non-empty line):</strong>
                        <div style={{ marginTop: 6, background: "rgba(2,6,23,0.5)", padding: 8, borderRadius: 6, color: "#dbeafe" }}>
                          <code style={{ whiteSpace: "pre-wrap" }}>{edFilePreviewLine || "—"}</code>
                        </div>
                        {edFileWarning && <div style={{ marginTop: 6, color: "#ffcccb" }}>{edFileWarning}</div>}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div style={{ marginTop: 10 }}>
            <button className="ins-action-btn" onClick={handleApply} disabled={loading}>{loading ? "Fetching…" : "Apply"}</button>
          </div>

          {error && <div style={{ marginTop: 10, color: "#ffbdbd", whiteSpace: "pre-wrap" }}>{error.message}</div>}
        </div>

        <div className="ins-panel ins-right">
          <h3 className="ins-title">Results</h3>
          <p className="ins-text">Response will appear here (table + cards). All keys are shown as columns.</p>

          {normalizedResult ? (
            <DataResultView normalized={normalizedResult} />
          ) : loading ? (
            <div style={{ color: "#9fb4d8" }}>Fetching data…</div>
          ) : (
            <div style={{ color: "#9ca3af" }}>
              <p>No response yet. Choose domain + action and click Apply.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DataInsightsModule;
