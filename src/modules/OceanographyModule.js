import React, { useState } from "react";
import "./OceanographyModule.css";

const DOMAINS = [
  "Oceanography",
  "Fisheries",
  "eDNA / Molecular",
  "Taxonomy & Biodiversity",
];

const OceanographyModule = () => {
  const [domain, setDomain] = useState("Oceanography");
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDomainChange = (e) => {
    setDomain(e.target.value);
    setFormData({});
    setFiles([]);
    setNotes("");
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (!dropped.length) return;
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Domain:", domain);
    console.log("Form Data:", formData);
    console.log("Notes:", notes);
    console.log("Files:", files);

    alert(
      `Submitted ${domain} elicitation form.\n\n` +
        `Fields filled: ${Object.keys(formData).length}\n` +
        `Files attached: ${files.length}\n\n` +
        `Later this will be sent to the AI / backend for validation & processing.`
    );
  };

  return (
    <div className="ocean-layout">
      {/* HEADER */}
      <header className="ocean-header">
        <p className="ocean-eyebrow">Domain Expert · Oceanography Module</p>
        <h2 className="ocean-title">Domain-wise data elicitation</h2>
        <p className="ocean-subtitle">
          Capture structured information for oceanography, fisheries, molecular
          and biodiversity studies. This form will later feed AI-driven
          validation, processing and visualization pipelines.
        </p>
      </header>

      {/* DOMAIN SELECTOR */}
      <section className="ocean-domain-box">
        <label className="ocean-domain-label">Select scientific domain</label>
        <select
          value={domain}
          onChange={handleDomainChange}
          className="ocean-domain-select"
        >
          {DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </section>

      {/* MAIN FORM */}
      <form className="ocean-form" onSubmit={handleSubmit}>
        {/* DOMAIN-SPECIFIC GRID */}
        {domain === "Oceanography" && (
          <div className="ocean-form-grid">
            <input
              name="station_id"
              onChange={handleChange}
              placeholder="Station ID"
            />
            <input
              name="cruise_id"
              onChange={handleChange}
              placeholder="Cruise ID"
            />
            <input
              name="latitude"
              onChange={handleChange}
              placeholder="Latitude (°N)"
            />
            <input
              name="longitude"
              onChange={handleChange}
              placeholder="Longitude (°E)"
            />
            <input
              name="sst"
              onChange={handleChange}
              placeholder="Sea Surface Temperature (°C)"
            />
            <input
              name="salinity"
              onChange={handleChange}
              placeholder="Surface Salinity (PSU)"
            />
            <input
              name="chlorophyll"
              onChange={handleChange}
              placeholder="Chl-a (mg/m³)"
            />
            <input
              name="oxygen"
              onChange={handleChange}
              placeholder="Dissolved Oxygen (ml/L)"
            />
          </div>
        )}

        {domain === "Fisheries" && (
          <div className="ocean-form-grid">
            <input
              name="species"
              onChange={handleChange}
              placeholder="Target species (scientific/common)"
            />
            <input
              name="gear"
              onChange={handleChange}
              placeholder="Fishing gear"
            />
            <input
              name="cpue"
              onChange={handleChange}
              placeholder="CPUE (kg/unit effort)"
            />
            <input
              name="catch_weight"
              onChange={handleChange}
              placeholder="Catch weight (kg)"
            />
            <input
              name="landing_center"
              onChange={handleChange}
              placeholder="Landing centre"
            />
            <input
              name="season"
              onChange={handleChange}
              placeholder="Season / month"
            />
          </div>
        )}

        {domain === "eDNA / Molecular" && (
          <div className="ocean-form-grid">
            <input
              name="sample_id"
              onChange={handleChange}
              placeholder="Sample ID"
            />
            <input
              name="marker"
              onChange={handleChange}
              placeholder="Marker / gene region (e.g. COI, 16S)"
            />
            <input
              name="primer_set"
              onChange={handleChange}
              placeholder="Primer set"
            />
            <input
              name="read_count"
              onChange={handleChange}
              placeholder="Total read count"
            />
            <input
              name="coverage"
              onChange={handleChange}
              placeholder="Mean coverage (%)"
            />
            <input
              name="platform"
              onChange={handleChange}
              placeholder="Sequencing platform"
            />
          </div>
        )}

        {domain === "Taxonomy & Biodiversity" && (
          <div className="ocean-form-grid">
            <input
              name="scientific_name"
              onChange={handleChange}
              placeholder="Scientific name"
            />
            <input
              name="family"
              onChange={handleChange}
              placeholder="Family"
            />
            <input
              name="locality"
              onChange={handleChange}
              placeholder="Locality / area"
            />
            <input
              name="habitat"
              onChange={handleChange}
              placeholder="Habitat (reef, shelf, slope...)"
            />
            <input
              name="depth_range"
              onChange={handleChange}
              placeholder="Depth range (m)"
            />
            <input
              name="collector"
              onChange={handleChange}
              placeholder="Collector / survey"
            />
          </div>
        )}

        {/* DATASET UPLOAD (SHARED FOR ALL DOMAINS) */}
        <section className="ocean-upload-section">
          <label className="ocean-upload-label">
            Attach related dataset(s) (optional)
          </label>
          <div
            className="ocean-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="ocean-drop-main">
              <span className="ocean-drop-icon">📂</span>
              Drag &amp; drop files here
            </p>
            <p className="ocean-drop-sub">
              or{" "}
              <span className="ocean-browse">
                browse
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </span>{" "}
              from your system.
            </p>
            <p className="ocean-drop-hint">
              Supports CSV/Excel tables, NetCDF, images, PDFs and ZIP bundles.
            </p>
          </div>

          {files.length > 0 && (
            <div className="ocean-files">
              <div className="ocean-files-header">
                Selected files <span>({files.length})</span>
              </div>
              <ul>
                {files.map((f, idx) => (
                  <li key={`${f.name}-${idx}`} className="ocean-file-row">
                    <span className="ocean-file-name">{f.name}</span>
                    <button
                      type="button"
                      className="ocean-file-remove"
                      onClick={() => handleRemoveFile(idx)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* NOTES */}
        <section className="ocean-notes-section">
          <label className="ocean-notes-label">
            Notes / context for this record
          </label>
          <textarea
            className="ocean-notes-textarea"
            rows={3}
            placeholder="Cruise details, QC status, sampling protocol, important caveats..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        {/* SUBMIT */}
        <div className="ocean-submit-row">
          <button className="ocean-submit-btn" type="submit">
            Submit domain data
          </button>
        </div>
      </form>
    </div>
  );
};

export default OceanographyModule;
