
import React from "react";
import "./MolecularBiologyModule.css";

const MolecularBiologyModule = () => {
  return (
    <div className="mol-wrapper">
      {/* TOP SUMMARY */}
      <div className="mol-header-card">
        <h2>Molecular Biology / DNA Barcoding</h2>
        <p>
          Sequence-based tools to identify marine species and link barcodes,
          eDNA reads and surveys to a common taxon ID.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="mol-grid">
        {/* LEFT: FOCUS */}
        <section className="mol-block">
          <h3>Core Focus</h3>
          <ul className="mol-list">
            <li>Maintain marine barcode reference libraries.</li>
            <li>Track sequencing runs and basic QC.</li>
            <li>Connect sequences to taxonomy and specimens.</li>
          </ul>
        </section>

        {/* MIDDLE: WORKSPACES */}
        <section className="mol-block">
          <h3>Workspaces</h3>
          <div className="mol-card-grid">
            <div className="mol-card">
              <div className="mol-card-header">
                <span className="mol-icon">🧬</span>
                <span className="mol-title">DNA Barcoding</span>
              </div>
              <p>Manage reference barcodes for key marine groups.</p>
              <ul>
                <li>Species–barcode registry</li>
                <li>Match new sequences</li>
                <li>Flag low-identity hits</li>
              </ul>
            </div>

            <div className="mol-card">
              <div className="mol-card-header">
                <span className="mol-icon">🧪</span>
                <span className="mol-title">PCR & Sequencing</span>
              </div>
              <p>Capture run metadata and QC outcomes.</p>
              <ul>
                <li>Primer / protocol list</li>
                <li>Run success / failure</li>
                <li>Read statistics notes</li>
              </ul>
            </div>

            <div className="mol-card">
              <div className="mol-card-header">
                <span className="mol-icon">📊</span>
                <span className="mol-title">Molecular Markers</span>
              </div>
              <p>Track markers used for population and stock studies.</p>
              <ul>
                <li>Marker details (locus, type)</li>
                <li>Linked analyses & reports</li>
                <li>Marker panels per survey</li>
              </ul>
            </div>
          </div>
        </section>

        {/* RIGHT: FLOW + STATUS */}
        <section className="mol-block">
          <h3>Simple Flow</h3>
          <ol className="mol-steps">
            <li>
              <span className="mol-step-badge">1</span>
              <div>
                <strong>Register sample</strong>
                <p>Store metadata for tissue / filter / specimen.</p>
              </div>
            </li>
            <li>
              <span className="mol-step-badge">2</span>
              <div>
                <strong>Add run details</strong>
                <p>Record PCR, primers, platform and QC.</p>
              </div>
            </li>
            <li>
              <span className="mol-step-badge">3</span>
              <div>
                <strong>Attach sequences</strong>
                <p>Upload sequence files and link to taxon ID.</p>
              </div>
            </li>
          </ol>

          <h3 className="mol-status-heading">Status</h3>
          <p className="mol-status">
            <span className="mol-status-dot" />
            Active • Last sync with taxonomy / eDNA: <strong>OK</strong>.
          </p>

          <div className="mol-actions">
            <button className="mol-btn mol-btn-primary">
              Open Barcode Library
            </button>
            <button className="mol-btn mol-btn-outline">
              Add Sequencing Run
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MolecularBiologyModule;
