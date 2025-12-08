import React, { useState } from "react";
import "./IngestionPipelineModule.css";

const IngestionPipelineModule = () => {
  const [files, setFiles] = useState([]);
  const [batchName, setBatchName] = useState("");
  const [sourceType, setSourceType] = useState("Cruise CTD / Station data");
  const [inputFormat, setInputFormat] = useState("CSV / TSV");
  const [schedule, setSchedule] = useState("Manual / one-time");
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

    // later: build payload / FormData and send to FastAPI
    console.log({
      batchName,
      sourceType,
      inputFormat,
      schedule,
      notes,
      files,
    });

    alert(
      "Data upload request created for ingestion (connect to backend / workflow engine later)."
    );
  };

  return (
    <section className="ip-wrapper">
      {/* brief information block */}
      <div className="ip-header">
        <p className="ip-eyebrow">Ingestion · Data Upload</p>
        <h2 className="ip-title">Upload data for ingestion</h2>
        <p className="ip-text">
          Use this workspace to upload oceanographic, fisheries, molecular or remote sensing
          datasets into the OASIS ingestion pipelines. Attach files, describe the source and
          format, and optionally specify how this batch should be handled by the system.
        </p>
      </div>

      {/* ingestion upload card */}
      <div className="ip-card">
        <form onSubmit={handleSubmit}>
          <div className="ip-field">
            <label htmlFor="batchName">Upload batch name</label>
            <input
              id="batchName"
              type="text"
              placeholder="e.g. 2024 Southwest Monsoon CTD upload"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </div>

          <div className="ip-two-col">
            <div className="ip-field">
              <label htmlFor="sourceType">Source type</label>
              <select
                id="sourceType"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
              >
                <option>Cruise CTD / Station data</option>
                <option>Fisheries landings / CPUE</option>
                <option>Remote sensing (satellite)</option>
                <option>Molecular / eDNA runs</option>
                <option>Manual uploads from teams</option>
                <option>External API / web service</option>
              </select>
            </div>

            <div className="ip-field">
              <label htmlFor="inputFormat">Input format</label>
              <select
                id="inputFormat"
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
              >
                <option>CSV / TSV</option>
                <option>Excel</option>
                <option>NetCDF</option>
                <option>GeoTIFF</option>
                <option>JSON / API feed</option>
                <option>ZIP / archive bundle</option>
              </select>
            </div>
          </div>

          <div className="ip-field">
            <label htmlFor="schedule">Handling / schedule</label>
            <select
              id="schedule"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            >
              <option>Manual / one-time load</option>
              <option>Daily sync for this source</option>
              <option>Weekly refresh</option>
              <option>Monthly refresh</option>
              <option>On new cruise / campaign</option>
            </select>
          </div>

          {/* drag & drop zone – same pattern as DataUploadSection */}
          <div
            className="ip-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="ip-drop-main">
              <span className="ip-drop-icon">📂</span>
              Drag &amp; drop files here
            </p>
            <p className="ip-drop-sub">
              or{" "}
              <label className="ip-browse">
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
            <p className="ip-drop-hint">
              Supports all common ingestion inputs: tabular files, NetCDF, GeoTIFF, JSON, sequencing
              files, ZIP archives and more.
            </p>
          </div>

          {/* selected files list */}
          {files.length > 0 && (
            <div className="ip-files">
              <div className="ip-files-header">
                Selected files ({files.length})
              </div>
              <ul>
                {files.map((file, idx) => (
                  <li key={`${file.name}-${idx}`} className="ip-file-item">
                    <span className="ip-file-name">{file.name}</span>
                    <span className="ip-file-size">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
                      className="ip-file-remove"
                      onClick={() => handleRemove(idx)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="ip-field">
            <label htmlFor="notes">Notes / ingestion context</label>
            <textarea
              id="notes"
              rows="3"
              placeholder="Cruise ID, station range, expected variables, QC state, anything the Data Manager / system needs to know..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="ip-actions">
            <button type="submit" className="btn ip-btn-primary">
              Upload data
            </button>
            <p className="ip-small">
              Data will be validated and passed into the appropriate ingestion workflows before
              appearing in the unified OASIS catalogue.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default IngestionPipelineModule;
