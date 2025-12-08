// src/modules/TaxonomySystematicsModule.js
import React from "react";
import "./TaxonomySystematicsModule.css";

const TaxonomySystematicsModule = () => {
  return (
    <div className="tx-wrapper">
      {/* TOP SUMMARY CARD */}
      <div className="tx-top-card">
        <h2>Taxonomy & Systematics Workspace</h2>
        <p>
          Central hub to manage reference catalogues, valid names, synonyms and
          identification tools for marine species in the OASIS platform.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="tx-grid">
        {/* LEFT: OVERVIEW + OBJECTIVES */}
        <section className="tx-block">
          <h3>Overview</h3>
          <p className="tx-text">
            The <strong>Taxonomy &amp; Systematics</strong> module keeps the
            platform aligned with recognised authorities (WoRMS, FishBase,
            AlgaeBase, etc.). It connects{" "}
            <strong>species names, identifiers, images and DNA barcodes</strong>{" "}
            so that datasets coming from different cruises and labs use a
            consistent taxonomic backbone.
          </p>

          <h3>Objectives</h3>
          <ul className="tx-list">
            <li>Maintain a curated list of valid marine taxa for the EEZ.</li>
            <li>Track synonyms, spelling variants and deprecated names.</li>
            <li>
              Provide <strong>identification keys</strong> and reference
              material for scientists &amp; data managers.
            </li>
            <li>
              Expose a stable <strong>Taxon ID</strong> that all modules can
              link to (eDNA, fisheries, imagery, etc.).
            </li>
          </ul>
        </section>

        {/* MIDDLE: CORE TOOLS (match your 4 topic buttons) */}
        <section className="tx-block">
          <h3>Core Tools</h3>

          <div className="tx-tool-grid">
            <div className="tx-tool-card">
              <div className="tx-tool-header">
                <span className="tx-tool-icon">📚</span>
                <span className="tx-tool-title">Classical Taxonomy</span>
              </div>
              <p>
                Maintain checklists, descriptions and type information for major
                marine groups, linked with historical literature and specimens.
              </p>
              <ul>
                <li>Reference checklists by region / project</li>
                <li>Store diagnostic characters &amp; images</li>
                <li>Link to voucher specimens / collections</li>
              </ul>
            </div>

            <div className="tx-tool-card">
              <div className="tx-tool-header">
                <span className="tx-tool-icon">🐠</span>
                <span className="tx-tool-title">Fish Taxonomy</span>
              </div>
              <p>
                Specialised workspace for finfishes and elasmobranchs used in
                fisheries surveys and stock assessments.
              </p>
              <ul>
                <li>Standard codes for survey &amp; fishery datasets</li>
                <li>Life-history traits (size, maturity, habitat)</li>
                <li>Links to otolith &amp; image libraries</li>
              </ul>
            </div>

            <div className="tx-tool-card">
              <div className="tx-tool-header">
                <span className="tx-tool-icon">🔑</span>
                <span className="tx-tool-title">
                  Species Identification &amp; Keys
                </span>
              </div>
              <p>
                Digital keys and decision trees that help scientists identify
                specimens from morphology, images or eDNA hits.
              </p>
              <ul>
                <li>Interactive multi-entry keys</li>
                <li>Image-assisted identification workflows</li>
                <li>
                  Cross-links to <strong>AI image models</strong> &amp; DNA
                  barcodes
                </li>
              </ul>
            </div>

            <div className="tx-tool-card">
              <div className="tx-tool-header">
                <span className="tx-tool-icon">📜</span>
                <span className="tx-tool-title">
                  Nomenclature &amp; Classification Rules
                </span>
              </div>
              <p>
                Capture decisions on valid names, authorship and higher
                classification according to international codes.
              </p>
              <ul>
                <li>Change-log of taxonomic decisions</li>
                <li>Versioned classifications (ICZN, WoRMS, etc.)</li>
                <li>Audit trail for updates used by other modules</li>
              </ul>
            </div>
          </div>
        </section>

        {/* RIGHT: WORKFLOW + STATUS */}
        <section className="tx-block">
          <h3>Curation Workflow</h3>

          <ol className="tx-steps">
            <li>
              <span className="tx-step-badge">1</span>
              <div>
                <strong>Ingest names</strong>
                <p>
                  Import species lists from cruises, legacy databases or
                  external catalogues.
                </p>
              </div>
            </li>
            <li>
              <span className="tx-step-badge">2</span>
              <div>
                <strong>Match to authorities</strong>
                <p>
                  Resolve names against WoRMS / FishBase and flag
                  <em> uncertain</em> matches.
                </p>
              </div>
            </li>
            <li>
              <span className="tx-step-badge">3</span>
              <div>
                <strong>Review &amp; approve</strong>
                <p>
                  Domain experts validate changes; decisions are stored as a
                  permanent record.
                </p>
              </div>
            </li>
            <li>
              <span className="tx-step-badge">4</span>
              <div>
                <strong>Publish to OASIS</strong>
                <p>
                  Updated taxon IDs and synonyms become available to all
                  connected modules.
                </p>
              </div>
            </li>
          </ol>

          <h3 className="tx-status-heading">Status</h3>
          <p className="tx-status">
            <span className="tx-status-dot" />
            Active • Taxonomic backbone is synced • Pending review:{" "}
            <strong>23</strong> new species names and <strong>7</strong>{" "}
            re-classification requests.
          </p>

          <div className="tx-actions">
            <button className="tx-btn tx-btn-primary">
              Open Taxon Catalogue
            </button>
            <button className="tx-btn tx-btn-outline">
              Review Pending Name Changes
            </button>
            <button className="tx-btn tx-btn-ghost">
              Export Valid Names for Data Team
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TaxonomySystematicsModule;
