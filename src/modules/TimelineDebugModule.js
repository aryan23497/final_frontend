// src/modules/TimelineDebugModule.js
import React, { useState, useMemo } from "react";
import "./TimelineDebugModule.css";

const TimelineDebugModule = () => {
  /* ---------- Mock data ---------- */

  const timelineEvents = [
    {
      id: 1,
      pipeline: "CTD – Cruise MLR-24-01",
      time: "12:14",
      stations: 10,
      status: "success",
      message: "Profiles ingested and QC passed.",
    },
    {
      id: 2,
      pipeline: "Fisheries – Landing centre sync",
      time: "11:52",
      status: "warning",
      message: "Missing gear codes in 23 records.",
    },
    {
      id: 3,
      pipeline: "eDNA – Shelf transects upload",
      time: "11:23",
      status: "error",
      message: "Sequence file checksum mismatch.",
    },
    {
      id: 4,
      pipeline: "Satellite SST – Daily composite",
      time: "10:40",
      status: "success",
      message: "New tiles pushed to data lake.",
    },
  ];

  const runningJobs = [
    {
      id: 1,
      name: "eDNA pipeline – MLR-24-Station 08",
      progress: 65,
      eta: "08 min",
      status: "running",
    },
    {
      id: 2,
      name: "Fisheries landings – Weekly aggregation",
      progress: 42,
      eta: "15 min",
      status: "running",
    },
    {
      id: 3,
      name: "Satellite colour – Tile refresh",
      progress: 90,
      eta: "02 min",
      status: "running",
    },
  ];

  const logEntries = [
    {
      id: 101,
      ts: "11:23",
      level: "ERROR",
      source: "eDNA pipeline",
      msg: "Checksum mismatch for file: run_2024_06_12.fq.gz",
    },
    {
      id: 102,
      ts: "11:24",
      level: "INFO",
      source: "Object storage",
      msg: "Retrying download from backup bucket…",
    },
    {
      id: 103,
      ts: "11:52",
      level: "WARN",
      source: "Fisheries ingest",
      msg: "Unknown gear_code: \"X99\" in 17 rows.",
    },
    {
      id: 104,
      ts: "12:02",
      level: "INFO",
      source: "CTD pipeline",
      msg: "QC flags computed for 10 stations.",
    },
  ];

  const recentActions = [
    {
      id: 1,
      time: "12:20",
      text: "Data Manager re-ran failed eDNA pipeline.",
    },
    {
      id: 2,
      time: "11:58",
      text: "Admin updated SST ingestion schedule.",
    },
    {
      id: 3,
      time: "11:40",
      text: "Data Collector uploaded 4 landing centre files.",
    },
  ];

  /* ---------- UI state ---------- */

  const [timelineFilter, setTimelineFilter] = useState("all");
  const [logLevelFilter, setLogLevelFilter] = useState("ALL");
  const [logSearch, setLogSearch] = useState("");

  /* ---------- Derived values ---------- */

  const filteredTimeline = useMemo(() => {
    if (timelineFilter === "all") return timelineEvents;
    return timelineEvents.filter((ev) => ev.status === timelineFilter);
  }, [timelineFilter, timelineEvents]);

  const filteredLogs = useMemo(() => {
    return logEntries.filter((log) => {
      const matchLevel =
        logLevelFilter === "ALL" || log.level === logLevelFilter;
      const term = logSearch.trim().toLowerCase();
      const matchText =
        !term ||
        log.msg.toLowerCase().includes(term) ||
        log.source.toLowerCase().includes(term);
      return matchLevel && matchText;
    });
  }, [logLevelFilter, logSearch, logEntries]);

  const totalPipelines = timelineEvents.length;
  const failedCount = timelineEvents.filter((t) => t.status === "error").length;
  const warningCount = timelineEvents.filter(
    (t) => t.status === "warning"
  ).length;

  /* ---------- Handlers (dummy for now) ---------- */

  const handleQuickAction = (action) => {
    // purely visual for now – hook to FastAPI later
    alert(`${action} – backend integration can be added later.`);
  };

  /* ---------- Render ---------- */

  return (
    <div className="timeline-debug-layout">
      {/* Top summary row */}
      <div className="timeline-summary-row">
        <div className="timeline-summary-card">
          <p className="summary-label">Pipelines today</p>
          <p className="summary-value">{totalPipelines}</p>
          <p className="summary-footnote">Runs ingested in the last 24 hours</p>
        </div>

        <div className="timeline-summary-card">
          <p className="summary-label">Running now</p>
          <p className="summary-value">{runningJobs.length}</p>
          <p className="summary-footnote">
            Live ingestion & aggregation workflows
          </p>
        </div>

        <div className="timeline-summary-card warning">
          <p className="summary-label">Warnings</p>
          <p className="summary-value">{warningCount}</p>
          <p className="summary-footnote">Pipelines with non-critical issues</p>
        </div>

        <div className="timeline-summary-card danger">
          <p className="summary-label">Failed</p>
          <p className="summary-value">{failedCount}</p>
          <p className="summary-footnote">Require follow-up or re-run</p>
        </div>
      </div>

      {/* Main row: timeline + logs */}
      <div className="timeline-main-row">
        {/* Ingestion timeline */}
        <div className="timeline-card ingestion-card">
          <div className="card-header">
            <h3>Ingestion Timeline</h3>
            <div className="timeline-filter-group">
              <button
                className={
                  "chip" + (timelineFilter === "all" ? " chip-active" : "")
                }
                onClick={() => setTimelineFilter("all")}
              >
                All
              </button>
              <button
                className={
                  "chip" +
                  (timelineFilter === "success" ? " chip-active" : "")
                }
                onClick={() => setTimelineFilter("success")}
              >
                Success
              </button>
              <button
                className={
                  "chip" +
                  (timelineFilter === "warning" ? " chip-active" : "")
                }
                onClick={() => setTimelineFilter("warning")}
              >
                Warnings
              </button>
              <button
                className={
                  "chip" + (timelineFilter === "error" ? " chip-active" : "")
                }
                onClick={() => setTimelineFilter("error")}
              >
                Failed
              </button>
            </div>
          </div>

          <ul className="timeline-list">
            {filteredTimeline.map((ev) => (
              <li key={ev.id} className="timeline-item">
                <span
                  className={`timeline-status-dot status-${ev.status}`}
                ></span>
                <div className="timeline-item-main">
                  <div className="timeline-item-header">
                    <span className="timeline-pipeline">{ev.pipeline}</span>
                    <span className="timeline-time">{ev.time}</span>
                  </div>
                  <p className="timeline-message">{ev.message}</p>
                  {ev.stations && (
                    <p className="timeline-meta">
                      {ev.stations} stations • Completed
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Logs panel */}
        <div className="timeline-card logs-card">
          <div className="card-header">
            <h3>Debug & Logs</h3>
            <div className="logs-filter-bar">
              <select
                className="logs-select"
                value={logLevelFilter}
                onChange={(e) => setLogLevelFilter(e.target.value)}
              >
                <option value="ALL">All levels</option>
                <option value="ERROR">Errors</option>
                <option value="WARN">Warnings</option>
                <option value="INFO">Info</option>
              </select>
              <input
                className="logs-search"
                type="text"
                placeholder="Search in logs…"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="logs-table">
            {filteredLogs.map((log) => (
              <div key={log.id} className="logs-row">
                <span className="logs-ts">{log.ts}</span>
                <span className={`logs-level level-${log.level.toLowerCase()}`}>
                  {log.level}
                </span>
                <span className="logs-source">{log.source}</span>
                <span className="logs-msg">{log.msg}</span>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <p className="logs-empty">
                No log entries match the current filters.
              </p>
            )}
          </div>

          <div className="logs-footer">
            <button
              className="btn-secondary"
              onClick={() => handleQuickAction("Download debug report")}
            >
              Download Debug Report
            </button>
            <span className="logs-footnote">
              * In the full system this panel will connect to centralised logs
              (e.g. Loki / ELK).
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: running jobs + system health + actions */}
      <div className="timeline-bottom-row">
        {/* Running jobs */}
        <div className="timeline-card running-card">
          <div className="card-header">
            <h3>Running Jobs</h3>
            <p className="card-subtitle">
              Live ingestion and aggregation pipelines.
            </p>
          </div>
          <ul className="running-list">
            {runningJobs.map((job) => (
              <li key={job.id} className="running-item">
                <div className="running-top">
                  <span className="running-name">{job.name}</span>
                  <span className="running-eta">ETA {job.eta}</span>
                </div>
                <div className="running-progress-bar">
                  <div
                    className="running-progress-fill"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                <div className="running-meta">
                  <span className="running-status">Running</span>
                  <span className="running-percent">{job.progress}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* System overview + actions */}
        <div className="timeline-card system-card">
          <div className="card-header">
            <h3>System Overview & Actions</h3>
          </div>

          <div className="system-grid">
            <div className="system-metric">
              <p className="metric-label">Ingestion load</p>
              <p className="metric-value">Medium</p>
              <p className="metric-footnote">3 active jobs • 1 queued</p>
            </div>
            <div className="system-metric">
              <p className="metric-label">Storage usage</p>
              <p className="metric-value">68%</p>
              <p className="metric-footnote">
                Data lake tier-1 • last cleanup 2 days ago
              </p>
            </div>
            <div className="system-metric">
              <p className="metric-label">API requests (today)</p>
              <p className="metric-value">12.4k</p>
              <p className="metric-footnote">
                Includes dashboards & model services
              </p>
            </div>
            <div className="system-metric">
              <p className="metric-label">Last backup</p>
              <p className="metric-value">03:10 IST</p>
              <p className="metric-footnote">Snapshot of core databases</p>
            </div>
          </div>

          <div className="system-actions">
            <button
              className="btn-primary"
              onClick={() => handleQuickAction("Re-run failed jobs")}
            >
              Re-run failed jobs
            </button>
            <button
              className="btn-secondary"
              onClick={() => handleQuickAction("Export logs for last 24h")}
            >
              Export last 24h logs
            </button>
            <button
              className="btn-tertiary"
              onClick={() =>
                handleQuickAction("Notify Admin about repeated failures")
              }
            >
              Notify Admin
            </button>
          </div>

          <div className="recent-actions">
            <h4>Recent User Actions</h4>
            <ul>
              {recentActions.map((act) => (
                <li key={act.id}>
                  <span className="recent-time">{act.time}</span>
                  <span className="recent-text">{act.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineDebugModule;
