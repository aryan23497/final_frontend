// src/modules/LiteratureLibraryModule.js
import React, { useMemo, useState } from "react";
import "./LiteratureLibraryModule.css";

const PAPERS = [
  {
    id: 1,
    title: "A comprehensive and comparative evaluation of primers for metabarcoding eDNA from fish",
    year: 2024,
    domain: "eDNA",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1IlV1zP50whnOwfsuxtcUnYrDvfUZaFa_/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 2,
    title: "A detailed workflow to develop QIIME2‐formatted reference databases for taxonomic analysis of DNA metabarcoding data",
    year: 2024,
    domain: "eDNA",
    authors: "Benjamin Dubois1*, Frédéric Debode1 , Louis Hautier2 , Julie Hulin3, Gilles San Martin2 , Alain Delvaux4 , Eric Janssen3 and Dominique Mingeot1",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1285AWOdpE0HTUEML1v0WXRVQAdjpEzdc/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 3,
    title: "A Roadmap to Advance Marine and Coastal Monitoring, Biodiversity Assessment, and International Reporting: A Developing Nation Perspective",
    year: 2024,
    domain: "Biodiversity",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1_iTmeTGp8hqHJVhTFL48ppsg3iQz5zXQ/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 4,
    title: "Benchmarking DNA Metabarcoding for Biodiversity-Based Monitoring and Assessment",
    year: 2024,
    domain: "Biodiversity",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1XBewvKSfhqnMjNDlWwO9aX1QcOiJISyv/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 5,
    title: "Deep Learning for the Deep Blue: A Systematic Review of AI in Marine and Freshwater Biodiversity Monitoring",
    year: 2024,
    domain: "Biodiversity",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1BGt6Hl-svfGpHwSAyFYnffkL5-grVxO-/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 6,
    title: "Deep Learning for the Deep Blue: A Systematic Review of AI in Marine and Freshwater Biodiversity Monitoring",
    year: 2024,
    domain: "eDNA, marine conservation, fisheries management, fish ecology, Sustainable Development Goals, biodiversity",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1AOqxV_7UAn2YH8Tnd1myoIcDEH8mzj2s/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 7,
    title: "Environmental DNA-Based Methods in Biodiversity Monitoring of Protected Areas: Application Range, Limitations, and Needs",
    year: 2024,
    domain: "eDNA",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1el3po9pm9Js0BHOWwA2dGusk3zZ8TTzV/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 8,
    title: "Evaluating bioinformatics pipelines for population-level inference using environmental DNA",
    year: 2024,
    domain: "Fisheries",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1u2IHu_BWBVerp8FvvhyobVsJxhOMsd92/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 9,
    title: "Fine-tuning biodiversity assessments: A framework to pair eDNA metabarcoding and morphological approaches",
    year: 2024,
    domain: "Molecular / eDNA",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1jRU7C8tuqzJ_d9SneigEOMEsrBP8Amsc/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 10,
    title: "Global Coordination and Standardisation in Marine Biodiversity through the World Register of Marine Species (WoRMS) and Related Databases",
    year: 2024,
    domain: "Molecular / eDNA",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/10M9p7r6ueYG4pPennhwf_4R4t47ZnTNd/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 11,
    title: "Global Observational Needs and Resources for Marine Biodiversity",
    year: 2024,
    domain: "Molecular / eDNA",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1jitSY6igmvX4nZR0GIyXNrA95uAXNYqw/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 12,
    title: "IndOBIS, an Ocean Biogeographic Information System for assessment and conservation of Indian Ocean biodiversity",
    year: 2024,
    domain: "Molecular / eDNA",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1arHIwkDuIEbF7zb9A5L1TIIm6uEQtnR5/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 13,
    title: "INTEGRATING BIODIVERSITY AND ENVIRONMENTAL OBSERVATIONS IN SUPPORT OF NATIONAL MARINE SANCTUARY AND LARGE MARINE ECOSYSTEM ASSESSMENTS",
    year: 2024,
    domain: "Taxonomy & Systematics",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1jh4WtbpDNjp-cAywbugY96R6RYfPXGlv/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 14,
    title: "Introducing the World Register of Introduced Marine Species (WRiMS)",
    year: 2024,
    domain: "Taxonomy & Systematics",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1q_6P3BlUjbzGZyLOMiMbuHrmhwzgdxQ9/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 15,
    title: "Mitohelper: A mitochondrial reference sequence analysis tool for fish eDNA studies",
    year: 2024,
    domain: "Taxonomy & Systematics",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1h0yi4O_5ykdnOMOrZaUp7QRQXIck7P2f/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 16,
    title: "ROLE OF TAXONOMY IN ASSESSMENT OF AQUATIC BIODIVERSITY AND MANAGEMENT OF FISHERIES RESOURCES",
    year: 2024,
    domain: "Taxonomy & Systematics",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1CtPDtXZQm750mzk-4k3N6tmB4T2GgOuP/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 17,
    title: "State of Knowledge of Coastal and Marine Biodiversity of Indian Ocean Countries",
    year: 2024,
    domain: "Oceanography",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1ZdyQZeFzJrdu8S6yA-KDdbR3-gIulY2O/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 18,
    title: "Taxonomic accuracy and complementarity between bulk and eDNA metabarcoding provides an alternative to morphology for biological assessment of freshwater macroinvertebrates",
    year: 2024,
    domain: "Taxonomy & Systematics",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1T0_IiqO6V3UGlx_zcLGOGTwvgCfXxpeR/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 19,
    title: "Taxonomic resolution based on DNA barcoding affects environmental signal in metacommunity structure",
    year: 2024,
    domain: "Fisheries",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/1upn4D3ZFyuMhcEuYLl3vITAdtElSeg2X/view?usp=drive_link",
    size: "N/A",
  },
  {
    id: 20,
    title: "The marine biodiversity of the western Indian Ocean and its biogeography: How much do we know?",
    year: 2024,
    domain: "Biodiversity",
    authors: "Author et al.",
    tags: ["Research", "Marine"],
    driveUrl: "https://drive.google.com/file/d/13ihTZQko8AxnESGKYhxHEDQlZF0hCq6e/view?usp=drive_link",
    size: "N/A",
  },
];

const DOMAINS = [
  "All Domains",
  "Oceanography",
  "Fisheries",
  "Molecular / eDNA",
  "Taxonomy & Systematics",
  "Biodiversity"
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
              Search Papers
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
