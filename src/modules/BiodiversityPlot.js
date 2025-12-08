import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./BiodiversityPlot.css";

// Taxonomy endpoint
const TAXONOMY_URL = "http://10.121.243.94:8000/taxonomy/map";

const BiodiversityPlot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // family input (text)
  const [family, setFamily] = useState("");

  // For displaying generated image blob
  const [plotImage, setPlotImage] = useState(null);

  // For embedding "open map here" iframe
  const [livePlotUrl, setLivePlotUrl] = useState(null);

  const mountedRef = useRef(true);
  const controllerRef = useRef(null);

  // Generate plot → fetch blob image
  const generatePlot = async () => {
    setError(null);

    const familyTrimmed = (family || "").trim();
    if (!familyTrimmed) {
      setError("Please enter a family name (example: Acoetidae)");
      return;
    }

    setLoading(true);
    setLivePlotUrl(null); // hide iframe

    // clear previous blob URL
    if (plotImage) {
      try { URL.revokeObjectURL(plotImage); } catch {}
      setPlotImage(null);
    }

    // cancel previous request
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch {}
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await axios.get(TAXONOMY_URL, {
        params: { family: familyTrimmed },
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

  // Opens the taxonomy map inside the same page using an iframe
  const openMapHere = () => {
    const familyTrimmed = (family || "").trim();
    if (!familyTrimmed) {
      setError("Please enter a family name first.");
      return;
    }

    setError(null);

    const url = `${TAXONOMY_URL}?family=${encodeURIComponent(familyTrimmed)}`;
    setLivePlotUrl(url);

    // hide blob image
    if (plotImage) {
      try { URL.revokeObjectURL(plotImage); } catch {}
      setPlotImage(null);
    }
  };

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch {}
      }

      if (plotImage) {
        try { URL.revokeObjectURL(plotImage); } catch {}
      }
    };
  }, []);

  return (
    <div className="biodiversity-plot" style={{ padding: 16, borderRadius:20 }}>
      <header style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Taxonomy Map (by Family)</h3>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          
          <label htmlFor="family-input" style={{ color: "#6b7280" }}>
            Enter Family Name:
          </label>

          <input
            id="family-input"
            type="text"
            placeholder="Family Name"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.3)",
              minWidth: 200,
            }}
          />

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
            onClick={openMapHere}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "white",
              cursor: "pointer",
            }}
          >
            Open Map Here
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
            alt="taxonomy-plot"
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
            title="taxonomy-map"
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
          No plot loaded yet. Enter a family and click <strong>Generate Plot</strong> or{" "}
          <strong>Open Map Here</strong>.
        </div>
      )}
    </div>
  );
};

export default BiodiversityPlot;
