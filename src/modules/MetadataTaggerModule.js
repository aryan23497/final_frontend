// src/modules/MetadataTaggerModule.js
import React from "react";
import "./MetadataTaggerModule.css";

const MetadataTaggerModule = () => {
  return (
    <div className="meta-layout">
      <section className="meta-panel meta-left">
        <h3 className="meta-title">Metadata Profiles</h3>
        <p className="meta-text">
          Apply standardised marine and biodiversity metadata schemas to
          datasets as they arrive.
        </p>

        <div className="meta-field">
          <label>Metadata Standard</label>
          <select>
            <option>Darwin Core (DwC)</option>
            <option>OBIS / GBIF Marine</option>
            <option>ISO 19115 / 19139</option>
            <option>Custom CMLRE Profile</option>
          </select>
        </div>

        <div className="meta-field">
          <label>Controlled Vocabularies</label>
          <div className="meta-tags">
            <button type="button" className="meta-tag">
              Marine regions
            </button>
            <button type="button" className="meta-tag">
              Gear types
            </button>
            <button type="button" className="meta-tag">
              Taxonomic ranks
            </button>
            <button type="button" className="meta-tag">
              Molecular assays
            </button>
          </div>
        </div>

        <button className="meta-btn">Run Auto-Tagging</button>
        <p className="meta-note">
          * Backed by rule-based + AI-based taggers in the final implementation.
        </p>
      </section>

      <section className="meta-panel meta-right">
        <h3 className="meta-title">Preview Tagged Metadata</h3>
        <p className="meta-text">
          Example of how a dataset record looks after enrichment.
        </p>

        <div className="meta-preview">
          <div>
            <span className="meta-key">datasetTitle</span>
            <span className="meta-value">
              Arabian Sea CTD & Chlorophyll Profiles – 2024
            </span>
          </div>
          <div>
            <span className="meta-key">basisOfRecord</span>
            <span className="meta-value">Machine observation</span>
          </div>
          <div>
            <span className="meta-key">scientificName</span>
            <span className="meta-value">Sardinella longiceps</span>
          </div>
          <div>
            <span className="meta-key">eventDateRange</span>
            <span className="meta-value">2024-06-01 → 2024-08-30</span>
          </div>
          <div>
            <span className="meta-key">geographicExtent</span>
            <span className="meta-value">
              Arabian Sea shelf · 8°–18° N, 72°–78° E
            </span>
          </div>
          <div>
            <span className="meta-key">keywords</span>
            <span className="meta-value">
              SST, chlorophyll, CTD, sardine, monsoon
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MetadataTaggerModule;
