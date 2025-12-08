// src/modules/LiteratureLibraryModule.js
import React, { useMemo, useState } from "react";
import "./LiteratureLibraryModule.css";

const PAPERS = [
  {
    id: 1,
    title: "Monsoon-driven variability in SST and chlorophyll in the Arabian Sea",
    year: 2023,
    domain: "Oceanography",
    authors: "Kumar et al.",
    tags: ["SST", "Chl-a", "Monsoon"],
    driveUrl: "https://drive.google.com/file/d/EXAMPLE1/view",
    size: "2.3 MB",
  },
  {
    id: 2,
    title: "Pelagic fish habitat hotspots in the eastern Arabian Sea",
    year: 2022,
    domain: "Fisheries",
    authors: "Nair & Thomas",
    tags: ["Fisheries", "Habitat", "CPUE"],
    driveUrl: "https://drive.google.com/file/d/EXAMPLE2/view",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "eDNA-based biodiversity assessment along the Kerala shelf",
    year: 2024,
    domain: "Molecular / eDNA",
    authors: "Sharma et al.",
    tags: ["eDNA", "Metabarcoding"],
    driveUrl: "https://drive.google.com/file/d/EXAMPLE3/view",
    size: "3.1 MB",
  },
  {
    id: 4,
    title: "Reference fish barcode library for the Indian EEZ",
    year: 2021,
    domain: "Taxonomy & Systematics",
    authors: "CMLRE Team",
    tags: ["DNA Barcoding", "Reference"],
    driveUrl: "https://drive.google.com/file/d/EXAMPLE4/view",
    size: "4.7 MB",
  },
];

const DOMAINS = [
  "All Domains",
  "Oceanography",
  "Fisheries",
  "Molecular / eDNA",
  "Taxonomy & Systematics",
];

const LiteratureLibraryModule = () => {
  const [searchInput, setSearchInput] = useState("");
  const [domain, setDomain] = useState("all");
  const [searchTerm, setSearchTerm] = useState(null); // null = no results yet

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);

  const filteredPapers = useMemo(() => {
    if (!searchTerm) return [];

    const q = searchTerm.toLowerCase();
    return PAPERS.filter((p) => {
      const domainOk = domain === "all" || p.domain === domain;
      const text = `${p.title} ${p.authors} ${p.domain} ${p.tags.join(" ")}`.toLowerCase();
      return domainOk && text.includes(q);
    });
  }, [searchTerm, domain]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return alert("Enter a keyword to search");

    setSearchTerm(searchInput.trim());

    const match = PAPERS.find((p) =>
      p.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (match?.driveUrl) {
      window.open(match.driveUrl, "_blank");
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) return alert("Fill all upload fields");

    alert(
      `PDF "${uploadTitle}" uploaded to Google Drive (mock). It will appear after backend sync.`
    );

    setUploadTitle("");
    setUploadFile(null);
    e.target.reset();
  };

  return (
    <div className="lit-layout">

      {/* HEADER */}
      <header className="lit-header">
        OASIS Drive / <span>Papers</span>
      </header>

      {/* SEARCH + UPLOAD BIG CARDS */}
      <div className="lit-top-grid">

        {/* BIG SEARCH */}
        <section className="lit-big-card">
          <h3>Search Research Papers</h3>

          <form onSubmit={handleSearch} className="lit-big-form">
            <input
              type="text"
              className="lit-big-input"
              placeholder="Search by title, keyword, authors..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <select
              className="lit-big-input"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              {DOMAINS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <button type="submit" className="lit-big-btn">
              Search & Open PDF
            </button>
          </form>
        </section>

        {/* BIG UPLOAD */}
        <section className="lit-big-card">
          <h3>Upload New PDF to Drive</h3>

          <form onSubmit={handleUpload} className="lit-big-form">
            <input
              type="text"
              className="lit-big-input"
              placeholder="PDF title or description"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />

            <input
              type="file"
              className="lit-big-input"
              accept="application/pdf"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />

            <button type="submit" className="lit-big-btn">
              Upload PDF
            </button>
          </form>
        </section>
      </div>

      {/* MATCHING DATASETS BELOW */}
      <section className="lit-results-card">
        <h3>Matching Datasets</h3>

        {searchTerm === null && (
          <p className="lit-info-text">
            Enter a search query above to view related PDFs.
          </p>
        )}

        {searchTerm !== null && filteredPapers.length === 0 && (
          <p className="lit-info-text">No matching PDFs found.</p>
        )}

        <div className="lit-results-grid">
          {filteredPapers.map((p) => (
            <article key={p.id} className="lit-paper-card">
              <div>
                <h4>{p.title}</h4>
                <p>
                  {p.authors} · {p.year}
                </p>
                <span className="lit-pill">{p.domain}</span>

                <div className="lit-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="lit-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lit-actions">
                <span>{p.size}</span>
                <a
                  href={p.driveUrl}
                  className="lit-open-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Show PDF
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LiteratureLibraryModule;
