// src/modules/DataUpdateModule.js
import React, { useState } from "react";
import "./DataUpdateModule.css";

const MOCK_UPDATES = [
  {
    id: 1,
    dataset: "Arabian Sea CTD 2022",
    domain: "Physical Oceanography",
    type: "Correction",
    severity: "Medium",
    status: "Pending",
    submittedBy: "Dr. A. Nair",
    submittedOn: "2024-11-18",
    reason: "Depth sensor offset corrected based on calibration cast.",
    currentVersion: "v1.2",
    newVersion: "v1.3",
    changes: [
      {
        field: "Depth offset",
        from: "0.8 m",
        to: "1.1 m",
        impact: "Profiles will be slightly deeper."
      },
      {
        field: "QC flag for 12 stations",
        from: "3 (questionable)",
        to: "1 (good)",
        impact: "Profiles now pass standard QC."
      }
    ],
    impactSummary: {
      recordsAffected: "2,140",
      productsAffected: "Mixed-layer depth, density profiles",
      needsReprocess: true,
      notes: "Re-processing scheduled for regional hydrography products."
    },
    validation: {
      schema: "pass",
      units: "pass",
      outliers: "warn",
      reference: "pass"
    },
    auditTrail: [
      {
        ts: "2024-11-18 10:12",
        actor: "Dr. A. Nair",
        action: "Submitted correction request"
      },
      {
        ts: "2024-11-18 11:03",
        actor: "System",
        action: "Auto-QC checks completed (1 warning)"
      }
    ]
  },
  {
    id: 2,
    dataset: "eDNA shelf transects v1 → v2",
    domain: "Molecular / eDNA",
    type: "Major Update",
    severity: "High",
    status: "Pending",
    submittedBy: "Molecular Lab (Kochi)",
    submittedOn: "2024-11-19",
    reason: "New reference DB + improved bioinformatics pipeline.",
    currentVersion: "v1.0",
    newVersion: "v2.0",
    changes: [
      {
        field: "Reference DB",
        from: "CMLRE-DB-2022",
        to: "CMLRE-DB-2024",
        impact: "New species assignments and updated taxonomy."
      },
      {
        field: "Pipeline",
        from: "v1 (OTU based)",
        to: "v2 (ASV based)",
        impact: "Higher resolution and better rare taxa detection."
      }
    ],
    impactSummary: {
      recordsAffected: "18 sequencing runs",
      productsAffected: "eDNA richness maps, rare species flags",
      needsReprocess: true,
      notes: "All downstream biodiversity products to be re-generated."
    },
    validation: {
      schema: "pass",
      units: "pass",
      outliers: "pass",
      reference: "pass"
    },
    auditTrail: [
      {
        ts: "2024-11-19 09:31",
        actor: "Molecular Lab (Kochi)",
        action: "Submitted major update"
      },
      {
        ts: "2024-11-19 09:35",
        actor: "System",
        action: "Dependency check: 4 products impacted"
      }
    ]
  },
  {
    id: 3,
    dataset: "Fisheries landings (2010-2015)",
    domain: "Fisheries",
    type: "Metadata",
    severity: "Low",
    status: "Pending",
    submittedBy: "Fisheries Division",
    submittedOn: "2024-11-20",
    reason: "Added missing gear codes & landing centres.",
    currentVersion: "v3.0",
    newVersion: "v3.1",
    changes: [
      {
        field: "Gear codes",
        from: "87% coverage",
        to: "100% coverage",
        impact: "Improved CPUE standardisation."
      },
      {
        field: "Landing centres",
        from: "312 centres",
        to: "348 centres",
        impact: "Better spatial allocation of catches."
      }
    ],
    impactSummary: {
      recordsAffected: "7,850",
      productsAffected: "CPUE trends, spatial effort maps",
      needsReprocess: false,
      notes: "Re-processing optional; recommended for new analyses."
    },
    validation: {
      schema: "pass",
      units: "pass",
      outliers: "pass",
      reference: "pass"
    },
    auditTrail: [
      {
        ts: "2024-11-20 14:05",
        actor: "Fisheries Division",
        action: "Submitted metadata update"
      }
    ]
  }
];

const statusColorClass = (severity) => {
  switch (severity) {
    case "High":
      return "severity-pill severity-high";
    case "Medium":
      return "severity-pill severity-medium";
    default:
      return "severity-pill severity-low";
  }
};

const checkStatusClass = (state) => {
  switch (state) {
    case "pass":
      return "check-pill check-pass";
    case "warn":
      return "check-pill check-warn";
    case "fail":
      return "check-pill check-fail";
    default:
      return "check-pill";
  }
};

const DataUpdateModule = () => {
  const [updates, setUpdates] = useState(MOCK_UPDATES);
  const [selectedId, setSelectedId] = useState(MOCK_UPDATES[0].id);
  const [reviewComment, setReviewComment] = useState("");

  const selectedUpdate = updates.find((u) => u.id === selectedId);

  const updateStatus = (newStatus) => {
    setUpdates((prev) =>
      prev.map((u) =>
        u.id === selectedId ? { ...u, status: newStatus } : u
      )
    );
    setReviewComment("");
  };

  const handleApprove = () => {
    updateStatus("Approved");
    alert("Update approved & scheduled for processing (mock behaviour).");
  };

  const handleClarification = () => {
    updateStatus("Clarification Requested");
    alert("Clarification requested from submitter (mock behaviour).");
  };

  const handleReject = () => {
    updateStatus("Rejected");
    alert("Update rejected (mock behaviour).");
  };

  return (
    <div className="dm-update">
      {/* LEFT : PENDING LIST */}
      <div className="dm-update-left">
        <h3 className="dm-panel-title">Pending Dataset Updates</h3>
        <p className="dm-panel-subtitle">
          Review version changes and corrections awaiting your action.
        </p>

        <div className="dm-update-list">
          {updates.map((u) => (
            <button
              key={u.id}
              type="button"
              className={
                "dm-update-item" +
                (u.id === selectedId ? " dm-update-item-active" : "")
              }
              onClick={() => setSelectedId(u.id)}
            >
              <div className="dm-update-item-header">
                <span className="dm-update-dataset">{u.dataset}</span>
                <span className={statusColorClass(u.severity)}>
                  {u.severity}
                </span>
              </div>
              <div className="dm-update-meta">
                <span className="dm-badge dm-badge-type">{u.type}</span>
                <span className="dm-badge dm-badge-domain">{u.domain}</span>
              </div>
              <p className="dm-update-reason">{u.reason}</p>
              <p className="dm-update-footer">
                Submitted by{" "}
                <span className="dm-strong">{u.submittedBy}</span> on{" "}
                {u.submittedOn}
              </p>
              <p className="dm-update-statusline">
                Status: <span className="dm-strong">{u.status}</span>
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT : DETAILS & ACTIONS */}
      <div className="dm-update-right">
        {selectedUpdate && (
          <>
            <header className="dm-update-header">
              <div>
                <p className="dm-update-breadcrumb">
                  Data Manager · Update Workflow
                </p>
                <h2 className="dm-update-title">
                  {selectedUpdate.dataset}
                </h2>
                <p className="dm-update-subtitle">
                  Version{" "}
                  <span className="dm-mono">
                    {selectedUpdate.currentVersion}
                  </span>{" "}
                  →{" "}
                  <span className="dm-mono">
                    {selectedUpdate.newVersion}
                  </span>{" "}
                  · {selectedUpdate.type} update
                </p>
              </div>
              <div className="dm-update-header-badges">
                <span className={statusColorClass(selectedUpdate.severity)}>
                  {selectedUpdate.severity} impact
                </span>
                <span className="status-pill">
                  {selectedUpdate.status}
                </span>
              </div>
            </header>

            <div className="dm-update-grid">
              {/* SUMMARY */}
              <section className="dm-card">
                <h3>Update summary</h3>
                <ul className="dm-bullet-list">
                  <li>
                    <span className="dm-label">Domain:</span>{" "}
                    {selectedUpdate.domain}
                  </li>
                  <li>
                    <span className="dm-label">Reason:</span>{" "}
                    {selectedUpdate.reason}
                  </li>
                  <li>
                    <span className="dm-label">Submitted by:</span>{" "}
                    {selectedUpdate.submittedBy} on{" "}
                    {selectedUpdate.submittedOn}
                  </li>
                </ul>
              </section>

              {/* IMPACT */}
              <section className="dm-card">
                <h3>Impact analysis</h3>
                <ul className="dm-bullet-list">
                  <li>
                    <span className="dm-label">Records affected:</span>{" "}
                    {selectedUpdate.impactSummary.recordsAffected}
                  </li>
                  <li>
                    <span className="dm-label">Products:</span>{" "}
                    {selectedUpdate.impactSummary.productsAffected}
                  </li>
                  <li>
                    <span className="dm-label">Needs re-processing:</span>{" "}
                    {selectedUpdate.impactSummary.needsReprocess ? (
                      <span className="dm-tag dm-tag-critical">Yes</span>
                    ) : (
                      <span className="dm-tag">Optional</span>
                    )}
                  </li>
                </ul>
                <p className="dm-note">
                  {selectedUpdate.impactSummary.notes}
                </p>
              </section>
            </div>

            {/* FIELD CHANGES TABLE */}
            <section className="dm-card dm-changes-card">
              <h3>Field-level changes</h3>
              <div className="dm-changes-table">
                <div className="dm-changes-header">
                  <span>Field</span>
                  <span>From</span>
                  <span>To</span>
                  <span>Impact</span>
                </div>
                {selectedUpdate.changes.map((c, idx) => (
                  <div className="dm-changes-row" key={idx}>
                    <span>{c.field}</span>
                    <span>{c.from}</span>
                    <span>{c.to}</span>
                    <span>{c.impact}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* VALIDATION + REVIEW */}
            <div className="dm-update-grid">
              <section className="dm-card">
                <h3>Validation checks</h3>
                <div className="dm-checks-grid">
                  <div className={checkStatusClass(selectedUpdate.validation.schema)}>
                    <span className="dot" /> Schema & structure
                  </div>
                  <div className={checkStatusClass(selectedUpdate.validation.units)}>
                    <span className="dot" /> Units & ranges
                  </div>
                  <div className={checkStatusClass(selectedUpdate.validation.outliers)}>
                    <span className="dot" /> Outlier screening
                  </div>
                  <div className={checkStatusClass(selectedUpdate.validation.reference)}>
                    <span className="dot" /> Reference DB / taxonomy
                  </div>
                </div>
                <p className="dm-note">
                  In the full system these checks will run automatically
                  on every submitted update.
                </p>
              </section>

              <section className="dm-card">
                <h3>Reviewer actions</h3>
                <label className="dm-label-block">
                  Reviewer comment
                  <textarea
                    className="dm-textarea"
                    placeholder="Add a short note for the submitter or for the audit log..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </label>
                <div className="dm-actions-row">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleApprove}
                  >
                    Approve &amp; Apply
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleClarification}
                  >
                    Request Clarification
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={handleReject}
                  >
                    Reject Update
                  </button>
                </div>
                <p className="dm-note">
                  These actions will eventually trigger backend workflows,
                  versioning and re-processing in the production platform.
                </p>
              </section>
            </div>

            {/* AUDIT TRAIL */}
            <section className="dm-card dm-audit-card">
              <h3>Audit trail</h3>
              <ul className="dm-audit-list">
                {selectedUpdate.auditTrail.map((e, idx) => (
                  <li key={idx} className="dm-audit-item">
                    <div className="dm-audit-dot" />
                    <div>
                      <p className="dm-audit-main">
                        <span className="dm-audit-actor">{e.actor}</span>{" "}
                        {e.action}
                      </p>
                      <p className="dm-audit-ts">{e.ts}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default DataUpdateModule;
