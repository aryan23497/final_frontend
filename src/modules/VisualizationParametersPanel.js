// src/modules/VisualizationParametersPanel.js
import React, { useState, useEffect, useMemo } from "react";
import "./VisualizationParametersPanel.css";

/**
 * VisualizationParametersPanel
 *
 * Props:
 *  - xOptions: array of strings for X-axis (Latitude, Longitude, Time)
 *  - yOptions: array of strings for Y-axis choices
 *  - initialX: default x option
 *  - initialY: array default y selections
 *  - onChange: callback(payload)
 *
 * Payload shape:
 * { independentVariable: 'Time', parameters: ['SST','CHL'], parameter1: 'SST', parameter2: 'CHL' }
 */

export default function VisualizationParametersPanel({
  xOptions = ["Latitude", "Longitude", "Time"],
  yOptions = [
    "DIC",
    "MCO",
    "PCO2_ORIGINAL",
    "CHL",
    "NO3",
    "SSS",
    "SST",
    "DEVIANT_UNCERTAINTY",
  ],
  initialX = "Time",
  initialY = ["SST"],
  onChange = () => {},
}) {
  const [independentVariable, setIndependentVariable] = useState(initialX);
  const [parameters, setParameters] = useState(initialY);

  // Expand named parameter keys parameter1, parameter2...
  const namedParameters = () => {
    const obj = {};
    parameters.forEach((p, idx) => {
      obj[`parameter${idx + 1}`] = p;
    });
    return obj;
  };

  // Notify parent whenever selections change
  useEffect(() => {
    const payload = {
      independentVariable,
      parameters,
      ...namedParameters(),
    };
    onChange(payload);
  }, [independentVariable, parameters, onChange]);

  // helper: compute which yOptions are still available (not selected)
  const selectedSet = useMemo(() => new Set(parameters), [parameters]);

  // Returns the available options for a new Y select (or for a specific index:
  // exclude the other selected parameters but allow own current selection)
  const availableForIndex = (index) => {
    return yOptions.filter((opt) => {
      // if this option is currently selected at the same index, allow it
      if (parameters[index] === opt) return true;
      // otherwise don't show options that appear in other selected slots
      return !selectedSet.has(opt);
    });
  };

  // Add a new parameter: pick the first available (if any)
  const addParameter = () => {
    // compute remaining options
    const remaining = yOptions.filter((o) => !selectedSet.has(o));
    if (remaining.length === 0) return; // nothing to add
    setParameters((prev) => [...prev, remaining[0]]);
  };

  // Remove parameter at index
  const removeParameterAt = (index) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  // When user changes a Y select at index, update parameters.
  // If they choose a value that is already used by another slot, prevent it by ignoring.
  const setParameterAt = (index, value) => {
    setParameters((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // Whether Add button should be disabled
  const addDisabled = yOptions.filter((o) => !selectedSet.has(o)).length === 0;

  return (
    <div className="vpp-panel">
      <h3 className="vpp-title">Visualization Parameters</h3>

      <label className="vpp-label">X-axis (independent variable)</label>
      <select
        value={independentVariable}
        onChange={(e) => setIndependentVariable(e.target.value)}
        className="vpp-select"
        aria-label="vpp-x-axis"
      >
        {xOptions.map((o) => (
          <option key={`x-${o}`} value={o}>
            {o}
          </option>
        ))}
      </select>

      <div className="vpp-y-header">
        <label className="vpp-label">Y-axis (parameters)</label>
        <button
          type="button"
          className="vpp-add"
          onClick={addParameter}
          aria-label="vpp-add"
          disabled={addDisabled}
          title={addDisabled ? "No more available parameters" : "Add another Y parameter"}
        >
          + Add
        </button>
      </div>

      <div className="vpp-y-rows">
        {parameters.map((param, idx) => {
          const avail = availableForIndex(idx);
          return (
            <div key={`y-${idx}`} className="vpp-y-row">
              <select
                value={param}
                onChange={(e) => setParameterAt(idx, e.target.value)}
                className="vpp-select"
                aria-label={`vpp-y-${idx}`}
              >
                {avail.map((o) => (
                  <option key={`${idx}-${o}`} value={o}>
                    {o}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="vpp-remove"
                onClick={() => removeParameterAt(idx)}
                aria-label={`vpp-remove-${idx}`}
              >
                −
              </button>
            </div>
          );
        })}
      </div>

      {/* <div className="vpp-preview">
        <div className="vpp-preview-label">Stored variables (read-only preview)</div>
        <pre className="vpp-json">
{JSON.stringify({ independentVariable, parameters, ...namedParameters() }, null, 2)}
        </pre>
      </div> */}
    </div>
  );
}
