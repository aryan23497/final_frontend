// src/modules/EDNAMetabarcodingModule.js
import React from "react";
import "./EDNAMetabarcodingModule.css";

const EDNAMetabarcodingModule = () => {
  return (
    <section className="edna-module">
      {/* small line above title */}
      <p className="edna-kicker">Domain Expert · eDNA Workflows</p>

      <h2>eDNA &amp; Metabarcoding</h2>

      <p className="edna-lead">
        Environmental DNA tools for tracking marine biodiversity from water
        samples — from field collection to sequence-level insights.
      </p>

      {/* OVERVIEW */}
      <section className="edna-section">
        <h3>Overview</h3>
        <p>
          This module helps configure and review{" "}
          <strong>eDNA &amp; metabarcoding surveys</strong> — how samples were
          collected, processed in the lab, and analysed to generate species
          lists and biodiversity indicators.
        </p>
      </section>

      {/* TOPIC PILLS */}
      <section className="edna-section">
        <h3>Topics</h3>

        <div className="edna-topics-row">
          <button type="button" className="edna-pill">
            <span className="edna-icon">💧</span>
            eDNA Sampling
          </button>

          <button type="button" className="edna-pill">
            <span className="edna-icon">🧫</span>
            Metabarcoding
          </button>

          <button type="button" className="edna-pill">
            <span className="edna-icon">🧬</span>
            Sequence Analysis
          </button>
        </div>
      </section>

      {/* 3 INFO CARDS */}
      <section className="edna-grid">
        <div className="edna-card">
          <h4>eDNA Sampling</h4>
          <ul>
            <li>Register stations, depth, volume and date/time.</li>
            <li>Capture filter type, preservation and chain-of-custody.</li>
            <li>Flag samples linked to other oceanographic surveys.</li>
          </ul>
        </div>

        <div className="edna-card">
          <h4>Metabarcoding</h4>
          <ul>
            <li>Record markers (COI, 12S, 18S, etc.) and primer sets.</li>
            <li>Track extraction, PCR batches and sequencing runs.</li>
            <li>Store basic QC metrics (read depth, failed libraries).</li>
          </ul>
        </div>

        <div className="edna-card">
          <h4>Sequence Analysis</h4>
          <ul>
            <li>Link OTU / ASV tables to reference taxonomic databases.</li>
            <li>Summarise richness, evenness and key indicator taxa.</li>
            <li>Expose outputs to dashboards and species-distribution tools.</li>
          </ul>
        </div>
      </section>

      {/* STATUS */}
      <p className="edna-status">
        Active • Latest eDNA batch processed a few minutes ago.
      </p>
    </section>
  );
};

export default EDNAMetabarcodingModule;
