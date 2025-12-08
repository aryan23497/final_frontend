// src/modules/InfluenceEngineModule.js
import React from "react";
import "./InfluenceEngineModule.css";

const InfluenceEngineModule = () => {
  return (
    <div className="inf-layout">
      <section className="inf-panel">
        <h3 className="inf-title">Influence Rules & Drivers</h3>
        <p className="inf-text">
          Inspect how environmental parameters contribute to predicted
          ecosystem or fisheries outcomes.
        </p>

        <div className="inf-grid">
          <div className="inf-card">
            <h4>Key Drivers – Sardine CPUE</h4>
            <ul>
              <li>SST anomaly (°C)</li>
              <li>Surface chlorophyll (mg/m³)</li>
              <li>Mixed layer depth (m)</li>
              <li>Upwelling index</li>
            </ul>
          </div>
          <div className="inf-card">
            <h4>Rule Snippet (Pseudo)</h4>
            <p className="inf-code">
              IF SST between 26–28 °C AND Chl-a &gt; 0.7 mg/m³ THEN habitat
              suitability ↑
            </p>
            <p className="inf-code">
              IF SST &gt; 30 °C OR DO &lt; 3 ml/l THEN risk of stress ↑
            </p>
          </div>
          <div className="inf-card">
            <h4>Model Explanation</h4>
            <p>
              In the full system this panel will render feature importance
              charts (e.g. SHAP) for selected models and regions.
            </p>
          </div>
        </div>
      </section>

      <section className="inf-panel">
        <h3 className="inf-title">Scenario Explorer</h3>
        <p className="inf-text">
          Configure simple “what-if“ scenarios. Later this will call backend
          models; for now it describes the idea.
        </p>

        <div className="inf-scenario">
          <div className="inf-scenario-field">
            <label>SST change</label>
            <input type="range" min="-2" max="2" defaultValue="0" />
            <span>-2 °C … +2 °C</span>
          </div>
          <div className="inf-scenario-field">
            <label>Chlorophyll change</label>
            <input type="range" min="-50" max="50" defaultValue="0" />
            <span>-50% … +50%</span>
          </div>
        </div>

        <div className="inf-result">
          <h4>Qualitative Output</h4>
          <p>
            With the current sliders, the engine would estimate a{" "}
            <strong>moderate increase</strong> in sardine habitat suitability
            along the southwest coast.
          </p>
        </div>
      </section>
    </div>
  );
};

export default InfluenceEngineModule;
