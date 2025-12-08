// src/modules/DataInfluenceSystemModule.js
import React from "react";
import "./DataInfluenceSystemModule.css";

const DataInfluenceSystemModule = () => {
  return (
    <div className="dis-layout">
      <section className="dis-panel">
        <h3 className="dis-title">Influence Summary</h3>
        <p className="dis-text">
          High-level explanation of which variables are driving predictions in
          key models.
        </p>

        <table className="dis-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Top Drivers</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sardine CPUE</td>
              <td>SST, Chl-a, upwelling, DO</td>
              <td>Strong climate sensitivity during monsoon.</td>
            </tr>
            <tr>
              <td>Bleaching Risk</td>
              <td>SST anomaly, heat exposure, light</td>
              <td>Threshold-type response close to 30 °C.</td>
            </tr>
            <tr>
              <td>eDNA richness</td>
              <td>Habitat type, depth, Chl-a</td>
              <td>Higher richness at productive shelf edges.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="dis-panel">
        <h3 className="dis-title">Planned Visuals</h3>
        <p className="dis-text">
          In the real system, this page will render bar-plots and partial
          dependence plots for feature importance. For now, it documents the
          design idea.
        </p>
        <ul className="dis-list">
          <li>Global feature importance for each model</li>
          <li>Per-region influence maps</li>
          <li>Downloadable explanation reports for policy use</li>
        </ul>
      </section>
    </div>
  );
};

export default DataInfluenceSystemModule;
