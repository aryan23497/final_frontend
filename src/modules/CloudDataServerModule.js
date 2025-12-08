// src/modules/CloudDataServerModule.js
import React, { useState, useMemo } from "react";
import "./CloudDataServerModule.css";

const DOMAINS = [
  {
    id: "oceanography",
    label: "Oceanography",
    description: "CTD, nutrients, currents, satellite SST & Chl-a grids.",
  },
  {
    id: "fisheries",
    label: "Fisheries",
    description: "Catch, effort, acoustic surveys, stock assessment outputs.",
  },
  {
    id: "molecular",
    label: "Molecular / eDNA",
    description: "DNA barcodes, eDNA reads, metabarcoding matrices.",
  },
  {
    id: "taxonomy",
    label: "Taxonomy & Systematics",
    description: "Species checklists, occurrence tables, reference libraries.",
  },
];

const SAMPLE_DATASETS = [
  // Oceanography
  {
    id: 1,
    domain: "oceanography",
    name: "Arabian Sea CTD & Nutrients (2018–2022)",
    type: "CTD + Nutrients",
    size: "4.2 GB",
    storageNode: "OASIS-OCN-01",
    lastSync: "2024-01-10",
    status: "Online",
    access: "Open",
    tags: ["SST", "Salinity", "Nutrients", "Time-series"],
  },
  {
    id: 2,
    domain: "oceanography",
    name: "Gridded SST & Chlorophyll (L3, Indian EEZ)",
    type: "Satellite grids",
    size: "9.5 GB",
    storageNode: "OASIS-OCN-02",
    lastSync: "2024-03-05",
    status: "Online",
    access: "Open",
    tags: ["SST", "Chl-a", "Remote sensing"],
  },
  // Fisheries
  {
    id: 3,
    domain: "fisheries",
    name: "Pelagic Fish Acoustic Survey – Eastern Arabian Sea",
    type: "Acoustic + Trawl",
    size: "1.8 GB",
    storageNode: "OASIS-FSH-01",
    lastSync: "2023-11-02",
    status: "Online",
    access: "Restricted",
    tags: ["Acoustics", "CPUE", "Biomass"],
  },
  {
    id: 4,
    domain: "fisheries",
    name: "Landing Centre-wise Catch & Effort (2015–2023)",
    type: "Catch & Effort",
    size: "3.4 GB",
    storageNode: "OASIS-FSH-02",
    lastSync: "2024-02-21",
    status: "Syncing",
    access: "Restricted",
    tags: ["Catch", "Effort", "Time-series"],
  },
  // Molecular / eDNA
  {
    id: 5,
    domain: "molecular",
    name: "Reference Fish Barcode Library – Indian EEZ",
    type: "COI + 16S sequences",
    size: "620 MB",
    storageNode: "OASIS-MOL-01",
    lastSync: "2023-09-25",
    status: "Online",
    access: "Open",
    tags: ["DNA barcoding", "Reference"],
  },
  {
    id: 6,
    domain: "molecular",
    name: "Coastal eDNA – Kerala Shelf (Pilot Transects)",
    type: "FASTQ + OTU table",
    size: "850 MB",
    storageNode: "OASIS-MOL-02",
    lastSync: "2024-02-18",
    status: "Online",
    access: "Controlled",
    tags: ["eDNA", "Metabarcoding", "Coastal"],
  },
  // Taxonomy & Systematics
  {
    id: 7,
    domain: "taxonomy",
    name: "Indian EEZ Fish Occurrence Records",
    type: "Occurrence table",
    size: "320 MB",
    storageNode: "OASIS-TAX-01",
    lastSync: "2023-08-14",
    status: "Online",
    access: "Open",
    tags: ["Occurrences", "Species list"],
  },
  {
    id: 8,
    domain: "taxonomy",
    name: "Taxonomic Checklist – Marine Fishes (v3.0)",
    type: "Checklist",
    size: "150 MB",
    storageNode: "OASIS-TAX-02",
    lastSync: "2024-01-30",
    status: "Archived",
    access: "Open",
    tags: ["Checklist", "Nomenclature"],
  },
];

const CloudDataServerModule = () => {
  const [activeDomain, setActiveDomain] = useState("oceanography");

  const activeDomainMeta = useMemo(
    () => DOMAINS.find((d) => d.id === activeDomain),
    [activeDomain]
  );

  const domainDatasets = useMemo(
    () => SAMPLE_DATASETS.filter((d) => d.domain === activeDomain),
    [activeDomain]
  );

  return (
    <div className="cloud-layout">
      {/* TOP: 4 BIG DOMAIN BOXES */}
      <section className="cloud-domain-grid">
        {DOMAINS.map((dom) => (
          <button
            key={dom.id}
            type="button"
            className={
              dom.id === activeDomain
                ? "cloud-domain-card cloud-domain-card-active"
                : "cloud-domain-card"
            }
            onClick={() => setActiveDomain(dom.id)}
          >
            <div className="cloud-domain-label">{dom.label}</div>
            <p className="cloud-domain-desc">{dom.description}</p>
          </button>
        ))}
      </section>

      {/* BOTTOM: BIG SCROLLABLE DATASET PANEL */}
      <section className="cloud-datasets-panel">
        <header className="cloud-datasets-header">
          <div>
            <h3 className="cloud-datasets-title">
              {activeDomainMeta?.label || "Selected domain"}
            </h3>
            <p className="cloud-datasets-subtitle">
              {domainDatasets.length} dataset
              {domainDatasets.length !== 1 ? "s are" : " is"} currently registered
              in the Cloud Data Server for this domain.
            </p>
          </div>
          <div className="cloud-datasets-meta">
            <span className="cloud-chip">
              Node group:{" "}
              {activeDomain === "oceanography"
                ? "OCN-*"
                : activeDomain === "fisheries"
                ? "FSH-*"
                : activeDomain === "molecular"
                ? "MOL-*"
                : "TAX-*"}
            </span>
          </div>
        </header>

        <div className="cloud-dataset-list">
          {domainDatasets.map((ds) => (
            <article key={ds.id} className="cloud-dataset-card">
              <div className="cloud-dataset-main">
                <h4 className="cloud-dataset-name">{ds.name}</h4>
                <p className="cloud-dataset-type">{ds.type}</p>

                <div className="cloud-dataset-tags">
                  <span className="cloud-pill cloud-pill-domain">
                    {activeDomainMeta?.label}
                  </span>
                  <span
                    className={`cloud-pill cloud-pill-status status-${ds.status.toLowerCase()}`}
                  >
                    {ds.status}
                  </span>
                  <span
                    className={`cloud-pill cloud-pill-access access-${ds.access.toLowerCase()}`}
                  >
                    {ds.access}
                  </span>

                  {ds.tags.map((t) => (
                    <span key={t} className="cloud-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="cloud-dataset-meta">
                <p className="cloud-meta-line">
                  <span className="cloud-meta-label">Size:</span> {ds.size}
                </p>
                <p className="cloud-meta-line">
                  <span className="cloud-meta-label">Storage node:</span>{" "}
                  {ds.storageNode}
                </p>
                <p className="cloud-meta-line">
                  <span className="cloud-meta-label">Last sync:</span>{" "}
                  {ds.lastSync}
                </p>
                <button
                  type="button"
                  className="btn cloud-btn-view"
                  onClick={() =>
                    alert(
                      `In the full OASIS stack, this would open a dataset detail / browse view for:\n\n${ds.name}`
                    )
                  }
                >
                  View dataset
                </button>
              </div>
            </article>
          ))}

          {domainDatasets.length === 0 && (
            <div className="cloud-empty-state">
              <p className="cloud-empty-title">No datasets registered</p>
              <p className="cloud-empty-text">
                This domain does not have any datasets yet in the Cloud Data Server.
                Once ingestion pipelines are configured, they will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CloudDataServerModule;
