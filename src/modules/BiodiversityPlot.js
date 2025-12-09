// BiodiversityPlot.js (updated)
// Replace your existing file with this version.

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./BiodiversityPlot.css";

// API base — change if your backend runs on a different host/port
const BASE_URL = "http://192.168.0.2:8000";

const PLOTS_LIST = [
  "richness_heatmap",
  "family_composition",
  "rank_abundance",
  "locality_diversity",
];

const INDICES_LIST = [
  "shannon_index",
  "simpson_dominance",
  "evenness_scatter",
  "diversity_rank",
];

const BiodiversityPlot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // category: 'plots' or 'indices'
  const [category, setCategory] = useState("plots");
  // selected plot/index option
  const [choice, setChoice] = useState(PLOTS_LIST[0]);

  // For displaying generated image blob
  const [plotImage, setPlotImage] = useState(null);

  // For embedding "open map here" iframe (or endpoint output)
  const [livePlotUrl, setLivePlotUrl] = useState(null);

  const mountedRef = useRef(true);
  const controllerRef = useRef(null);

  // Compute endpoint path based on selected category
  const endpointFor = (cat) => `${BASE_URL}/biodiversity/${cat}`;

  // Generate plot → fetch blob image (same behavior as before but with dropdowns)
  const generatePlot = async () => {
    setError(null);

    if (!choice) {
      setError("Please select a plot or index option.");
      return;
    }

    setLoading(true);
    setLivePlotUrl(null); // hide iframe

    // clear previous blob URL
    if (plotImage) {
      try {
        URL.revokeObjectURL(plotImage);
      } catch {}
      setPlotImage(null);
    }

    // cancel previous request
    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch {}
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await axios.get(endpointFor(category), {
        params: { plot: choice },
        responseType: "blob",
        timeout: 30000,
        signal: controller.signal,
      });

      if (!mountedRef.current) return;

      const blob = response.data;
      if (!blob) throw new Error("No image received from backend.");

      const url = URL.createObjectURL(blob);
      setPlotImage(url);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;

      if (axios.isCancel?.(err)) {
        console.log("Request cancelled");
      } else {
        console.error("Plot error:", err);
        if (err.response) {
          setError(`Server returned ${err.response.status}: ${err.response.statusText}`);
        } else if (err.request) {
          setError("No response from server.");
        } else {
          setError(err.message || "Unknown error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Opens the selected endpoint inside the same page using an iframe
  // Useful if the endpoint can render HTML / interactive content
  const openHere = () => {
    if (!choice) {
      setError("Please select a plot or index option first.");
      return;
    }

    setError(null);

    const url = `${endpointFor(category)}?plot=${encodeURIComponent(choice)}`;
    setLivePlotUrl(url);

    // hide blob image
    if (plotImage) {
      try {
        URL.revokeObjectURL(plotImage);
      } catch {}
      setPlotImage(null);
    }
  };

  // when category changes, default the choice to the first of that category
  useEffect(() => {
    if (category === "plots") {
      setChoice(PLOTS_LIST[0]);
    } else {
      setChoice(INDICES_LIST[0]);
    }
  }, [category]);

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (controllerRef.current) {
        try {
          controllerRef.current.abort();
        } catch {}
      }

      if (plotImage) {
        try {
          URL.revokeObjectURL(plotImage);
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="biodiversity-plot" style={{ padding: 16, borderRadius: 20 }}>
      <header style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Biodiversity — Plots & Indices</h3>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <label htmlFor="category-select" style={{ color: "#6b7280" }}>
            Category:
          </label>

          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.3)",
              minWidth: 180,
              background: "white",
            }}
          >
            <option value="plots">plots</option>
            <option value="indices">indices</option>
          </select>

          <label htmlFor="choice-select" style={{ color: "#6b7280" }}>
            Choice:
          </label>

          <select
            id="choice-select"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.3)",
              minWidth: 260,
              background: "white",
            }}
          >
            {(category === "plots" ? PLOTS_LIST : INDICES_LIST).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <button
            onClick={generatePlot}
            disabled={loading}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "none",
              background: loading ? "#9ca3af" : "#06b6d4",
              color: "#020617",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate Plot"}
          </button>

          <button
            onClick={openHere}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "white",
              cursor: "pointer",
            }}
          >
            Open Here
          </button>
        </div>
      </header>

      {/* Error message */}
      {error && <div style={{ color: "#b91c1c", marginBottom: 10 }}>{error}</div>}

      {/* Blob image result */}
      {plotImage && (
        <div style={{ marginTop: 12 }}>
          <img
            src={plotImage}
            alt="biodiversity-plot"
            style={{
              width: "100%",
              maxHeight: 700,
              objectFit: "contain",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.2)",
            }}
          />
        </div>
      )}

      {/* Iframe result */}
      {livePlotUrl && (
        <div style={{ marginTop: 12 }}>
          <iframe
            src={livePlotUrl}
            title="biodiversity-output"
            style={{
              width: "100%",
              height: 700,
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 8,
            }}
          />
        </div>
      )}

      {!plotImage && !livePlotUrl && (
        <div style={{ marginTop: 12, color: "#6b7280" }}>
          No plot loaded yet. Choose a category and option, then click <strong>Generate Plot</strong> or{" "}
          <strong>Open Here</strong>.
        </div>
      )}
    </div>
  );
};

export default BiodiversityPlot;
