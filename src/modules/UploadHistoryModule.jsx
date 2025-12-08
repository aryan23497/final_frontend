import React, { useState } from "react";
import "./UploadHistoryModule.css";

const SAMPLE_UPLOADS = [
  {
    id: "UPL-001",
    title: "CTD Profiles – Southwest Monsoon",
    domain: "Oceanography",
    files: 12,
    size: "320 MB",
    date: "2024-07-10",
    status: "Approved",
  },
  {
    id: "UPL-002",
    title: "Fish Catch Survey – Arabian Sea",
    domain: "Fisheries",
    files: 5,
    size: "85 MB",
    date: "2024-07-14",
    status: "Pending",
  },
  {
    id: "UPL-003",
    title: "Otolith Images – Sardinella",
    domain: "Otolith Morphology",
    files: 48,
    size: "1.2 GB",
    date: "2024-07-18",
    status: "In Review",
  },
  {
    id: "UPL-004",
    title: "eDNA Coastal Samples – Kerala",
    domain: "eDNA",
    files: 9,
    size: "540 MB",
    date: "2024-07-22",
    status: "Rejected",
  },
];

const UploadHistoryModule = () => {
  const [search, setSearch] = useState("");

  const filteredUploads = SAMPLE_UPLOADS.filter(
    (u) =>
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="uh-layout">
      {/* HEADER */}
      <div className="uh-header">
        <div>
          <h3 className="uh-title">Upload History</h3>
          <p className="uh-subtitle">
            List of all datasets uploaded by you.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by title, ID or domain..."
          className="uh-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* BIG LIST CONTAINER */}
      <div className="uh-list-container">
        {/* LIST HEADER */}
        <div className="uh-list-header">
          <span>ID</span>
          <span>Title</span>
          <span>Domain</span>
          <span>Files</span>
          <span>Size</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {/* SCROLLABLE LIST */}
        <div className="uh-list-scroll">
          {filteredUploads.map((u) => (
            <div key={u.id} className="uh-row">
              <span>{u.id}</span>
              <span className="uh-title-col">{u.title}</span>
              <span>{u.domain}</span>
              <span>{u.files}</span>
              <span>{u.size}</span>
              <span>{u.date}</span>
              <span
                className={`uh-status ${u.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {u.status}
              </span>
            </div>
          ))}

          {filteredUploads.length === 0 && (
            <div className="uh-empty">No uploads found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadHistoryModule;
