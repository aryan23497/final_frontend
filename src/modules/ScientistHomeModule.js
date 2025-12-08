// src/modules/ScientistHomeModule.jsx
import React, { useEffect, useState, useMemo } from "react";
import "./ScientistHomeModule.css";

// how many points to keep on the screen
const POINT_COUNT = 40;

// create initial fake SST series
const createInitialSeries = () => {
  const base = 27; // base SST
  return Array.from({ length: POINT_COUNT }, (_, i) => ({
    x: i,
    value:
      base +
      Math.sin(i / 5) * 0.7 + // slow oscillation
      (Math.random() - 0.5) * 0.3, // tiny noise
  }));
};

const ScientistHomeModule = () => {
  const [series, setSeries] = useState(createInitialSeries);

  // every 3 seconds, push a new point & drop the oldest
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const nextX = last.x + 1;
        // keep new value near previous with a bit of randomness
        const nextValue =
          last.value +
          (Math.random() - 0.5) * 0.4 + // random wiggle
          Math.sin(nextX / 8) * 0.05; // gentle drift
        const sliced = prev.slice(1);
        return [...sliced, { x: nextX, value: nextValue }];
      });
    }, 3000);

    return () => clearInterval(id);
  }, []);

  // compute SVG path
  const { path, minVal, maxVal } = useMemo(() => {
    if (!series.length) return { path: "", minVal: 0, maxVal: 1 };

    const values = series.map((d) => d.value);
    const minV = Math.min(...values) - 0.3;
    const maxV = Math.max(...values) + 0.3;

    const width = 900;
    const height = 260;
    const paddingLeft = 40;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 30;

    const usableWidth = width - paddingLeft - paddingRight;
    const usableHeight = height - paddingTop - paddingBottom;

    const xScale = (i) =>
      paddingLeft +
      (i / Math.max(series.length - 1, 1)) * usableWidth;

    const yScale = (v) => {
      const norm =
        (v - minV) / Math.max(maxV - minV, 0.0001); // 0 → 1
      return paddingTop + (1 - norm) * usableHeight;
    };

    let p = "";
    series.forEach((pt, i) => {
      const x = xScale(i);
      const y = yScale(pt.value);
      p += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });

    return { path: p, minVal: minV, maxVal: maxV };
  }, [series]);

  return (
    <div className="scientist-home">
      {/* HEADER */}
      <header className="scientist-home-header">
        <h3>Real-time Oceanography Snapshot</h3>
        <p>
          Surface sea-surface temperature (SST) stream – mock real-time
          data for the Indian EEZ. Plot updates automatically every few
          seconds.
        </p>
      </header>

      {/* REAL-TIME PLOT */}
      <section className="realtime-plot-container">
        <div className="realtime-plot-inner">
          <div className="realtime-plot-header-row">
            <div>
              <p className="realtime-plot-title">
                SST (°C) · Last ~2 hours (mock)
              </p>
              <p className="realtime-plot-sub">
                Streaming demo only – hook this to your /ocean/plot or
                WebSocket endpoint later.
              </p>
            </div>
            <span className="realtime-badge">
              Live mock · {series[series.length - 1]?.value.toFixed(2)}°C
            </span>
          </div>

          <svg
            className="realtime-plot-svg"
            viewBox="0 0 900 260"
            preserveAspectRatio="none"
          >
            {/* gradient background */}
            <defs>
              <linearGradient id="sstLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="sstFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
                <stop offset="100%" stopColor="rgba(15,23,42,0.0)" />
              </linearGradient>
            </defs>

            {/* under-area */}
            {path && (
              <>
                <path
                  d={`${path} L 890 260 L 40 260 Z`}
                  fill="url(#sstFill)"
                />
                <path
                  d={path}
                  fill="none"
                  stroke="url(#sstLine)"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* simple Y ticks on left */}
            {Array.from({ length: 4 }).map((_, i) => {
              const t = i / 3;
              const value = (minVal + t * (maxVal - minVal)).toFixed(1);
              const y = 40 + (1 - t) * 180;
              return (
                <g key={i}>
                  <line
                    x1={40}
                    x2={880}
                    y1={y}
                    y2={y}
                    stroke="rgba(148,163,184,0.18)"
                    strokeWidth="0.8"
                    strokeDasharray="3 4"
                  />
                  <text
                    x={10}
                    y={y + 4}
                    fontSize="10"
                    fill="#9ca3af"
                  >
                    {value}°C
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* METRICS + ACTIONS ROW */}
      <section className="home-metrics-grid">
        <div className="home-metric-card">
          <p className="home-metric-label">Current SST (mock)</p>
          <p className="home-metric-value">
            {series[series.length - 1]?.value.toFixed(2)}°C
          </p>
          <p className="home-metric-note">
            Near climatological mean for selected region.
          </p>
        </div>

        <div className="home-metric-card">
          <p className="home-metric-label">Last ΔT (mock)</p>
          <p className="home-metric-value">
            {(
              series[series.length - 1].value -
              series[series.length - 3].value
            ).toFixed(2)}
            °C
          </p>
          <p className="home-metric-note">
            Change over last two samples in the stream.
          </p>
        </div>
      </section>

      <section className="home-actions">
        <h4>Quick actions</h4>
        <div className="home-actions-list">
          <button
            type="button"
            className="home-action-btn"
            onClick={() => window.alert("Open Visualization Tool")}
          >
            Open Visualization Tool
          </button>
          <button
            type="button"
            className="home-action-btn"
            onClick={() => window.alert("Open AI Recommendation System")}
          >
            Ask AI for datasets
          </button>
          <button
            type="button"
            className="home-action-btn"
            onClick={() => window.alert("Open Cloud Data Server")}
          >
            View Cloud Data Server
          </button>
        </div>
      </section>

      <section className="home-status">
        Live mock stream · updates every few seconds. Replace this
        series with real values from your FastAPI backend (e.g.
        `/ocean/plot/stream` or WebSocket) when ready.
      </section>
    </div>
  );
};

export default ScientistHomeModule;
