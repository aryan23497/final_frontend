// src/modules/ImageAnalyzerModule.js
import React from "react";
import "./ImageAnalyzerModule.css";

const ImageAnalyzerModule = () => {
  return (
    <div className="img-layout">
      <section className="img-panel img-left">
        <h3 className="img-title">Upload Images / Otoliths</h3>
        <p className="img-text">
          Send images to the analysis queue for species ID, morphometrics or
          quality checks.
        </p>

        <div className="img-upload-box">
          <p>Drag &amp; drop imagery here</p>
          <span>or click to browse</span>
        </div>

        <p className="img-note">
          Supported (prototype): .jpg, .png, .tif. In production, images will be
          stored in the Cloud Data Server and linked via metadata.
        </p>
      </section>

      <section className="img-panel img-right">
        <h3 className="img-title">Recent Analyses</h3>

        <div className="img-grid">
          <div className="img-card">
            <p className="img-label">Otolith set – Station 14</p>
            <p className="img-meta">Status: Completed · 32 shapes analysed</p>
          </div>
          <div className="img-card">
            <p className="img-label">Trawl catch – mixed pelagics</p>
            <p className="img-meta">Status: Running · species detection</p>
          </div>
          <div className="img-card">
            <p className="img-label">Benthic photo-quadrat</p>
            <p className="img-meta">Status: Queued · habitat mapping</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImageAnalyzerModule;
