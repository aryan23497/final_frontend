import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "./VisualizationTool.css";
import axios from "axios";

/**
 * VisualizationTool (full-width map / plot)
 *
 * - No separate "Data & Filters" panel anymore.
 * - A single "Generate plot" button requests a plot from the backend
 *   using default parameters (domain, time range, axes, plot_type).
 * - Backend endpoint: /ocean/plot (update URL as needed).
 */

const VisualizationTool = () => {
  // ----------- core state -----------
  const [timeRange] = useState("last7"); // fixed default
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");

  const [vizParams] = useState({
    independentVariable: "Time",
    parameters: ["SST"],
  });

  const [plotType] = useState("line"); // fixed default

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  // ----------- lifecycle cleanup -----------
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

  // ----------- date helpers -----------
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

  // initialise last 7 days once
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

  // ----------- field mapping -----------
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

  // ----------- build payload for backend -----------
  const buildPayloadAndParams = useCallback(() => {
    const parameters = vizParams.parameters || [];
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
      y_axes,
      x_label: vizParams.independentVariable,
      y_labels: parameters,
      plot_type: plotType,
    };

    const params = {
      start_date,
      end_date,
      plot_type: plotType,
      x: x_axis,
      y: y_axes.length ? y_axes[0] : "",
      format: "png",
    };

    return { body, params };
  }, [vizParams, time1, time2, timeRange, fieldMap, toYYYYMMDD, plotType]);

  // ----------- request image -----------
  const handleGeneratePlot = useCallback(async () => {
    setError(null);

    const parameters = vizParams.parameters || [];
    if (!parameters || parameters.length === 0) {
      setError(new Error("No Y parameter configured."));
      return;
    }

    if (imageUrl) {
      try {
        URL.revokeObjectURL(imageUrl);
      } catch (e) {}
      setImageUrl(null);
    }

    setLoading(true);

    const backendUrl = "http://192.168.137.121:8000/ocean/plot"; // update if needed
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
          const getConfig = {
            responseType: "blob",
            timeout: 45000,
            signal: controller.signal,
            headers: {
              Accept: "image/png, image/jpeg, application/octet-stream",
            },
            params,
          };
          resp = await axios.get(backendUrl, getConfig);
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
        console.log("Plot request cancelled");
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
              "No response from server. Check that the backend is running and CORS is configured."
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

  // ----------- JSX -----------
  return (
    <div className="viz-layout viz-full-layout">
      {/* FULL-WIDTH MAP / PLOT PANEL */}
      <section className="viz-panel viz-panel-main">
        <div className="viz-panel-header">
          <div>
            <h3 className="viz-panel-title">Map / Plot View</h3>
            <p className="viz-panel-text">
              The backend returns a plot image (PNG/JPEG) for the configured
              oceanographic query. It will be displayed here when ready.
            </p>
          </div>
        </div>

        <div className="viz-map-placeholder">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated plot"
              className="viz-plot-image"
            />
          ) : loading ? (
            <div className="viz-map-message">Generating image…</div>
          ) : (
            <div className="viz-map-message">
              <p>Spatial visualization / plot will appear here.</p>
              <small>Click “Generate plot” to request an image.</small>
            </div>
          )}
        </div>

        <div className="viz-main-actions">
          <button
            type="button"
            className="viz-generate-btn"
            onClick={handleGeneratePlot}
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate plot"}
          </button>

          {error && (
            <p className="viz-error">
              {error.message || "Failed to generate image."}
            </p>
          )}
        </div>
      </section>

      {/* BOTTOM SUMMARY METRICS (unchanged) */}
      <section className="viz-panel viz-panel-bottom">
        <h3 className="viz-panel-title">Time Series & Indicators</h3>
        <p className="viz-panel-text">
          Summary metrics (static placeholders for now).
        </p>

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
