// ScientistHomeModule.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ScientistHomeModule.css";

// Realtime backend URL - update if needed
const BACKEND_URL = "http://192.168.0.2:8000/visualize/map";

// Heatmap backend URL (matches screenshot /ocean-heatmap/plot)
const HEATMAP_URL = "http://192.168.0.2:8000/ocean-heatmap/plot";

const PARAMETERS = [
  { value: "DIC", label: "DIC" },
  { value: "MLD", label: "MLD" },
  { value: "PCO2_ORIGINAL", label: "PCO2_ORIGINAL" },
  { value: "CHL", label: "CHL" },
  { value: "NO3", label: "NO3" },
  { value: "SSS", label: "SSS" },
  { value: "SST", label: "SST" },
  { value: "DEVIANT_UNCERTAINTY", label: "DEVIANT_UNCERTAINTY" },
];

const ScientistHomeModule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // mode: "realtime" or "heatmap"
  const [mode, setMode] = useState("realtime");

  // default parameter
  const [parameter, setParameter] = useState("DEVIANT_UNCERTAINTY");

  // image blob url returned by backend when "Generate Plot" is used
  const [plotImage, setPlotImage] = useState(null);

  // livePlotUrl will be used to embed the map/plot in an iframe below the buttons
  const [livePlotUrl, setLivePlotUrl] = useState(null);

  const mountedRef = useRef(true);
  const controllerRef = useRef(null);

  const generatePlotRealtime = async () => {
    setError(null);
    setLoading(true);

    // When generating realtime plot as image, we want to clear iframe mode
    setLivePlotUrl(null);

    // revoke previous blob URL if exists
    if (plotImage) {
      try {
        URL.revokeObjectURL(plotImage);
      } catch (e) {}
      setPlotImage(null);
    }

    // cancel previous request if any
    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (e) {}
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await axios.get(BACKEND_URL, {
        params: { parameter },
        responseType: "blob",
        timeout: 30000,
        signal: controller.signal,
        headers: {
          Accept: "image/png, image/jpeg, application/octet-stream",
        },
      });

      if (!mountedRef.current) return;

      const blob = response?.data;
      if (!blob) throw new Error("No image data received from server.");

      const url = URL.createObjectURL(blob);
      setPlotImage(url);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      if (axios.isCancel?.(err)) {
        console.log("Request cancelled");
      } else {
        console.error("Failed to generate realtime plot:", err);
        if (err.response) {
          setError(`Server returned ${err.response.status}: ${err.response.statusText}`);
        } else if (err.request) {
          setError("No response from server. Confirm backend is running and accessible.");
        } else {
          setError(err.message || "Unknown error");
        }
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // If mode===heatmap, we open an iframe pointing at HEATMAP_URL with ?param=...
  const openHeatmap = () => {
    setError(null);

    // ensure we clear any blob image so iframe is visible
    if (plotImage) {
      try {
        URL.revokeObjectURL(plotImage);
      } catch (e) {}
      setPlotImage(null);
    }

    const qParam = encodeURIComponent((parameter || "").toLowerCase());
    const url = `${HEATMAP_URL}?param=${qParam}`;
    setLivePlotUrl(url);
  };

  // Set iframe URL to open the realtime map in the same page below the buttons
  const openMapHereRealtime = () => {
    // Build URL for realtime visualizer (keeps old behavior)
    const url = `${BACKEND_URL}?parameter=${encodeURIComponent(parameter)}`;
    setLivePlotUrl(url);
    // clear any previously loaded image blob so the iframe shows
    if (plotImage) {
      try {
        URL.revokeObjectURL(plotImage);
      } catch (e) {}
      setPlotImage(null);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (controllerRef.current) {
        try {
          controllerRef.current.abort();
        } catch (e) {}
      }
      if (plotImage) {
        try {
          URL.revokeObjectURL(plotImage);
        } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="scientist-home" style={{ padding: 16, borderRadius: 20 }}>
      <header style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>
            {mode === "realtime" ? "Real-time Oceanography Snapshot" : "Heatmap Visualization"}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label htmlFor="mode-select" style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
              Mode:
            </label>

            <select
              id="mode-select"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                // clear previous outputs when switching modes
                setLivePlotUrl(null);
                if (plotImage) {
                  try {
                    URL.revokeObjectURL(plotImage);
                  } catch (err) {}
                  setPlotImage(null);
                }
                setError(null);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid rgba(148, 163, 184, 0.3)",
                background: "rgba(15, 23, 42, 0.85)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              <option value="realtime">Realtime</option>
              <option value="heatmap">Heatmap</option>
            </select>

            <label htmlFor="parameter-select" style={{ fontSize: "0.9rem", color: "#9ca3af", marginLeft: 6 }}>
              Choose Parameter:
            </label>

            <select
              id="parameter-select"
              value={parameter}
              onChange={(e) => setParameter(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid rgba(148, 163, 184, 0.3)",
                background: "rgba(15, 23, 42, 0.85)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              {PARAMETERS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* Buttons behave depending on mode */}
            {mode === "realtime" ? (
              <>
                <button
                  onClick={generatePlotRealtime}
                  disabled={loading}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: "none",
                    background: loading ? "#94a3b8" : "#06b6d4",
                    color: loading ? "#9ca3af" : "#020617",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Generating..." : "Generate Plot"}
                </button>

                <button
                  onClick={openMapHereRealtime}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid rgba(148,163,184,0.2)",
                    background: "rgba(255, 255, 255, 1)",
                    color: "#111827",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    marginLeft: 8,
                  }}
                  title={`Open ${BACKEND_URL}?parameter=${parameter}`}
                >
                  Open Map Here
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openHeatmap}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: "none",
                    background: "#06b6d4",
                    color: "#020617",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Open Heatmap
                </button>

                <button
                  onClick={() => {
                    // also allow opening heatmap in new tab
                    const qParam = encodeURIComponent((parameter || "").toLowerCase());
                    window.open(`${HEATMAP_URL}?param=${qParam}`, "_blank", "noopener");
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid rgba(148,163,184,0.2)",
                    background: "rgba(255,255,255,1)",
                    color: "#111827",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    marginLeft: 8,
                  }}
                >
                  Open in New Tab
                </button>
              </>
            )}
          </div>
        </div>

        <p style={{ marginTop: 8 }}>
          {mode === "realtime"
            ? `Select a parameter and click Generate Plot to visualize ${parameter} data in realtime.`
            : `Heatmap mode: the selected parameter will be passed as "param" to the heatmap endpoint.`}
        </p>
      </header>

      {/* Display errors if any */}
      {error && (
        <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>
      )}

      {/* If backend returned an image blob via Generate Plot (realtime), show it as <img> */}
      {plotImage && (
        <div style={{ marginTop: 12 }}>
          <img
            src={plotImage}
            alt="generated-plot"
            style={{ width: "100%", maxHeight: 600, objectFit: "contain", borderRadius: 8, border: "1px solid rgba(148,163,184,0.15)" }}
          />
        </div>
      )}

      {/* If the user opened a map/heatmap (iframe), embed it */}
      {livePlotUrl && (
        <div style={{ marginTop: 12 }}>
          <iframe
            src={livePlotUrl}
            title="live-map"
            style={{ width: "100%", height: 600, border: "1px solid rgba(148,163,184,0.15)", borderRadius: 8 }}
          />
        </div>
      )}

      {/* Optionally show a small note when neither image nor iframe is present */}
      {!plotImage && !livePlotUrl && (
        <div style={{ marginTop: 12, color: "#6b7280" }}>
          {mode === "realtime" ? (
            <>No plot loaded. Choose a parameter and click <strong>Generate Plot</strong> or <strong>Open Map Here</strong>.</>
          ) : (
            <>No heatmap loaded. Choose a parameter and click <strong>Open Heatmap</strong>.</>
          )}
        </div>
      )}
    </div>
  );
};

export default ScientistHomeModule;
