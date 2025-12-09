// VisualizationTool.js (updated)
// Full file — includes validation rules for relation, violin, box, hexbin plot types.
// Keeps original behavior for 'line' and biodiversity pieces.
// Based on user's previously provided file.

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./VisualizationTool.css";
import "./BiodiversityPlot.css"; // keep biodiversity styles available
import VisualizationParametersPanel from "./VisualizationParametersPanel";
import axios from "axios";

// Endpoints (update these if your backend host/port changes)
const TAXONOMY_URL = "http://192.168.0.2:8000/taxonomy/map";
const BASE_OCEAN_BACKEND = "http://192.168.0.2:8000/ocean-overlay/multi";
const BASE_BIODIVERSITY_BACKEND = "http://192.168.0.2:8000/biodiversity";
// NEW GET endpoint for distribution-style plots (violin/box/corr/...)
const NEW_DIST_PLOT_GET = "http://192.168.0.2:8000/ocean-dist/plot";

const PLOT_TYPES = [
  "line",
  "violin",
  "box",
  "corr",
  "scatter_matrix",
  "relation",
  "hexbin",
];

const VisualizationTool = () => {
  // Global state
  const [timeRange, setTimeRange] = useState("last7");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [vizParams, setVizParams] = useState({
    independentVariable: "Time",
    parameters: ["SST"],
  });
  const [plotType, setPlotType] = useState("line");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  // domain selector
  const [domain, setDomain] = useState("Oceanography");

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

  // Date helpers
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
  }, [timeRange, setLastNDays, time1, time2, toDDMMYYYY]);

  useEffect(() => {
    setLastNDays(7);
  }, [setLastNDays]);

  const toYYYYMMDD = useCallback((ddmmyyyy) => {
    if (!ddmmyyyy) return "";
    const parts = ddmmyyyy.split("/");
    if (parts.length !== 3) return ddmmyyyy;
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Field mapping & params utility
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

  const handleVizParamsChange = useCallback((payload) => {
    setVizParams((prev) => {
      try {
        if (JSON.stringify(prev) === JSON.stringify(payload)) return prev;
      } catch (e) {}
      return payload;
    });
  }, []);

  const buildPayloadAndParams = useCallback(() => {
    const body = { domain };
    const params = { domain };

    if (domain === "Oceanography") {
      const parameters = vizParams?.parameters || [];
      const start_date = toYYYYMMDD(time1);
      const end_date = toYYYYMMDD(time2);
      const x_axis =
        fieldMap[vizParams.independentVariable] || vizParams.independentVariable;
      const y_axes = parameters.map((p) => fieldMap[p] || p);

      body.start_date = start_date;
      body.end_date = end_date;
      body.time_range = timeRange;
      body.x_axis = x_axis;
      body.y_axes = y_axes;
      body.x_label = vizParams.independentVariable;
      body.y_labels = parameters;
      body.plot_type = plotType;

      params.plot_type = plotType;
      params.x = x_axis;
      params.y = y_axes;
      params.start_date = start_date;
      params.end_date = end_date;
    } else {
      body.plot_type = plotType;
      params.plot_type = plotType;
    }

    return { body, params };
  }, [domain, vizParams, time1, time2, timeRange, fieldMap, toYYYYMMDD, plotType]);

  // Biodiversity integration (unchanged)
  const [bioFamily, setBioFamily] = useState("");
  const [bioPlotImage, setBioPlotImage] = useState(null);
  const [bioLivePlotUrl, setBioLivePlotUrl] = useState(null);
  const bioControllerRef = useRef(null);
  const bioMountedRef = useRef(true);
  const [bioLoading, setBioLoading] = useState(false);
  const [bioError, setBioError] = useState(null);

  useEffect(() => {
    bioMountedRef.current = true;
    return () => {
      bioMountedRef.current = false;
      if (bioControllerRef.current) {
        try {
          bioControllerRef.current.abort();
        } catch (e) {}
      }
      if (bioPlotImage) {
        try {
          URL.revokeObjectURL(bioPlotImage);
        } catch (e) {}
      }
    };
  }, [bioPlotImage]);

  const bioGeneratePlot = async () => {
    setBioError(null);
    const familyTrimmed = (bioFamily || "").trim();
    if (!familyTrimmed) {
      setBioError("Please enter a family name (example: Acoetidae)");
      return;
    }

    setBioLoading(true);
    setBioLivePlotUrl(null);

    if (bioPlotImage) {
      try {
        URL.revokeObjectURL(bioPlotImage);
      } catch (e) {}
      setBioPlotImage(null);
    }

    if (bioControllerRef.current) {
      try {
        bioControllerRef.current.abort();
      } catch (e) {}
    }

    const controller = new AbortController();
    bioControllerRef.current = controller;

    try {
      const response = await axios.get(TAXONOMY_URL, {
        params: { family: familyTrimmed },
        responseType: "blob",
        timeout: 30000,
        signal: controller.signal,
      });

      if (!bioMountedRef.current) return;

      const blob = response.data;
      if (!blob) throw new Error("No image received from backend.");

      const url = URL.createObjectURL(blob);
      setBioPlotImage(url);
      setBioError(null);
    } catch (err) {
      if (!bioMountedRef.current) return;

      if (axios.isCancel?.(err)) {
        console.log("Request cancelled");
      } else {
        console.error("Biodiversity plot error:", err);
        if (err.response) {
          setBioError(`Server returned ${err.response.status}: ${err.response.statusText}`);
        } else if (err.request) {
          setBioError("No response from server.");
        } else {
          setBioError(err.message || "Unknown error");
        }
      }
    } finally {
      setBioLoading(false);
    }
  };

  const bioOpenMapHere = () => {
    const familyTrimmed = (bioFamily || "").trim();
    if (!familyTrimmed) {
      setBioError("Please enter a family name first.");
      return;
    }

    setBioError(null);
    const url = `${TAXONOMY_URL}?family=${encodeURIComponent(familyTrimmed)}`;
    setBioLivePlotUrl(url);

    if (bioPlotImage) {
      try {
        URL.revokeObjectURL(bioPlotImage);
      } catch (e) {}
      setBioPlotImage(null);
    }
  };

  // ---------- Validation rules ----------
  const validateParamsForPlotType = useCallback((plotTypeValue, yParams) => {
    // yParams is array
    const ys = Array.isArray(yParams) ? yParams : yParams ? [yParams] : [];

    // relation -> at least 2 parameters
    if (plotTypeValue === "relation") {
      if (ys.length < 2) {
        return "Relation plots require at least 2 Y parameters.";
      }
    }

    // violin, box, hexbin -> exactly 1 parameter
    if (["violin", "box", "hexbin"].includes(plotTypeValue)) {
      if (ys.length !== 1) {
        return `Plot type '${plotTypeValue}' requires exactly 1 Y parameter.`;
      }
    }

    // other plot types have no extra rules here (e.g., corr/scatter_matrix can accept multiple)
    return null;
  }, []);

  // Apply handler (updated routing for non-line plots + parameter validation)
  const handleApply = useCallback(async () => {
    setError(null);

    // Domain-specific parameter checks
    const parameters = vizParams?.parameters || [];

    // General check: Oceanography requires at least one parameter
    if (domain === "Oceanography") {
      if (!parameters || parameters.length === 0) {
        setError(new Error("Select at least one Y parameter."));
        return;
      }
    }

    // Validate according to selected plotType rules
    const valError = validateParamsForPlotType(plotType, parameters);
    if (valError) {
      setError(new Error(valError));
      return;
    }

    // Clear previous image URL
    if (imageUrl) {
      try {
        URL.revokeObjectURL(imageUrl);
      } catch (e) {}
      setImageUrl(null);
    }

    setLoading(true);

    const { body, params } = buildPayloadAndParams();

    // Cancel previous
    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (e) {}
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // If plotType is 'line' → use existing behavior (POST or fallback GET)
      if (plotType === "line") {
        if (domain === "Biodiversity") {
          // Biodiversity POST/GET - reuse original logic
          try {
            const resp = await axios.post(BASE_BIODIVERSITY_BACKEND, body, {
              responseType: "blob",
              timeout: 45000,
              signal: controller.signal,
              headers: { "Content-Type": "application/json", Accept: "image/png, image/jpeg" },
            });
            if (!mountedRef.current) return;
            const blob = resp?.data;
            if (blob) {
              const url = URL.createObjectURL(blob);
              setImageUrl(url);
              setError(null);
              return;
            }
          } catch (errB) {
            // fallback GET
            const q = [];
            if (params.plot_type) q.push(`plot_type=${encodeURIComponent(params.plot_type)}`);
            if (params.domain) q.push(`domain=${encodeURIComponent(params.domain)}`);
            const urlWithQuery = `${BASE_BIODIVERSITY_BACKEND}?${q.join("&")}`;
            const respGet = await axios.get(urlWithQuery, {
              responseType: "blob",
              timeout: 45000,
              signal: controller.signal,
            });
            if (!mountedRef.current) return;
            const blob = respGet?.data;
            if (blob) {
              const url = URL.createObjectURL(blob);
              setImageUrl(url);
              setError(null);
              return;
            }
          }
        } else {
          // Oceanography POST (with fallback GET)
          try {
            const resp = await axios.post(BASE_OCEAN_BACKEND, body, {
              responseType: "blob",
              timeout: 45000,
              signal: controller.signal,
              headers: { "Content-Type": "application/json", Accept: "image/png, image/jpeg" },
            });
            if (!mountedRef.current) return;
            const blob = resp?.data;
            if (blob) {
              const url = URL.createObjectURL(blob);
              setImageUrl(url);
              setError(null);
              return;
            }
          } catch (postErr) {
            // fallback GET (existing logic)
            // build query with repeated y params
            const queryParts = [];
            queryParts.push(`plot_type=${encodeURIComponent(params.plot_type)}`);
            if (params.x) queryParts.push(`x=${encodeURIComponent(params.x)}`);
            if (Array.isArray(params.y)) {
              params.y.forEach((yVal) => queryParts.push(`y=${encodeURIComponent(yVal)}`));
            } else if (params.y) {
              queryParts.push(`y=${encodeURIComponent(params.y)}`);
            }
            if (params.start_date) queryParts.push(`start_date=${encodeURIComponent(params.start_date)}`);
            if (params.end_date) queryParts.push(`end_date=${encodeURIComponent(params.end_date)}`);
            if (params.domain) queryParts.push(`domain=${encodeURIComponent(params.domain)}`);
            const queryString = queryParts.join("&");
            const urlWithQuery = `${BASE_OCEAN_BACKEND}?${queryString}`;
            const respGet = await axios.get(urlWithQuery, {
              responseType: "blob",
              timeout: 45000,
              signal: controller.signal,
            });
            if (!mountedRef.current) return;
            const blob = respGet?.data;
            if (blob) {
              const url = URL.createObjectURL(blob);
              setImageUrl(url);
              setError(null);
              return;
            }
            // if still no data, fallthrough to error
          }
        }

        throw new Error("No valid response from server.");
      }

      // ---------------------
      // Non-line plot types → use NEW_DIST_PLOT_GET (GET)
      // Send: plot=<plotType>&x=<x>&y=<y1>&y=<y2>...&start_date=&end_date=&domain=
      // ---------------------
      const x_axis = params.x || "";
      const y_axes = Array.isArray(params.y) ? params.y : params.y ? [params.y] : [];

      // Ensure at most 8 y params (user requested up to 8)
      const yLimited = y_axes.slice(0, 8);

      // Build query
      const qp = [];
      qp.push(`plot=${encodeURIComponent(plotType)}`);
      if (x_axis) qp.push(`x=${encodeURIComponent(x_axis)}`);
      // include all y params (or a single one)
      yLimited.forEach((yy) => qp.push(`y=${encodeURIComponent(yy)}`));

      if (params.start_date) qp.push(`start_date=${encodeURIComponent(params.start_date)}`);
      if (params.end_date) qp.push(`end_date=${encodeURIComponent(params.end_date)}`);
      if (params.domain) qp.push(`domain=${encodeURIComponent(params.domain)}`);

      const finalUrl = `${NEW_DIST_PLOT_GET}?${qp.join("&")}`;

      const resp = await axios.get(finalUrl, {
        responseType: "blob",
        timeout: 60000,
        signal: controller.signal,
      });

      if (!mountedRef.current) return;

      const blob = resp?.data;
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setError(null);
        return;
      }

      throw new Error("No image received from new plot GET endpoint.");
    } catch (err) {
      if (!mountedRef.current) return;
      if (axios.isCancel?.(err)) {
        console.log("Request cancelled");
      } else {
        console.error("Failed to fetch image:", err);
        if (err?.response) setError(new Error(`Server returned ${err.response.status}: ${err.response.statusText}`));
        else if (err?.request) setError(new Error("No response from server. Check backend & CORS."));
        else setError(new Error(err.message || "Unknown error"));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [vizParams, imageUrl, buildPayloadAndParams, domain, plotType, validateParamsForPlotType]);

  // Render UI
  return (
    <div className="viz-layout reverse-layout">
      {/* RIGHT: FILTERS */}
      <section className="viz-panel viz-panel-left">
        <h3 className="viz-panel-title">Data & Filters</h3>
        <p className="viz-panel-text">Select domain, region, time window and plot type to request a plot image from the backend.</p>

        {/* DOMAIN DROPDOWN */}
        <div className="viz-form-group">
          <label>Domain</label>
          <select value={domain} onChange={(e) => {
            setDomain(e.target.value);
            // clear biodiversity-specific views on domain switch
            setBioFamily("");
            setBioPlotImage(null);
            setBioLivePlotUrl(null);
            setError(null);
          }}>
            <option>Oceanography</option>
            <option>Biodiversity</option>
          </select>
        </div>

        {/* Plot Type dropdown (title-level control) */}
        <div className="viz-form-group">
          <label>Plot Type</label>
          <select value={plotType} onChange={(e) => setPlotType(e.target.value)}>
            {PLOT_TYPES.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
          <div className="viz-hint">Use <code>line</code> to keep existing flow; other types use the dist GET endpoint.</div>
        </div>

        {/* Oceanography-specific controls */}
        {domain === "Oceanography" && (
          <>
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
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
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
                        const [yyyy, mm, dd] = yyyymmdd.split("-");
                        setTime1(`${dd}/${mm}/${yyyy}`);
                      } else setTime1("");
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
                        const [yyyy, mm, dd] = yyyymmdd.split("-");
                        setTime2(`${dd}/${mm}/${yyyy}`);
                      } else setTime2("");
                    }}
                    className="date-input"
                  />
                </div>
              </>
            )}

            <div style={{ marginTop: 18 }}>
              <VisualizationParametersPanel xOptions={xOptions} yOptions={yOptions} initialX="Time" initialY={initialY} onChange={handleVizParamsChange} />
              <div className="viz-hint" style={{ marginTop: 8 }}>
                Choose up to 8 Y parameters for multi-series plots (other plot types will use up to the first 8).
              </div>
            </div>
          </>
        )}

        {/* Biodiversity domain controls (integrated BiodiversityPlot features) */}
        {domain === "Biodiversity" && (
          <>
            <div className="biodiversity-plot" style={{ padding: 8 }}>
              <h4 style={{ marginTop: 0, marginBottom: 8 }}>Taxonomy Map (by Family)</h4>

              <div className="biodiversity-controls" style={{ alignItems: "center" }}>
                <label htmlFor="family-input" style={{ color: "#6b7280" }}>Enter Family Name:</label>
                <input
                  id="family-input"
                  type="text"
                  placeholder="Family Name"
                  value={bioFamily}
                  onChange={(e) => setBioFamily(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(148,163,184,0.3)",
                    minWidth: 200,
                    background: "rgba(15,23,42,0.85)",
                    color: "#e5e7eb"
                  }}
                />

                <button
                  onClick={bioGeneratePlot}
                  disabled={bioLoading}
                  className="biodiversity-btn"
                  style={{ marginLeft: 6 }}
                >
                  {bioLoading ? "Generating..." : "Generate Plot"}
                </button>

                <button
                  onClick={bioOpenMapHere}
                  className="biodiversity-btn secondary"
                  style={{ marginLeft: 6 }}
                >
                  Open Map Here
                </button>
              </div>

              <div className="biodiversity-hint">Taxonomy map (backend: {TAXONOMY_URL}).</div>

              {bioError && <div className="biodiversity-error">{bioError}</div>}
            </div>
          </>
        )}

        <div style={{ marginTop: 14 }}>
          <button type="button" className="viz-apply-btn" onClick={handleApply} disabled={loading}>
            {loading ? "Generating image…" : "Apply Filters"}
          </button>
        </div>

        {error && <div className="viz-error" style={{ marginTop: 12, color: "#ffbdbd" }}>{error.message || "Failed to generate image. See console."}</div>}
      </section>

      {/* LEFT: Display area */}
      <section className="viz-panel viz-panel-main">
        <div className="viz-panel-header">
          <div>
            <h3 className="viz-panel-title">Map / Plot View</h3>
            <p className="viz-panel-text">The backend will return a plot image (PNG/JPEG) or an interactive iframe. It will be displayed here when ready.</p>
          </div>
        </div>

        <div className="viz-map-placeholder" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 360 }}>
          {imageUrl ? (
            <img src={imageUrl} alt="Generated plot" style={{ maxWidth: "100%", maxHeight: "640px", objectFit: "contain", borderRadius: 8, boxShadow: "0 6px 20px rgba(2,6,23,0.6)" }} />
          ) : bioPlotImage ? (
            <div className="biodiversity-plot-image">
              <img src={bioPlotImage} alt="taxonomy-plot" style={{ width: "100%", maxHeight: 700, objectFit: "contain", borderRadius: 8 }} />
            </div>
          ) : bioLivePlotUrl ? (
            <div className="biodiversity-iframe-container">
              <iframe src={bioLivePlotUrl} title="taxonomy-map" style={{ width: "100%", height: 700, border: "none", borderRadius: 8 }} />
            </div>
          ) : loading ? (
            <div style={{ color: "#9fb4d8" }}>Generating image…</div>
          ) : (
            <div style={{ textAlign: "center", color: "#9fb4d8" }}>
              <p style={{ marginBottom: 6 }}>Spatial visualization / plot will appear here</p>
              <small>Click "Apply Filters" to request a plot image, or for Biodiversity use the taxonomy controls above.</small>
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM: Summary metrics */}
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
