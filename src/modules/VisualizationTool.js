// src/modules/VisualizationTool.js
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./VisualizationTool.css";
import VisualizationParametersPanel from "./VisualizationParametersPanel";
import axios from "axios";

/**
 * VisualizationTool
 *
 * - Requests a plot image from your backend /ocean/plot endpoint.
 * - Attempts POST (JSON) first. If server replies 405, retries GET with query params.
 * - Sends selected plot type (line | bubble | scatter) to backend in both body and query params.
 * - Displays returned image (PNG/JPEG) as an object URL in an <img>.
 *
 * NOTE: If your backend requires authentication or special headers, add them in axios config.
 */

const VisualizationTool = () => {
  // -----------------------------
  // State
  // -----------------------------
  const [timeRange, setTimeRange] = useState("last7");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [vizParams, setVizParams] = useState({
    independentVariable: "Time",
    parameters: ["SST"],
  });

  // plotType state (line | bubble | scatter)
  const [plotType, setPlotType] = useState("line");

  const [imageUrl, setImageUrl] = useState(null); // object URL from blob
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Abort + mounted flags
  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (controllerRef.current) {
        try {
          controllerRef.current.abort();
        } catch (e) {}
      }
      if (imageUrl) {
        try {
          URL.revokeObjectURL(imageUrl);
        } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Date helpers
  // -----------------------------
  const toDDMMYYYY = useCallback((d) => {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}`;
  }, []);

  const setLastNDays = useCallback(
    (n) => {
      const now = new Date();
      const endStr = toDDMMYYYY(now);
      const start = new Date(now);
      start.setDate(start.getDate() - n);
      const startStr = toDDMMYYYY(start);
      setTime1(startStr);
      setTime2(endStr);
    },
    [toDDMMYYYY]
  );

  useEffect(() => {
    if (timeRange === "last7") setLastNDays(7);
    else if (timeRange === "last30") setLastNDays(30);
    else if (timeRange === "custom") {
      if (!time1) setTime1(toDDMMYYYY(new Date()));
      if (!time2) setTime2(toDDMMYYYY(new Date()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  useEffect(() => {
    // init default
    setLastNDays(7);
  }, [setLastNDays]);

  const toYYYYMMDD = useCallback((ddmmyyyy) => {
    if (!ddmmyyyy) return "";
    const parts = ddmmyyyy.split("/");
    if (parts.length !== 3) return ddmmyyyy;
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // -----------------------------
  // Field mapping (UI -> backend)
  // -----------------------------
  const fieldMap = useMemo(
    () => ({
      Time: "datetime",
      Latitude: "lat",
      Longitude: "lon",
      DIC: "dic",
      MLD: "mld",
      PCO2_ORIGINAL: "pco2_original",
      CHL: "chl",
      NO3: "no3",
      SSS: "sss",
      SST: "sst",
      DEVIANT_UNCERTAINTY: "deviant_uncertainty",
    }),
    []
  );

  const xOptions = useMemo(() => ["Latitude", "Longitude", "Time"], []);
  const yOptions = useMemo(
    () => [
      "DIC",
      "MLD",
      "PCO2_ORIGINAL",
      "CHL",
      "NO3",
      "SSS",
      "SST",
      "DEVIANT_UNCERTAINTY",
    ],
    []
  );
  const initialY = useMemo(() => ["SST"], []);

  // -----------------------------
  // Viz params change handler
  // -----------------------------
  const handleVizParamsChange = useCallback((payload) => {
    setVizParams((prev) => {
      try {
        if (JSON.stringify(prev) === JSON.stringify(payload)) return prev;
      } catch (e) {}
      return payload;
    });
  }, []);

  // -----------------------------
  // Helper: build POST body and GET params
  // -----------------------------
  const buildPayloadAndParams = useCallback(() => {
    const parameters = vizParams?.parameters || [];
    const start_date = toYYYYMMDD(time1);
    const end_date = toYYYYMMDD(time2);
    const x_axis =
      fieldMap[vizParams.independentVariable] ||
      vizParams.independentVariable;
    const y_axes = parameters.map((p) => fieldMap[p] || p);

    const body = {
      start_date,
      end_date,
      time_range: timeRange,
      x_axis,
      y_axes: y_axes, // Ensure y_axes is always a list
      x_label: vizParams.independentVariable,
      y_labels: parameters,
      plot_type: plotType,
    };

    const params = {
      plot_type: plotType,
      x: x_axis,
      y: y_axes, // Pass y_axes as list in GET params too
      start_date,
      end_date,
      
    };

    return { body, params };
  }, [vizParams, time1, time2, timeRange, fieldMap, toYYYYMMDD, plotType]);

  // -----------------------------
  // Apply: request image from backend
  // -----------------------------
  const handleApply = useCallback(async () => {
    setError(null);

    const parameters = vizParams?.parameters || [];
    if (!parameters || parameters.length === 0) {
      setError(new Error("Select at least one Y parameter."));
      return;
    }

    if (imageUrl) {
      try {
        URL.revokeObjectURL(imageUrl);
      } catch (e) {}
      setImageUrl(null);
    }

    setLoading(true);

    const backendUrl = "http://10.121.243.94:8000/ocean/plot/multi";
    const { body, params } = buildPayloadAndParams();

    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (e) {}
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const postConfig = {
        responseType: "blob",
        timeout: 45000,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "image/png, image/jpeg, application/octet-stream",
        },
      };

      let resp;
      try {
        resp = await axios.post(backendUrl, body, postConfig);
      } catch (postErr) {
        if (postErr?.response?.status === 405) {
          // Build query string manually to get y=value1&y=value2 format
          const queryParts = [];
          queryParts.push(`plot_type=${encodeURIComponent(params.plot_type)}`);
          queryParts.push(`x=${encodeURIComponent(params.x)}`);
          // Add each y value separately
          if (Array.isArray(params.y)) {
            params.y.forEach(yVal => {
              queryParts.push(`y=${encodeURIComponent(yVal)}`);
            });
          }
          queryParts.push(`format=${encodeURIComponent(params.format)}`);
          
          const queryString = queryParts.join('&');
          const urlWithQuery = `${backendUrl}?${queryString}`;
          
          const getConfig = {
            responseType: "blob",
            timeout: 45000,
            signal: controller.signal,
            headers: {
              Accept: "image/png, image/jpeg, application/octet-stream",
            },
          };
          resp = await axios.get(urlWithQuery, getConfig);
        } else {
          throw postErr;
        }
      }

      if (!mountedRef.current) return;

      const blob = resp?.data;
      if (!blob) {
        throw new Error("No binary data received from server.");
      }

      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      if (axios.isCancel?.(err)) {
        console.log("Request cancelled");
      } else {
        console.error("Failed to fetch image:", err);
        if (err.response) {
          setError(
            new Error(
              `Server returned ${err.response.status}: ${err.response.statusText}`
            )
          );
        } else if (err.request) {
          setError(
            new Error(
              "No response from server. Confirm backend is running and CORS is allowed."
            )
          );
        } else {
          setError(new Error(err.message || "Unknown error"));
        }
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [vizParams, imageUrl, buildPayloadAndParams]);

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="viz-layout reverse-layout">
      {/* RIGHT: FILTERS */}
      <section className="viz-panel viz-panel-left">
        <h3 className="viz-panel-title">Data & Filters</h3>
        <p className="viz-panel-text">
          Select domain, region, time window and plot type to request a plot
          image from the backend.
        </p>

        {/* DOMAIN DROPDOWN – only Oceanography & Biodiversity */}
        <div className="viz-form-group">
          <label>Domain</label>
          <select>
            <option>Oceanography</option>
            <option>Biodiversity</option>
          </select>
        </div>

        <div className="viz-form-group">
          <label>Region</label>
          <select>
            <option>Entire Indian EEZ</option>
            <option>Arabian Sea</option>
            <option>Bay of Bengal</option>
            <option>Andaman Sea</option>
          </select>
        </div>

        <div className="viz-form-group">
          <label>Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {timeRange === "custom" && (
          <>
            <div className="viz-form-group">
              <label>Start date</label>
              <input
                type="date"
                value={toYYYYMMDD(time1)}
                onChange={(e) => {
                  const yyyymmdd = e.target.value;
                  if (yyyymmdd) {
                    const [yyyy, mm, dd] = yyyymmdd.split('-');
                    setTime1(`${dd}/${mm}/${yyyy}`);
                  } else {
                    setTime1('');
                  }
                }}
                className="date-input"
              />
            </div>

            <div className="viz-form-group">
              <label>End date</label>
              <input
                type="date"
                value={toYYYYMMDD(time2)}
                onChange={(e) => {
                  const yyyymmdd = e.target.value;
                  if (yyyymmdd) {
                    const [yyyy, mm, dd] = yyyymmdd.split('-');
                    setTime2(`${dd}/${mm}/${yyyy}`);
                  } else {
                    setTime2('');
                  }
                }}
                className="date-input"
              />
            </div>
          </>
        )}

        <div className="viz-form-group">
          <label>Plot Type</label>
          <select
            value={plotType}
            onChange={(e) => setPlotType(e.target.value)}
          >
            <option value="line">Line</option>
            <option value="bubble">Bubble</option>
            <option value="scatter">Scatter</option>
          </select>
          <small
            style={{ color: "#9fb4d8", display: "block", marginTop: 6 }}
          >
            Selected plot type is sent to backend as <code>plot_type</code>.
          </small>
        </div>

        <div style={{ marginTop: 18 }}>
          <VisualizationParametersPanel
            xOptions={xOptions}
            yOptions={yOptions}
            initialX="Time"
            initialY={initialY}
            onChange={handleVizParamsChange}
          />
        </div>

        <button
          type="button"
          className="viz-apply-btn"
          onClick={handleApply}
          disabled={loading}
        >
          {loading ? "Generating image…" : "Apply Filters"}
        </button>

        {error && (
          <div
            className="viz-error"
            style={{ marginTop: 12, color: "#ffbdbd" }}
          >
            {error.message || "Failed to generate image. See console."}
          </div>
        )}
      </section>

      {/* LEFT: IMAGE / MAP VIEW */}
      <section className="viz-panel viz-panel-main">
        <div className="viz-panel-header">
          <div>
            <h3 className="viz-panel-title">Map / Plot View</h3>
            <p className="viz-panel-text">
              The backend will return a plot image (PNG/JPEG). It will be
              displayed here when ready.
            </p>
          </div>
        </div>

        <div
          className="viz-map-placeholder"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 360,
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated plot"
              style={{
                maxWidth: "100%",
                maxHeight: "640px",
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 6px 20px rgba(2,6,23,0.6)",
              }}
            />
          ) : loading ? (
            <div style={{ color: "#9fb4d8" }}>Generating image…</div>
          ) : (
            <div style={{ textAlign: "center", color: "#9fb4d8" }}>
              <p style={{ marginBottom: 6 }}>
                Spatial visualization / plot will appear here
              </p>
              <small>
                Click &quot;Apply Filters&quot; to request a plot image from the
                backend.
              </small>
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM: METRICS */}
      <section className="viz-panel viz-panel-bottom">
        <h3 className="viz-panel-title">Time Series & Indicators</h3>
        <p className="viz-panel-text">Summary metrics (static placeholders)</p>

        <div className="viz-metrics-grid">
          <div className="viz-metric-card">
            <p className="viz-metric-label">SST (°C)</p>
            <p className="viz-metric-value">27.3</p>
            <p className="viz-metric-note">Near long-term average.</p>
          </div>
          <div className="viz-metric-card">
            <p className="viz-metric-label">Chl-a (mg/m³)</p>
            <p className="viz-metric-value">0.8</p>
            <p className="viz-metric-note">Elevated coastal bloom.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisualizationTool;