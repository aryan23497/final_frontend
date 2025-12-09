// src/modules/DataAccessServerModule.js
import React, { useMemo, useState } from "react";
import "./DataAccessServerModule.css";

/**
 * DataAccessServerModule — JS updated to match your original DAS CSS layout
 *
 * Behaviour:
 * - Domain options limited to: Oceanography, Biodiversity, eDNA, Otolith taxonomy (+ "All domains")
 * - Data sensitivity dropdown is static UI-only
 * - "Apply filters" triggers listing:
 *    - single domain -> GET /api/datasets/{domain}
 *    - "all" -> parallel GETs and merge results
 * - Each dataset row has "Request access" which POSTs to /api/presign
 *   and then is replaced by 3 buttons: Raw / Curated / Metadata
 *
 * Notes:
 * - Uses safeFetch fallback logic similar to your earlier component (tries effectiveApiBase then fallback).
 * - Keeps markup class names to match the CSS you provided so positions/styling remain unchanged. 
 * - No CSS was changed. See CSS file you provided for DAS styling. :contentReference[oaicite:2]{index=2}
 */

// domain options (IDs used in API)
const DOMAIN_OPTIONS = [
  { id: "all", label: "All domains" },
  { id: "oceanographic", label: "Oceanography" },
  { id: "biodiversity", label: "Biodiversity" }, // changed from fisheries
  { id: "edna", label: "eDNA" },                // edna label
  { id: "otolith", label: "Otolith taxonomy" },// changed label
];

const SENSITIVITY_OPTIONS = [
  { id: "public", label: "Public" },
  { id: "sensitive", label: "Sensitive" },
  { id: "restricted", label: "Restricted" },
];

const DEFAULT_BACKEND = "http://127.0.0.1:8000";

export default function DataAccessServerModule({ apiBase = "" }) {
  const effectiveApiBase = apiBase || (typeof window !== "undefined" && window.__API_BASE__) || "";

  // state
  const [selectedDomain, setSelectedDomain] = useState("oceanographic");
  const [selectedSensitivity, setSelectedSensitivity] = useState("public"); // UI-only
  const [datasets, setDatasets] = useState([]); // [{ name, domain }]
  const [loading, setLoading] = useState(false);
  const [presigns, setPresigns] = useState({}); // key -> { raw_url, curated_url, metadata_url }
  const [loadingPresign, setLoadingPresign] = useState({}); // key -> bool
  const [error, setError] = useState(null);
  const [lastApiUsed, setLastApiUsed] = useState(null);
  const [triedFallbackThisCall, setTriedFallbackThisCall] = useState(false);

  // domain map for labels
  const domainMap = useMemo(() => {
    const m = {};
    DOMAIN_OPTIONS.forEach((d) => (m[d.id] = d.label));
    return m;
  }, []);

  // helpers
  function buildUrl(base, path) {
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (!base) return path.startsWith("/") ? path : "/" + path;
    return base.replace(/\/+$/, "") + (path.startsWith("/") ? path : "/" + path);
  }

  // safe fetch with fallback to DEFAULT_BACKEND (keeps debug info)
  async function safeFetch(pathOrFullUrl, opts = {}) {
    const explicit = pathOrFullUrl.startsWith("http://") || pathOrFullUrl.startsWith("https://");
    const primaryBase = effectiveApiBase;
    const primaryUrl = explicit ? pathOrFullUrl : buildUrl(primaryBase, pathOrFullUrl);

    try {
      const resp = await fetch(primaryUrl, { ...opts, cache: opts.cache ?? "no-store" });
      const ct = resp.headers.get("content-type") || "";

      // If we accidentally get HTML (index.html), try fallback once
      if (ct.includes("text/html")) {
        if (triedFallbackThisCall) {
          const text = await resp.text();
          setLastApiUsed(primaryUrl);
          setTriedFallbackThisCall(false);
          return { ok: resp.ok, status: resp.status, contentType: ct, text, usedBase: primaryUrl };
        }

        const fallbackBase = primaryBase ? primaryBase : DEFAULT_BACKEND;
        const fallbackUrl = buildUrl(fallbackBase, pathOrFullUrl);

        if (fallbackUrl === primaryUrl) {
          const body = await resp.text();
          setLastApiUsed(primaryUrl);
          return { ok: resp.ok, status: resp.status, contentType: ct, text: body, usedBase: primaryUrl };
        }

        setTriedFallbackThisCall(true);
        try {
          const fallbackResp = await fetch(fallbackUrl, { ...opts, cache: opts.cache ?? "no-store" });
          const fct = fallbackResp.headers.get("content-type") || "";
          if (fct.includes("application/json")) {
            const json = await fallbackResp.json();
            setLastApiUsed(fallbackUrl);
            setTriedFallbackThisCall(false);
            return { ok: fallbackResp.ok, status: fallbackResp.status, contentType: fct, json, usedBase: fallbackUrl };
          } else {
            const text = await fallbackResp.text();
            setLastApiUsed(fallbackUrl);
            setTriedFallbackThisCall(false);
            return { ok: fallbackResp.ok, status: fallbackResp.status, contentType: fct, text, usedBase: fallbackUrl };
          }
        } catch (fbErr) {
          const ptext = await resp.text();
          setLastApiUsed(primaryUrl);
          setTriedFallbackThisCall(false);
          return { ok: resp.ok, status: resp.status, contentType: ct, text: ptext, usedBase: primaryUrl, error: fbErr };
        }
      }

      if (ct.includes("application/json")) {
        const json = await resp.json();
        setLastApiUsed(primaryUrl);
        setTriedFallbackThisCall(false);
        return { ok: resp.ok, status: resp.status, contentType: ct, json, usedBase: primaryUrl };
      }

      const text = await resp.text();
      setLastApiUsed(primaryUrl);
      setTriedFallbackThisCall(false);
      return { ok: resp.ok, status: resp.status, contentType: ct, text, usedBase: primaryUrl };
    } catch (err) {
      if (!triedFallbackThisCall) {
        setTriedFallbackThisCall(true);
        const fallbackUrl = buildUrl(DEFAULT_BACKEND, pathOrFullUrl);
        try {
          const fallbackResp = await fetch(fallbackUrl, { ...opts, cache: opts.cache ?? "no-store" });
          const fct = fallbackResp.headers.get("content-type") || "";
          if (fct.includes("application/json")) {
            const json = await fallbackResp.json();
            setLastApiUsed(fallbackUrl);
            setTriedFallbackThisCall(false);
            return { ok: fallbackResp.ok, status: fallbackResp.status, contentType: fct, json, usedBase: fallbackUrl };
          } else {
            const text = await fallbackResp.text();
            setLastApiUsed(fallbackUrl);
            setTriedFallbackThisCall(false);
            return { ok: fallbackResp.ok, status: fallbackResp.status, contentType: fct, text, usedBase: fallbackUrl };
          }
        } catch (fbErr) {
          setTriedFallbackThisCall(false);
          return { ok: false, status: 0, error: fbErr, usedBase: null };
        }
      }
      return { ok: false, status: 0, error: err, usedBase: null };
    }
  }

  // unique key to avoid collisions when merging lists
  function datasetKey(domain, name) {
    return `${domain}::${name}`;
  }

  // Apply filters: fetch datasets
  async function applyFilters() {
    setError(null);
    setDatasets([]);
    setPresigns({});
    setLoading(true);

    try {
      if (selectedDomain === "all") {
        const domainIds = DOMAIN_OPTIONS.filter((d) => d.id !== "all").map((d) => d.id);
        const requests = domainIds.map((dom) =>
          safeFetch(`/api/datasets/${encodeURIComponent(dom)}`, { method: "GET" }).then((res) => ({ dom, res }))
        );

        const results = await Promise.all(requests);
        const merged = [];
        const seen = new Set();

        for (const { dom, res } of results) {
          if (!res.ok) {
            const body = res.text || JSON.stringify(res.json) || "";
            throw new Error(`List failed for ${dom}: ${res.status} ${body}`);
          }
          if (res.contentType && res.contentType.includes("application/json") && Array.isArray(res.json)) {
            for (const name of res.json) {
              const key = datasetKey(dom, name);
              if (!seen.has(key)) {
                seen.add(key);
                merged.push({ name, domain: dom });
              }
            }
          } else {
            const t = res.text || "(no body)";
            throw new Error(`Expected JSON from ${dom} but got: ${t}`);
          }
        }

        setDatasets(merged);
        setError(null);
      } else {
        const res = await safeFetch(`/api/datasets/${encodeURIComponent(selectedDomain)}`, { method: "GET" });
        if (!res.ok) {
          const body = res.text || JSON.stringify(res.json) || "";
          throw new Error(`List failed: ${res.status} ${body}`);
        }
        if (res.contentType && res.contentType.includes("application/json") && Array.isArray(res.json)) {
          const arr = res.json.map((name) => ({ name, domain: selectedDomain }));
          setDatasets(arr);
          setError(null);
        } else {
          const t = res.text || "(no body)";
          throw new Error(`Expected JSON but got: ${t}`);
        }
      }
    } catch (err) {
      console.error("applyFilters error:", err);
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // Request presign
  async function requestAccess(domain, name) {
    const key = datasetKey(domain, name);
    setLoadingPresign((p) => ({ ...p, [key]: true }));
    setError(null);

    try {
      const res = await safeFetch("/api/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, dataset: name, expires_in: 300 }),
      });

      if (!res.ok) {
        const body = res.text || JSON.stringify(res.json) || "";
        throw new Error(`Presign failed: ${res.status} ${body}`);
      }

      if (res.contentType && res.contentType.includes("application/json") && res.json) {
        setPresigns((p) => ({ ...p, [key]: res.json }));
      } else {
        const t = res.text || "(no body)";
        throw new Error(`Presign response not JSON: ${t}`);
      }
    } catch (err) {
      console.error("requestAccess error:", err);
      setError(String(err.message || err));
    } finally {
      setLoadingPresign((p) => ({ ...p, [key]: false }));
    }
  }

  // Access controls (placed inside dataset meta area so position doesn't change)
  function AccessControls({ domain, name }) {
    const key = datasetKey(domain, name);
    const presign = presigns[key] || null;
    const requesting = !!loadingPresign[key];

    // match the original request button class from CSS
    if (!presign) {
      return (
        <button
          className="btn das-btn-request"
          onClick={() => requestAccess(domain, name)}
          disabled={requesting}
          title="Request access"
        >
          {requesting ? "Requesting…" : "Request access"}
        </button>
      );
    }

    const { raw_url, curated_url, metadata_url } = presign;

    // use existing button classes so visual position & look remains consistent with CSS
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center", marginTop: 6 }}>
        {raw_url ? (
          <a className="btn das-btn-secondary" href={raw_url} target="_blank" rel="noreferrer" download>
            Raw
          </a>
        ) : (
          <button className="btn das-btn-secondary" disabled>
            Raw
          </button>
        )}

        {curated_url ? (
          <a className="btn das-btn-secondary" href={curated_url} target="_blank" rel="noreferrer" download>
            Curated
          </a>
        ) : (
          <button className="btn das-btn-secondary" disabled>
            Curated
          </button>
        )}

        {metadata_url ? (
          <a className="btn das-btn-secondary" href={metadata_url} target="_blank" rel="noreferrer" download>
            Metadata
          </a>
        ) : (
          <button className="btn das-btn-secondary" disabled>
            Metadata
          </button>
        )}
      </div>
    );
  }

  // RENDER - uses the same class names & layout the CSS expects (left panel = .das-filter-panel, right panel = .das-results-panel)
  return (
    <div className="das-layout">
      {/* LEFT: filters panel — class names match your CSS so positions won't change. */}
      <aside className="das-filter-panel" aria-label="Filters">
        <div className="das-panel-title">Filters</div>
        <div className="das-panel-subtitle">Choose domain and sensitivity</div>

        <div className="das-form">
          <div className="das-field">
            <label className="das-label">Domain</label>
            <select
              className="das-input"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {DOMAIN_OPTIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="das-field">
            <label className="das-label">Data sensitivity</label>
            <select
              className="das-input"
              value={selectedSensitivity}
              onChange={(e) => setSelectedSensitivity(e.target.value)}
            >
              {SENSITIVITY_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="das-actions">
            <button className="btn das-btn-primary" onClick={applyFilters} disabled={loading}>
              {loading ? "Applying…" : "Apply filters"}
            </button>
            <button
              className="btn das-btn-secondary"
              onClick={() => {
                // reset UI-only filters quickly
                setSelectedDomain("oceanographic");
                setSelectedSensitivity("public");
                setDatasets([]);
                setPresigns({});
                setError(null);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT: results panel — class names match your CSS to preserve positions */}
      <section className="das-results-panel" aria-label="Results">
        <div className="das-results-header">
          <div>
            <div className="das-results-title">Datasets</div>
            <div className="das-results-subtitle">{datasets.length} dataset{datasets.length !== 1 ? "s" : ""}</div>
          </div>

          <div className="das-active-filters">
            <div className="das-chip">Domain: {domainMap[selectedDomain]}</div>
            <div className="das-chip das-chip-muted">Sensitivity: {selectedSensitivity}</div>
          </div>
        </div>

        {/* debug bar if needed */}
        {lastApiUsed && (
          <div style={{ marginBottom: 8, color: "#fbbf24", background: "#071226", padding: 6, borderRadius: 6 }}>
            Using API: <strong>{lastApiUsed}</strong>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 8 }} className="das-error">
            {error}
          </div>
        )}

        <div className="das-dataset-list">
          {datasets.length === 0 && !loading && (
            <div className="das-empty-state">
              <div className="das-empty-title">No datasets found</div>
              <div className="das-empty-text">Click Apply filters to load datasets for the selected domain.</div>
            </div>
          )}

          {datasets.map((item) => (
            <article key={datasetKey(item.domain, item.name)} className="das-dataset-card" role="article">
              <div className="das-dataset-main">
                <div className="das-dataset-name">{item.name}</div>
                <div className="das-dataset-type">{/* optional small type text */}</div>

                <div className="das-dataset-tags" style={{ marginTop: 8 }}>
                  <span className={`das-pill domain-${item.domain === "oceanographic" ? "oceanography" : item.domain}`}>
                    {domainMap[item.domain] || item.domain}
                  </span>
                  <span className="das-pill sensitivity-low">{/* placeholder */}Access: Controlled</span>
                </div>
              </div>

              <div className="das-dataset-meta">
                <div className="das-meta-line"><span className="das-meta-label">Updated:</span> —</div>

                {/* ACCESS controls placed here so the button occupies the same area as before */}
                <AccessControls domain={item.domain} name={item.name} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
