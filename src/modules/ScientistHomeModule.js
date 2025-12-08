import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ScientistHomeModule.css";

// Backend URL - update if needed
const BACKEND_URL = "http://10.121.243.94:8000/visualize/map";

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
  const [isLive, setIsLive] = useState(false);

  // default parameter
  const [parameter, setParameter] = useState("DEVIANT_UNCERTAINTY");

  // image blob url returned by backend when "Generate Plot" is used
  const [plotImage, setPlotImage] = useState(null);

  // livePlotUrl will be used to embed the map/plot in an iframe below the buttons
  const [livePlotUrl, setLivePlotUrl] = useState(null);

  const mountedRef = useRef(true);
  const controllerRef = useRef(null);

  const generatePlot = async () => {
    setError(null);
    setLoading(true);
    setIsLive(false);

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
      setIsLive(true);
      setError(null);

      // Also clear embedded iframe URL so the image shows (if you prefer iframe instead, comment this)
      setLivePlotUrl(null);
    } catch (err) {
      if (!mountedRef.current) return;
      if (axios.isCancel?.(err)) {
        console.log("Request cancelled");
      } else {
        console.error("Failed to generate plot:", err);
        if (err.response) {
          setError(`Server returned ${err.response.status}: ${err.response.statusText}`);
        } else if (err.request) {
          setError("No response from server. Confirm backend is running and accessible.");
        } else {
          setError(err.message || "Unknown error");
        }
      }
      setIsLive(false);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // Set iframe URL to open the map in the same page below the buttons
  const openMapHere = () => {
    const url = `${BACKEND_URL}?parameter=${encodeURIComponent(parameter)}`;
    setLivePlotUrl(url);
    // clear any previously loaded image blob so iframe is visible
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
          <h3 style={{ margin: 0 }}>Real-time Oceanography Snapshot</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label htmlFor="parameter-select" style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
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

            <button
              onClick={generatePlot}
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
              onClick={openMapHere}
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
          </div>
        </div>
        <p style={{ marginTop: 8 }}>
          Select a parameter and click Generate Plot to visualize {parameter} data.
        </p>
      </header>

      {/* Display errors if any */}
      {error && (
        <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>
      )}

      {/* If backend returned an image blob via Generate Plot, show it as <img> */}
      {plotImage && (
        <div style={{ marginTop: 12 }}>
          <img
            src={plotImage}
            alt="generated-plot"
            style={{ width: "100%", maxHeight: 600, objectFit: "contain", borderRadius: 8, border: "1px solid rgba(148,163,184,0.15)" }}
          />
        </div>
      )}

      {/* If the user clicked Open Map Here (or set livePlotUrl), embed the backend page in an iframe */}
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
          No plot loaded. Choose a parameter and click <strong>Generate Plot</strong> or <strong>Open Map Here</strong>.
        </div>
      )}
    </div>
  );
};

export default ScientistHomeModule;
