// src/modules/DataAccessServerModule.js
import React, { useState } from "react";
import "./DataAccessServerModule.css";

const DOMAINS = [
  { value: "all", label: "All domains" },
  { value: "oceanography", label: "Oceanography" },
  { value: "fisheries", label: "Fisheries" },
  { value: "edna", label: "eDNA / Metabarcoding" },
  { value: "molecular", label: "Molecular Biology / Barcoding" },
  { value: "taxonomy", label: "Taxonomy & Systematics" },
  { value: "gis", label: "GIS / Remote Sensing" },
];

const SAMPLE_DATASETS = [
  {
    id: 1,
    name: "Arabian Sea CTD & Nutrients (2018–2022)",
    domain: "oceanography",
    type: "Physical + Chemical",
    size: "4.2 GB",
    updated: "2024-01-10",
    sensitivity: "low",
    tags: ["CTD", "Nutrients", "Time-series"],
  },
  {
    id: 2,
    name: "Pelagic Fish Acoustic Survey – Eastern Arabian Sea",
    domain: "fisheries",
    type: "Acoustic + Trawl",
    size: "1.8 GB",
    updated: "2023-11-02",
    sensitivity: "medium",
    tags: ["Fisheries", "Biomass", "Acoustics"],
  },
  {
    id: 3,
    name: "Coastal eDNA – Kerala Shelf (Pilot Transects)",
    domain: "edna",
    type: "eDNA Reads (FASTQ)",
    size: "850 MB",
    updated: "2024-02-18",
    sensitivity: "high",
    tags: ["eDNA", "Metabarcoding", "Coastal"],
  },
  {
    id: 4,
    name: "Reference Fish Barcode Library – Indian EEZ",
    domain: "molecular",
    type: "COI + 16S Sequences",
    size: "620 MB",
    updated: "2023-09-25",
    sensitivity: "medium",
    tags: ["DNA Barcoding", "Reference Library"],
  },
  {
    id: 5,
    name: "Multispectral Chlorophyll-a & SST Grids",
    domain: "gis",
    type: "Gridded Satellite Products",
    size: "9.5 GB",
    updated: "2024-03-05",
    sensitivity: "low",
    tags: ["Ocean Colour", "SST", "Remote Sensing"],
  },
  {
    id: 6,
    name: "Indian EEZ Fish Occurrence Records",
    domain: "taxonomy",
    type: "Occurrence Table",
    size: "320 MB",
    updated: "2023-08-14",
    sensitivity: "low",
    tags: ["Taxonomy", "Occurrences", "Species"],
  },
];

const DataAccessServerModule = () => {
  const [filters, setFilters] = useState({
    domain: "all",
    search: "",
    sensitivity: "all",
  });

  const [filteredData, setFilteredData] = useState(SAMPLE_DATASETS);

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

    if (filters.sensitivity !== "all") {
      result = result.filter((d) => d.sensitivity === filters.sensitivity);
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
      sensitivity: "all",
    });
    setFilteredData(SAMPLE_DATASETS);
  };

  return (
    <div className="das-layout">
      {/* LEFT: FILTER FORM */}
      <section className="das-filter-panel">
        <h3 className="das-panel-title">Data Access Request</h3>
        <p className="das-panel-subtitle">
          Filter datasets by domain and sensitivity, then select records to
          request access.
        </p>

        <form className="das-form" onSubmit={handleApplyFilters}>
          {/* Domain dropdown */}
          <label className="das-field">
            <span className="das-label">Domain</span>
            <select
              name="domain"
              value={filters.domain}
              onChange={handleChange}
              className="das-input"
            >
              {DOMAINS.map((dom) => (
                <option key={dom.value} value={dom.value}>
                  {dom.label}
                </option>
              ))}
            </select>
          </label>

          {/* Sensitivity */}
          <label className="das-field">
            <span className="das-label">Data sensitivity</span>
            <select
              name="sensitivity"
              value={filters.sensitivity}
              onChange={handleChange}
              className="das-input"
            >
              <option value="all">All levels</option>
              <option value="low">Low (open)</option>
              <option value="medium">Medium (restricted)</option>
              <option value="high">High (controlled)</option>
            </select>
          </label>

          {/* Search */}
          <label className="das-field">
            <span className="das-label">Search</span>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Dataset name, tag, or type…"
              className="das-input"
            />
          </label>

          {/* Just a small note */}
          <p className="das-note">
            * This is a prototype view. In production, dataset access rules will
            be enforced from the backend (FastAPI).
          </p>

          <div className="das-actions">
            <button type="submit" className="btn das-btn-primary">
              Apply Filters
            </button>
            <button
              type="button"
              className="btn das-btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* RIGHT: FILTERED DATASET LIST */}
      <section className="das-results-panel">
        <header className="das-results-header">
          <div>
            <p className="das-results-title">Filtered Datasets</p>
            <p className="das-results-subtitle">
              {filteredData.length} dataset
              {filteredData.length !== 1 ? "s" : ""} match your filters.
            </p>
          </div>
          <div className="das-active-filters">
            {filters.domain !== "all" && (
              <span className="das-chip">
                Domain:{" "}
                {
                  DOMAINS.find((d) => d.value === filters.domain)?.label
                }
              </span>
            )}
            {filters.sensitivity !== "all" && (
              <span className="das-chip">
                Sensitivity: {filters.sensitivity.toUpperCase()}
              </span>
            )}
            {filters.search.trim() && (
              <span className="das-chip">Search: “{filters.search}”</span>
            )}
            {!filters.search.trim() &&
              filters.domain === "all" &&
              filters.sensitivity === "all" && (
                <span className="das-chip das-chip-muted">
                  No filters applied
                </span>
              )}
          </div>
        </header>

        <div className="das-dataset-list">
          {filteredData.map((d) => (
            <article key={d.id} className="das-dataset-card">
              <div className="das-dataset-main">
                <h4 className="das-dataset-name">{d.name}</h4>
                <p className="das-dataset-type">{d.type}</p>
                <div className="das-dataset-tags">
                  <span className={`das-pill domain-${d.domain}`}>
                    {d.domain}
                  </span>
                  <span
                    className={`das-pill sensitivity-${d.sensitivity}`}
                  >
                    {d.sensitivity.toUpperCase()}
                  </span>
                  {d.tags.map((t) => (
                    <span key={t} className="das-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="das-dataset-meta">
                <p className="das-meta-line">
                  <span className="das-meta-label">Size:</span> {d.size}
                </p>
                <p className="das-meta-line">
                  <span className="das-meta-label">Last updated:</span>{" "}
                  {d.updated}
                </p>
                <button
                  type="button"
                  className="btn das-btn-request"
                  onClick={() =>
                    alert(
                      `Request submitted for dataset: "${d.name}" (mock).`
                    )
                  }
                >
                  Request Access
                </button>
              </div>
            </article>
          ))}

          {filteredData.length === 0 && (
            <div className="das-empty-state">
              <p className="das-empty-title">No datasets found</p>
              <p className="das-empty-text">
                Try removing one or more filters to broaden your search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DataAccessServerModule;
