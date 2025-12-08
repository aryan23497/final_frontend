// src/modules/MarineBiologyModule.js
import React from "react";
import "./MarineBiologyModule.css";

const MarineBiologyModule = () => {
  return (
    <div className="mb-wrapper">
      {/* TOP SUMMARY CARD */}
      <div className="mb-top-card">
        <h2>Marine Biology Workspace</h2>
        <p>
          Species, communities and ecosystem interactions in the marine
          environment – from plankton to top predators.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="mb-grid">
        {/* LEFT: OVERVIEW & TOPICS */}
        <section className="mb-block">
          <h3>Overview</h3>
          <p className="mb-text">
            The <strong>Marine Biology</strong> module brings together species
            records, community structure and ecological indicators from cruises,
            observatories and partner institutions. It helps scientists examine
            how biodiversity responds to changing ocean conditions.
          </p>

          <h3>Topics</h3>
          <div className="mb-pill-row">
            <button type="button" className="mb-pill">
              <span className="mb-pill-icon">🐟</span>
              <span className="mb-pill-label">Marine Organisms</span>
            </button>
            <button type="button" className="mb-pill">
              <span className="mb-pill-icon">🌿</span>
              <span className="mb-pill-label">Marine Ecology</span>
            </button>
          </div>

          <h3>Key Questions</h3>
          <ul className="mb-list">
            <li>
              Which regions show <strong>high species richness</strong> or
              endemism?
            </li>
            <li>
              How do <strong>trophic interactions</strong> change during
              upwelling, monsoon or heatwave events?
            </li>
            <li>
              Where are <strong>vulnerable habitats</strong> (reefs, seagrass,
              mangroves) under stress?
            </li>
          </ul>
        </section>

        {/* CENTER: BIODIVERSITY SNAPSHOT */}
        <section className="mb-block">
          <h3>Biodiversity Snapshot</h3>

          <div className="mb-metric">
            <span>Species records</span>
            <strong>12,430</strong>
            <span className="mb-chip">catalogued</span>
          </div>
          <div className="mb-metric">
            <span>Functional groups</span>
            <strong>18</strong>
            <span className="mb-chip">plankton → top predators</span>
          </div>
          <div className="mb-metric">
            <span>Habitats mapped</span>
            <strong>38</strong>
            <span className="mb-chip">reef, shelf, deep sea…</span>
          </div>
          <div className="mb-metric">
            <span>Long-term stations</span>
            <strong>22</strong>
            <span className="mb-chip">time-series</span>
          </div>

          <p className="mb-note">
            * Numbers are placeholders for the prototype. In production, these
            tiles would be linked to live queries from the unified data
            platform.
          </p>
        </section>

        {/* RIGHT: ACTIONS & STATUS */}
        <section className="mb-block">
          <h3>Analysis Actions</h3>

          <button className="mb-btn mb-btn-primary">
            Open Species Distribution Map
          </button>
          <button className="mb-btn mb-btn-outline">
            Explore Community Structure
          </button>
          <button className="mb-btn mb-btn-outline">
            Generate Biodiversity Report
          </button>
          <button className="mb-btn mb-btn-ghost">
            Link with Oceanography Layers
          </button>

          <h3 className="mb-status-heading">Status</h3>
          <p className="mb-status">
            <span className="mb-status-dot" /> Active • Last import from cruises:
            a few minutes ago. Trait and trophic data are fully synced.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MarineBiologyModule;
