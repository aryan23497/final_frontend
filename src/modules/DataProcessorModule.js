import React, { useState } from "react";
import "./DataProcessorModule.css";

const DataProcessorModule = () => {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // --------- file handlers ---------
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

  // --------- submit query ---------
  const handleRunProcessor = (e) => {
    e.preventDefault();
    setAnswer("");
    if (!query.trim()) {
      alert("Please type a processing query or question.");
      return;
    }

    setLoading(true);

    // 🔌 This is where you will call your real backend later.
    // e.g. POST /data-processor with { query, files }
    // For now we just build a mock AI-style response.
    const fileNames = files.length
      ? files.map((f) => `• ${f.name}`).join("\n")
      : "No files attached (working on catalogue data only).";

    const mockAnswer = `
I analysed your request:

“${query.trim()}”

Here is how the Data Processor would handle it:

1. Ingest the selected dataset(s).
2. Apply cleaning, standardisation and quality checks.
3. Run the requested transformation / analysis pipeline.
4. Produce a processed output table and summary plots.

Datasets selected:
${fileNames}

⚠️ This is a prototype message. In the real system this panel will show
the AI-generated steps, SQL/processing recipe, and links to the processed output.
    `.trim();

    // Simulate short delay so UI feels responsive
    setTimeout(() => {
      setAnswer(mockAnswer);
      setLoading(false);
    }, 700);
  };

  const handleClear = () => {
    setFiles([]);
    setQuery("");
    setAnswer("");
  };

  return (
    <div className="dp-layout">
      {/* LEFT: UPLOAD + QUERY */}
      <section className="dp-panel dp-left">
        <header className="dp-header">
          <div>
            <h3 className="dp-title">Data Processor · Upload & Query</h3>
            <p className="dp-subtitle">
              Attach one or more datasets and describe the processing you want
              to run. The AI assistant will draft a processing recipe.
            </p>
          </div>
        </header>

        <form onSubmit={handleRunProcessor} className="dp-form">
          {/* Upload */}
          <label className="dp-label">Upload dataset(s)</label>
          <div
            className="dp-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="dp-drop-main">
              <span className="dp-drop-icon">📂</span>
              Drag &amp; drop files here
            </p>
            <p className="dp-drop-sub">
              or{" "}
              <span className="dp-browse">
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
            <p className="dp-drop-hint">
              Supports CSV, NetCDF, Excel, images, ZIP and other research
              formats.
            </p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="dp-files">
              <div className="dp-files-header">
                Selected files <span>({files.length})</span>
              </div>
              <ul>
                {files.map((f, idx) => (
                  <li key={`${f.name}-${idx}`} className="dp-file-row">
                    <span className="dp-file-name">{f.name}</span>
                    <button
                      type="button"
                      className="dp-file-remove"
                      onClick={() => handleRemoveFile(idx)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Query textarea */}
          <label className="dp-label" style={{ marginTop: "1rem" }}>
            Processing query / instructions
          </label>
          <textarea
            className="dp-textarea"
            rows={5}
            placeholder="Example: Clean CTD profiles, remove spikes, bin-average to 1 m, then compute mixed layer depth and export a tidy CSV."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="dp-actions">
            <button
              type="submit"
              className="btn dp-btn-primary"
              disabled={loading}
            >
              {loading ? "Running processor…" : "Run with AI"}
            </button>
            <button
              type="button"
              className="btn dp-btn-secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          </div>

          <p className="dp-note">
            * Later, this form will send your files + query to a FastAPI / AI
            backend which will return a processing recipe and logs.
          </p>
        </form>
      </section>

      {/* RIGHT: AI OUTPUT */}
      <section className="dp-panel dp-right">
        <header className="dp-header dp-header-right">
          <div>
            <h3 className="dp-title">AI Processing Output</h3>
            <p className="dp-subtitle">
              Draft steps and explanation generated from your query and attached
              datasets.
            </p>
          </div>
        </header>

        <div className="dp-output">
          {loading ? (
            <div className="dp-output-loading">
              <div className="dp-spinner" />
              <p>Analysing query and datasets…</p>
            </div>
          ) : answer ? (
            <article className="dp-output-card">
              <pre className="dp-output-text">{answer}</pre>
              <div className="dp-output-footer">
                <button
                  type="button"
                  className="dp-mini-btn"
                  onClick={() => navigator.clipboard.writeText(answer)}
                >
                  Copy
                </button>
              </div>
            </article>
          ) : (
            <div className="dp-output-empty">
              <p>No run yet.</p>
              <p>
                Upload a dataset, type a processing question on the left, and
                click <strong>Run with AI</strong> to see a draft recipe here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DataProcessorModule;
