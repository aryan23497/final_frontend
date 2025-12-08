import React, { useState } from "react";
import "./DataUploadSection.css";

const DataUploadSection = () => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("Oceanography");
  const [notes, setNotes] = useState("");

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!files.length) {
      alert("Please attach at least one file to upload.");
      return;
    }

    // later: build FormData and send to FastAPI
    console.log({
      title,
      domain,
      notes,
      files,
    });

    alert("Upload request created (connect to backend later).");
  };

  return (
    <section className="du-wrapper">
      {/* brief information block */}
      <div className="du-header">
        <p className="du-eyebrow">Data Upload · Unified Platform</p>
        <h2 className="du-title">Upload marine datasets</h2>
        <p className="du-text">
          Use this workspace to upload any oceanographic, fisheries, taxonomic,
          image or molecular dataset into the CMLRE unified platform. All file
          types are supported (CSV, Excel, NetCDF, images, FASTQ, ZIP archives
          and more). The Data Manager and Admin will review and approve
          ingestion.
        </p>
      </div>

      {/* upload card */}
      <div className="du-card">
        <form onSubmit={handleSubmit}>
          <div className="du-field">
            <label htmlFor="title">Dataset title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. 2024 Southwest Monsoon CTD profiles"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="du-field">
            <label htmlFor="domain">Scientific domain</label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option>Oceanography</option>
              <option>Fisheries</option>
              <option>Taxonomy & Systematics</option>
              <option>Otolith Morphology</option>
              <option>Molecular Biology / DNA Barcoding</option>
              <option>eDNA & Metabarcoding</option>
              <option>Remote Sensing / GIS</option>
              <option>Other</option>
            </select>
          </div>

          {/* drag & drop zone */}
          <div
            className="du-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="du-drop-main">
              <span className="du-drop-icon">📁</span>
              Drag &amp; drop files here
            </p>
            <p className="du-drop-sub">
              or{" "}
              <label className="du-browse">
                browse
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>{" "}
              from your system
            </p>
            <p className="du-drop-hint">
              Supports all file types: tabular, NetCDF, images, sequencing
              files, ZIP archives, etc.
            </p>
          </div>

          {/* selected files list */}
          {files.length > 0 && (
            <div className="du-files">
              <div className="du-files-header">
                Selected files ({files.length})
              </div>
              <ul>
                {files.map((file, idx) => (
                  <li key={`${file.name}-${idx}`}>
                    <span className="du-file-name">{file.name}</span>
                    <button
                      type="button"
                      className="du-file-remove"
                      onClick={() => handleRemove(idx)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="du-field">
            <label htmlFor="notes">Notes / context</label>
            <textarea
              id="notes"
              rows="3"
              placeholder="Cruise ID, station range, QC status, special remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="du-actions">
            <button type="submit" className="btn du-btn-primary">
              Submit for upload
            </button>
            <p className="du-small">
              Files will be validated before integration into the unified data
              platform.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DataUploadSection;
