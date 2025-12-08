// src/modules/CloudDataServerModule.js
import React, { useState, useMemo, useEffect } from "react";
import "./CloudDataServerModule.css";

/* (DOMAINS + safeFetch + other logic unchanged) */
const DOMAINS = [
  { id: "oceanographic", label: "Oceanography", description: "CTD, nutrients, currents, satellite SST & Chl-a grids." },
  { id: "biodiversity", label: "Biodiversity", description: "Species diversity, ecosystem assessments, biodiversity indices." },
  { id: "edna", label: "Molecular / eDNA", description: "DNA barcodes, eDNA reads, metabarcoding matrices." },
  { id: "otolith", label: "Taxonomy & Systematics", description: "Species checklists, occurrence tables, reference libraries." },
];

const DEFAULT_BACKEND = "http://127.0.0.1:8000";

export default function CloudDataServerModule({ apiBase = "" }) {
  const effectiveApiBase = apiBase || (window && window.__API_BASE__) || "";

  const [activeDomain, setActiveDomain] = useState("oceanographic");
  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [presigns, setPresigns] = useState({});
  const [loadingPresign, setLoadingPresign] = useState({});
  const [error, setError] = useState(null);
  const [lastApiUsed, setLastApiUsed] = useState(null);
  const [triedFallbackThisCall, setTriedFallbackThisCall] = useState(false);

  const activeDomainMeta = useMemo(() => DOMAINS.find((d) => d.id === activeDomain), [activeDomain]);

  useEffect(() => {
    listDatasets(activeDomain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDomain]);

  function buildUrl(base, path) {
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (!base) return path.startsWith("/") ? path : "/" + path;
    return base.replace(/\/+$/, "") + (path.startsWith("/") ? path : "/" + path);
  }

  // safeFetch (same as before)
  async function safeFetch(pathOrFullUrl, opts = {}) {
    const explicitFullUrl = pathOrFullUrl.startsWith("http://") || pathOrFullUrl.startsWith("https://");
    const primaryBase = effectiveApiBase;
    const primaryUrl = explicitFullUrl ? pathOrFullUrl : buildUrl(primaryBase, pathOrFullUrl);

    try {
      const primaryResp = await fetch(primaryUrl, { ...opts, cache: opts.cache ?? "no-store" });
      const ct = primaryResp.headers.get("content-type") || "";

      if (ct.includes("text/html")) {
        if (triedFallbackThisCall) {
          const html = await primaryResp.text();
          setLastApiUsed(primaryUrl);
          setTriedFallbackThisCall(false);
          return { ok: primaryResp.ok, status: primaryResp.status, contentType: ct, text: html, usedBase: primaryUrl };
        }

        const fallbackBase = primaryBase ? primaryBase : DEFAULT_BACKEND;
        const fallbackUrl = buildUrl(fallbackBase, pathOrFullUrl);

        if (fallbackUrl === primaryUrl) {
          const body = await primaryResp.text();
          setLastApiUsed(primaryUrl);
          return { ok: primaryResp.ok, status: primaryResp.status, contentType: ct, text: body, usedBase: primaryUrl };
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
          const primaryText = await primaryResp.text();
          setLastApiUsed(primaryUrl);
          setTriedFallbackThisCall(false);
          return { ok: primaryResp.ok, status: primaryResp.status, contentType: ct, text: primaryText, usedBase: primaryUrl, error: fbErr };
        }
      }

      if (ct.includes("application/json")) {
        const json = await primaryResp.json();
        setLastApiUsed(primaryUrl);
        setTriedFallbackThisCall(false);
        return { ok: primaryResp.ok, status: primaryResp.status, contentType: ct, json, usedBase: primaryUrl };
      }

      const text = await primaryResp.text();
      setLastApiUsed(primaryUrl);
      setTriedFallbackThisCall(false);
      return { ok: primaryResp.ok, status: primaryResp.status, contentType: ct, text, usedBase: primaryUrl };
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

  // debug-friendly listDatasets (keeps previous debug behavior)
  async function listDatasets(domain) {
    setError(null);
    setLoadingDatasets(true);
    setDatasets([]);
    try {
      const apiPath = `/api/datasets/${encodeURIComponent(domain)}`;
      const result = await safeFetch(apiPath, { method: "GET" });

      const debug = {
        requestedDomain: domain,
        requestedPath: apiPath,
        usedBase: result.usedBase || "(none)",
        status: result.status || 0,
        contentType: result.contentType || "(unknown)",
        ok: result.ok || false,
        jsonPreview: result.json ? (Array.isArray(result.json) ? result.json.slice(0, 20) : result.json) : null,
        textPreview: result.text ? result.text.substring(0, 1200) : null,
        error: result.error ? String(result.error) : null,
      };

      if (!result.ok || !result.contentType || !result.contentType.includes("application/json")) {
        setError(`Debug: ${JSON.stringify(debug, null, 2)}`);
      }

      if (!result.ok) {
        const bodyText = result.text || JSON.stringify(result.json) || "";
        throw new Error(`List failed: ${result.status} ${bodyText}`);
      }

      if (result.contentType && result.contentType.includes("application/json") && Array.isArray(result.json)) {
        setDatasets(result.json);
        setError(null);
        return;
      }

      if (result.text) {
        throw new Error(`Expected JSON but got: content-type=${result.contentType} body=${result.text.substring(0, 2000)}`);
      }

      setDatasets([]);
    } catch (err) {
      console.error("listDatasets error:", err);
      setError(String(err.message || err));
    } finally {
      setLoadingDatasets(false);
    }
  }

  async function requestAccess(domain, dataset) {
    setError(null);
    setLoadingPresign((p) => ({ ...p, [dataset]: true }));
    try {
      const apiPath = `/api/presign`;
      const result = await safeFetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, dataset, expires_in: 300 }),
      });

      if (result.usedBase) setLastApiUsed(result.usedBase);

      if (!result.ok) {
        const body = result.text || JSON.stringify(result.json) || "";
        throw new Error(`Presign failed: ${result.status} ${body}`);
      }

      if (result.contentType && result.contentType.includes("application/json") && result.json) {
        setPresigns((p) => ({ ...p, [dataset]: result.json }));
        return;
      }

      if (result.text) {
        throw new Error(`Presign response not JSON: ${result.text}`);
      }

      throw new Error("Unknown presign error");
    } catch (err) {
      console.error("requestAccess error:", err);
      setError(err.message || "Failed to request access");
    } finally {
      setLoadingPresign((p) => ({ ...p, [dataset]: false }));
    }
  }

  // AccessControls stays but we'll render it at the bottom (replacing View button)
  function AccessControls({ domain, dataset }) {
    const presign = presigns[dataset] || null;
    const requesting = !!loadingPresign[dataset];

    if (!presign) {
      return (
        <button
          type="button"
          className="btn cloud-btn-view"
          onClick={() => requestAccess(domain, dataset)}
          disabled={requesting}
        >
          {requesting ? "Requesting…" : "Request access"}
        </button>
      );
    }

    const { raw_url, curated_url, metadata_url } = presign || {};
    return (
      <div className="access-buttons" role="group" aria-label={`access-${dataset}`}>
        {raw_url ? (
          <a className="access-btn" href={raw_url} target="_blank" rel="noreferrer" download title="Download raw file">Raw</a>
        ) : (
          <button className="access-btn disabled" aria-disabled="true" title="Raw not available">Raw</button>
        )}

        {curated_url ? (
          <a className="access-btn" href={curated_url} target="_blank" rel="noreferrer" download title="Download curated file">Curated</a>
        ) : (
          <button className="access-btn disabled" aria-disabled="true" title="Curated not available">Curated</button>
        )}

        {metadata_url ? (
          <a className="access-btn" href={metadata_url} target="_blank" rel="noreferrer" download title="Download metadata">Metadata</a>
        ) : (
          <button className="access-btn disabled" aria-disabled="true" title="Metadata not available">Metadata</button>
        )}
      </div>
    );
  }

  const readableApiUsed = lastApiUsed ? (lastApiUsed.startsWith("/") ? "same-origin (relative /api/...)" : lastApiUsed) : null;

  return (
    <div className="cloud-layout">
      {readableApiUsed && (
        <div style={{ background: "#071226", color: "#fbbf24", padding: 8, borderRadius: 6, marginBottom: 8 }}>
          Using API: <strong style={{ color: "#fff" }}>{readableApiUsed}</strong>
        </div>
      )}

      <section className="cloud-domain-grid" role="tablist" aria-label="domains">
        {DOMAINS.map((dom) => (
          <button
            key={dom.id}
            type="button"
            className={dom.id === activeDomain ? "cloud-domain-card cloud-domain-card-active" : "cloud-domain-card"}
            onClick={() => setActiveDomain(dom.id)}
            aria-pressed={dom.id === activeDomain}
          >
            <div className="cloud-domain-label">{dom.label}</div>
            <p className="cloud-domain-desc">{dom.description}</p>
          </button>
        ))}
      </section>

      <section className="cloud-datasets-panel" aria-live="polite">
        <header className="cloud-datasets-header">
          <div>
            <h3 className="cloud-datasets-title">{activeDomainMeta?.label || "Selected domain"}</h3>
            <p className="cloud-datasets-subtitle">
              {loadingDatasets ? "Loading datasets…" : `${datasets.length} dataset${datasets.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>

          <div className="cloud-datasets-meta">
            <span className="cloud-chip">
              Node group:{" "}
              {activeDomain === "oceanography"
                ? "OCN-*"
                : activeDomain === "biodiversity"
                ? "BIO-*"
                : activeDomain === "molecular"
                ? "MOL-*"
                : "TAX-*"}
            </span>
          </div>
        </header>

        <div className="cloud-dataset-list">
          {error && (
            <div style={{ color: "salmon", padding: 8, fontWeight: 600 }}>
              {error}
            </div>
          )}

          {datasets.length === 0 && !loadingDatasets && (
            <div className="cloud-empty-state">
              <p className="cloud-empty-title">No datasets registered</p>
              <p className="cloud-empty-text">
                This domain does not have any datasets yet in the Cloud Data Server.
                Once ingestion pipelines are configured, they will appear here.
              </p>
            </div>
          )}

          {datasets.map((name) => (
            <article key={name} className="cloud-dataset-card" aria-label={`dataset-${name}`}>
              <div className="cloud-dataset-main">
                <h4 className="cloud-dataset-name">{name}</h4>
                <p className="cloud-dataset-type">Dataset</p>

                <div className="cloud-dataset-tags">
                  <span className="cloud-pill cloud-pill-domain">{activeDomainMeta?.label}</span>
                  <span className="cloud-pill status-online">Status: Online</span>
                </div>
              </div>

              <div className="cloud-dataset-meta">
                <p className="cloud-meta-line"><span className="cloud-meta-label">Access:</span> Controlled</p>
                <p className="cloud-meta-line"><span className="cloud-meta-label">Updated:</span> —</p>

                {/* Access controls moved to bottom (replaces removed View dataset button) */}
                <AccessControls domain={activeDomain} dataset={name} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
