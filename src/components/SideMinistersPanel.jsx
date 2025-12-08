// src/components/SideMinistersPanel.jsx
import React from "react";
import { Link } from "react-router-dom";
import ministers from "../data/ministers";

/**
 * SideMinistersPanel - shows small thumbnail + single primary role (not full long title)
 * - Derives a "shortRole" from the title by splitting on ';' first, then ','.
 * - Falls back to full title if necessary.
 * - Truncates very long shortRole to a readable max length.
 */

function getShortRole(fullTitle, maxLen = 80) {
  if (!fullTitle) return "";
  // Prefer splitting at semicolon (;) which often separates multiple roles
  let candidate = fullTitle.split(";")[0].trim();

  // If no semicolon parts (single string), try comma as fallback
  if (!candidate || candidate.length === 0) {
    candidate = fullTitle.split(",")[0].trim();
  }

  // final fallback
  if (!candidate || candidate.length === 0) candidate = fullTitle.trim();

  // truncate gracefully if too long
  if (candidate.length > maxLen) {
    return candidate.slice(0, maxLen - 3).trim() + "...";
  }
  return candidate;
}

export default function SideMinistersPanel() {
  return (
    <aside className="side-table-panel" aria-label="Ministers and leadership">
      <h3 className="side-table-title">Leadership</h3>
      <p className="side-table-sub">Key ministry contacts</p>

      <div className="side-table-scroll">
        <table className="side-table" role="table" aria-label="Ministers table">
          <thead>
            <tr>
              <th style={{ width: 72 }}>Photo</th>
              <th>Name</th>
              <th>Role</th>
              <th style={{ width: 80 }}></th>
            </tr>
          </thead>

          <tbody>
            {ministers.map((m) => {
              const shortRole = getShortRole(m.title || m.role || "", 90);
              return (
                <tr key={m.id} className="side-row" style={{ height: "100px" }}>
                  <td style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <img
                      className="minister-thumb"
                      src={m.photo}
                      alt={`Portrait of ${m.name}`}
                      width={56}
                      height={56}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/ministers/placeholder.jpg";
                      }}
                      style={{ objectFit: "cover", objectPosition: "center", display: "block", borderRadius: 8 }}
                    />
                  </td>

                  <td style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <div className="side-name">{m.name}</div>
                  </td>

                  <td style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <div className="side-role" title={m.title}>
                      {shortRole}
                    </div>
                  </td>

                  <td style={{ textAlign: "right", paddingTop: "20px", paddingBottom: "20px" }}>
                    <Link to={`/ministers/${m.id}`} className="btn btn-outline" style={{ padding: "6px 10px" }}>
                      Visit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
