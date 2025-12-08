// src/modules/DataRequestModule.js
import React, { useState } from "react";
import "./DataRequestModule.css";

// Domains (GIS removed for requests)
const DOMAINS = [
  { value: "all", label: "All domains" },
  { value: "oceanography", label: "Oceanography" },
  { value: "fisheries", label: "Fisheries" },
  { value: "edna", label: "eDNA / Metabarcoding" },
  { value: "molecular", label: "Molecular Biology / Barcoding" },
  { value: "taxonomy", label: "Taxonomy & Systematics" },
];

// Sample catalogue used for filtering
const SAMPLE_DATASETS = [
  {
    id: 1,
    name: "Arabian Sea CTD & Nutrients (2018–2022)",
    domain: "oceanography",
    type: "Physical + Chemical",
    size: "4.2 GB",
    updated: "2024-01-10",
    tags: ["CTD", "Nutrients", "Time-series"],
  },
  {
    id: 2,
    name: "Pelagic Fish Acoustic Survey – Eastern Arabian Sea",
    domain: "fisheries",
    type: "Acoustic + Trawl",
    size: "1.8 GB",
    updated: "2023-11-02",
    tags: ["Fisheries", "Biomass", "Acoustics"],
  },
  {
    id: 3,
    name: "Coastal eDNA – Kerala Shelf (Pilot Transects)",
    domain: "edna",
    type: "eDNA Reads (FASTQ)",
    size: "850 MB",
    updated: "2024-02-18",
    tags: ["eDNA", "Metabarcoding", "Coastal"],
  },
  {
    id: 4,
    name: "Reference Fish Barcode Library – Indian EEZ",
    domain: "molecular",
    type: "COI + 16S Sequences",
    size: "620 MB",
    updated: "2023-09-25",
    tags: ["DNA Barcoding", "Reference Library"],
  },
  {
    id: 6,
    name: "Indian EEZ Fish Occurrence Records",
    domain: "taxonomy",
    type: "Occurrence Table",
    size: "320 MB",
    updated: "2023-08-14",
    tags: ["Taxonomy", "Occurrences", "Species"],
  },
];

const DataRequestModule = () => {
  // filters for catalogue
  const [filters, setFilters] = useState({
    domain: "all",
    search: "",
  });

  const [filteredData, setFilteredData] = useState(SAMPLE_DATASETS);

  // datasets for which user clicked "Request Access"
  const [requestedDatasets, setRequestedDatasets] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();

    let result = [...SAMPLE_DATASETS];

    if (filters.domain !== "all") {
      result = result.filter((d) => d.domain === filters.domain);
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    setFilteredData(result);
  };

  const handleReset = () => {
    setFilters({
      domain: "all",
      search: "",
    });
    setFilteredData(SAMPLE_DATASETS);
  };

  const handleRequestAccess = (dataset) => {
    // add to requested list if not already present
    setRequestedDatasets((prev) => {
      const exists = prev.some((d) => d.id === dataset.id);
      if (exists) return prev;
      return [...prev, dataset];
    });

    alert(
      `Request submitted for dataset: "${dataset.name}".\n\nA download link appears in the Requested Datasets box below (mock).`
    );
  };

  return (
    <div className="drq-layout">
      {/* LEFT: FILTER FORM */}
      <section className="drq-filter-panel">
        <h3 className="drq-panel-title">Data Request · Catalogue</h3>
        <p className="drq-panel-subtitle">
          Filter available datasets by domain and search terms. Requested
          datasets will appear in a separate download box (prototype).
        </p>

        <form className="drq-form" onSubmit={handleApplyFilters}>
          {/* Domain dropdown */}
          <label className="drq-field">
            <span className="drq-label">Domain</span>
            <select
              name="domain"
              value={filters.domain}
              onChange={handleChange}
              className="drq-input"
            >
              {DOMAINS.map((dom) => (
                <option key={dom.value} value={dom.value}>
                  {dom.label}
                </option>
              ))}
            </select>
          </label>

          {/* Search */}
          <label className="drq-field">
            <span className="drq-label">Search</span>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Dataset name, tag, or type…"
              className="drq-input"
            />
          </label>

          <p className="drq-note">
            * Prototype only. In the full OASIS stack, approvals and secure
            download URLs will be provided from the backend (FastAPI + Cloud
            Data Server).
          </p>

          <div className="drq-actions">
            <button type="submit" className="btn drq-btn-primary">
              Apply Filters
            </button>
            <button
              type="button"
              className="btn drq-btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* RIGHT COLUMN: box 1 = Filtered, box 2 = Requested */}
      <div className="drq-right-column">
        {/* BOX 1: FILTERED DATASETS */}
        <section className="drq-results-panel">
          <header className="drq-results-header">
            <div>
              <p className="drq-results-title">Filtered Datasets</p>
              <p className="drq-results-subtitle">
                {filteredData.length} dataset
                {filteredData.length !== 1 ? "s" : ""} match your filters.
              </p>
            </div>
            <div className="drq-active-filters">
              {filters.domain !== "all" && (
                <span className="drq-chip">
                  Domain:{" "}
                  {
                    DOMAINS.find((d) => d.value === filters.domain)
                      ?.label
                  }
                </span>
              )}
              {filters.search.trim() ? (
                <span className="drq-chip">
                  Search: “{filters.search}”
                </span>
              ) : (
                filters.domain === "all" && (
                  <span className="drq-chip drq-chip-muted">
                    No filters applied
                  </span>
                )
              )}
            </div>
          </header>

          {/* Scrollable dataset list */}
          <div className="drq-dataset-scroll">
            <div className="drq-dataset-list">
              {filteredData.map((d) => (
                <article key={d.id} className="drq-dataset-card">
                  <div className="drq-dataset-main">
                    <h4 className="drq-dataset-name">{d.name}</h4>
                    <p className="drq-dataset-type">{d.type}</p>
                    <div className="drq-dataset-tags">
                      <span className={`drq-pill domain-${d.domain}`}>
                        {d.domain}
                      </span>
                      {d.tags.map((t) => (
                        <span key={t} className="drq-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="drq-dataset-meta">
                    <p className="drq-meta-line">
                      <span className="drq-meta-label">Size:</span>{" "}
                      {d.size}
                    </p>
                    <p className="drq-meta-line">
                      <span className="drq-meta-label">
                        Last updated:
                      </span>{" "}
                      {d.updated}
                    </p>
                    <button
                      type="button"
                      className="btn drq-btn-request"
                      onClick={() => handleRequestAccess(d)}
                    >
                      Request Access
                    </button>
                  </div>
                </article>
              ))}

              {filteredData.length === 0 && (
                <div className="drq-empty-state">
                  <p className="drq-empty-title">No datasets found</p>
                  <p className="drq-empty-text">
                    Try removing one or more filters to broaden your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BOX 2: REQUESTED DATASETS – SEPARATE CONTAINER */}
        <section className="drq-requested-shell">
          <header className="drq-requested-shell-header">
            <div>
              <h3 className="drq-requested-shell-title">
                Requested Datasets
              </h3>
              <p className="drq-requested-shell-subtitle">
                Approved download links (mock placeholders).
              </p>
            </div>
            <span className="drq-requested-count">
              {requestedDatasets.length} selected
            </span>
          </header>

          {requestedDatasets.length === 0 ? (
            <div className="drq-requested-empty-card">
              <p className="drq-requested-empty-main">
                No requests yet.
              </p>
              <p className="drq-requested-empty-text">
                Use <strong>Request Access</strong> on one or more
                datasets above. Once approved, secure download links will
                appear here.
              </p>
            </div>
          ) : (
            <div className="drq-requested-grid">
              {requestedDatasets.map((d) => {
                const downloadUrl = `https://oasis.example.org/download/${d.id}`;
                return (
                  <article key={d.id} className="drq-requested-card">
                    <div className="drq-requested-info">
                      <h4 className="drq-requested-name">{d.name}</h4>
                      <p className="drq-requested-meta">
                        {d.size} · Last updated {d.updated}
                      </p>
                    </div>
                    <a
                      href={downloadUrl}
                      className="drq-requested-link"
                      download
                    >
                      Download
                    </a>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DataRequestModule;
