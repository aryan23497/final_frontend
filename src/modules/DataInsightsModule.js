// src/modules/DataInsightsModule.js
import React, { useState } from "react";
import "./DataInsightsModule.css";

const DOMAIN_OPTIONS = [
  "All domains",
  "Oceanography",
  "Fisheries",
  "Molecular & eDNA",
  "Taxonomy & Systematics",
];

const TIME_WINDOWS = [
  "Last 7 days",
  "Last 30 days",
  "Last cruise / survey",
  "Monsoon season (JAS)",
];

const FOCUS_METRICS = [
  "SST & Chl-a",
  "Biomass / CPUE",
  "eDNA richness & turnover",
  "Species occurrences / range shifts",
];

// Mock signals that AI would highlight
const MOCK_SIGNALS = [
  {
    id: 1,
    label: "SST anomaly hotspot",
    domain: "Oceanography",
    text: "Positive SST anomaly (~+1.2 °C) in the eastern Arabian Sea shelf, co-located with enhanced Chl-a.",
    severity: "medium",
  },
  {
    id: 2,
    label: "Coastal bloom event",
    domain: "Oceanography",
    text: "Elevated coastal Chl-a band along the Kerala shelf, coinciding with river discharge and upwelling indices.",
    severity: "high",
  },
  {
    id: 3,
    label: "Pelagic biomass shift",
    domain: "Fisheries",
    text: "Acoustic backscatter suggests offshore displacement of pelagic biomass compared to 5-year climatology.",
    severity: "medium",
  },
];

const DataInsightsModule = () => {
  const [domain, setDomain] = useState("All domains");
  const [timeWindow, setTimeWindow] = useState("Last 30 days");
  const [region, setRegion] = useState("Kerala shelf");
  const [focusMetric, setFocusMetric] = useState("SST & Chl-a");

  return (
    <div className="ins-layout">
      {/* Small banner at top */}
      <div className="ins-banner">
        <span className="ins-banner-label">SCIENTIST · DATA INSIGHTS</span>
        <span className="ins-banner-sub">
          AI-curated summaries from recent uploads, cruises, satellite grids and eDNA runs.
        </span>
      </div>

      <section className="ins-grid">
        {/* LEFT: context & filters */}
        <div className="ins-panel ins-left">
          <h3 className="ins-title">Insight context</h3>
          <p className="ins-text">
            Choose the domain, region and time window for which OASIS should
            generate high-level system insights. In the full stack, this will call
            an <code>/api/insights</code> endpoint on the backend.
          </p>

          <div className="ins-field">
            <label>Scientific domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              {DOMAIN_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="ins-field">
            <label>Time window</label>
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
            >
              {TIME_WINDOWS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="ins-field">
            <label>Region / box</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Kerala shelf, Eastern Arabian Sea…"
            />
          </div>

          <div className="ins-field">
            <label>Focus indicator</label>
            <select
              value={focusMetric}
              onChange={(e) => setFocusMetric(e.target.value)}
            >
              {FOCUS_METRICS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Mini summary box */}
          <div className="ins-mini-summary">
            <p className="ins-mini-label">Current selection</p>
            <p className="ins-mini-line">
              <span>Domain:</span> {domain}
            </p>
            <p className="ins-mini-line">
              <span>Window:</span> {timeWindow}
            </p>
            <p className="ins-mini-line">
              <span>Region:</span> {region || "Not specified"}
            </p>
            <p className="ins-mini-line">
              <span>Focus:</span> {focusMetric}
            </p>
          </div>

          <p className="ins-note">
            * For now, indicators and narrative are mock values. Later the
            backend will aggregate CTD, satellite, acoustic, fisheries and eDNA
            layers, run AI models and return real insights.
          </p>
        </div>

        {/* RIGHT: indicators + narrative + signals + actions */}
        <div className="ins-panel ins-right">
          {/* Key indicators row */}
          <div className="ins-kpi-header">
            <h3 className="ins-title">Key indicators</h3>
            <p className="ins-text">
              Quick view of anomalies and indices for the selected context.
            </p>
          </div>

          <div className="ins-kpi-grid">
            <div className="ins-kpi-card">
              <p className="ins-kpi-label">SST anomaly (°C)</p>
              <p className="ins-kpi-value">+1.2</p>
              <p className="ins-kpi-status ins-kpi-warn">
                Elevated vs climatology
              </p>
              <p className="ins-kpi-foot">
                Based on satellite SST grids and CTD casts.
              </p>
            </div>

            <div className="ins-kpi-card">
              <p className="ins-kpi-label">Chl-a bloom index</p>
              <p className="ins-kpi-value">0.8</p>
              <p className="ins-kpi-status ins-kpi-high">
                Coastal bloom signal
              </p>
              <p className="ins-kpi-foot">
                Derived from ocean colour composites along the shelf.
              </p>
            </div>

            <div className="ins-kpi-card">
              <p className="ins-kpi-label">Pelagic biomass index</p>
              <p className="ins-kpi-value">1.1×</p>
              <p className="ins-kpi-status ins-kpi-neutral">
                Slightly above normal
              </p>
              <p className="ins-kpi-foot">
                Computed from acoustic backscatter &amp; trawl CPUE.
              </p>
            </div>

            <div className="ins-kpi-card">
              <p className="ins-kpi-label">eDNA richness</p>
              <p className="ins-kpi-value">+18%</p>
              <p className="ins-kpi-status ins-kpi-neutral">
                High community turnover
              </p>
              <p className="ins-kpi-foot">
                From recent eDNA transects and metabarcoding runs.
              </p>
            </div>
          </div>

          {/* AI narrative */}
          <div className="ins-narrative">
            <p className="ins-narrative-heading">System state overview</p>
            <p>
              For <strong>{timeWindow}</strong> in{" "}
              <strong>{region || "the selected region"}</strong> with focus on{" "}
              <strong>{focusMetric}</strong> ({domain}), OASIS detects a
              combination of near-normal background conditions and a small set of
              anomalies of scientific interest.
            </p>
            <p>
              Surface warming and enhanced Chl-a along the coastal band suggest
              active upwelling and riverine influence. Pelagic biomass appears
              slightly displaced offshore, while eDNA richness indicates increased
              community turnover in nearshore stations. Together, these layers
              point to a dynamically evolving habitat that may impact fisheries
              and biodiversity over the coming weeks.
            </p>
          </div>

          {/* Signals list */}
          <div className="ins-signals">
            <p className="ins-section-label">Key signals &amp; anomalies</p>
            <ul className="ins-signal-list">
              {MOCK_SIGNALS.map((s) => (
                <li
                  key={s.id}
                  className={`ins-signal-item ins-signal-${s.severity}`}
                >
                  <div className="ins-signal-main">
                    <span className="ins-signal-label">{s.label}</span>
                    <span className="ins-signal-domain">{s.domain}</span>
                  </div>
                  <p className="ins-signal-text">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Data coverage + next steps */}
          <div className="ins-actions-row">
            <div className="ins-next-steps">
              <p className="ins-section-label">Suggested next steps</p>
              <ul>
                <li>
                  Open the <strong>Visualization Tool</strong> with this domain,
                  region and time window to inspect detailed plots and sections.
                </li>
                <li>
                  Use the <strong>Influence Engine</strong> to test scenarios
                  where SST and Chl-a anomalies persist or intensify.
                </li>
                <li>
                  Link these insights to specific <strong>cruises / surveys</strong> in the{" "}
                  <strong>Ingestion Pipeline</strong> and tag them in{" "}
                  <strong>Metadata Tagger</strong> for future reference.
                </li>
              </ul>
            </div>

            <div className="ins-status-card">
              <p className="ins-status-label">Insight status</p>
              <p className="ins-status-line">
                Last refresh: <span>mock · a few minutes ago</span>
              </p>
              <p className="ins-status-line">
                Data layers:{" "}
                <span>CTD, nutrients, satellite, acoustic, eDNA</span>
              </p>
              <p className="ins-status-line">
                QC coverage: <span>≈90% pass standard checks</span>
              </p>
              <p className="ins-status-line">
                Confidence: <span>Prototype narrative only</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataInsightsModule;
