import React, { useEffect, useRef, useState } from "react";
// if your component file is src/components/ScrollableIndiaCoastlineMap.jsx
import ScrollableIndiaCoastlineMap from "../components/ScrollableIndiaCoastlineMap";
import SideMinistersPanel from "../components/SideMinistersPanel";
import { Link } from "react-router-dom";

/**
 * HeroCarousel - small, self-contained carousel component.
 * Assumes images are available at /assets/<filename>
 */
function HeroCarousel({
  images = [
    "/assets/banner1.jpeg",
    "/assets/banner2.jpeg",
    "/assets/banner3.png"
  ],
  height = 300,
  interval = 4500
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  function startAutoplay() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
  }

  function goTo(i) {
    clearInterval(timerRef.current);
    setIndex(((i % images.length) + images.length) % images.length);
    startAutoplay();
  }

  // inline styles so you don't need CSS edits
  const containerStyle = {
    width: "100%",
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    marginTop: 20,
    marginBottom: 20,
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
    background: "#0b1116"
  };

  const trackStyle = {
    display: "flex",
    width: `${images.length * 100}%`,
    height: "100%",
    transform: `translateX(-${index * (100 / images.length)}%)`,
    transition: "transform 700ms cubic-bezier(.2,.9,.1,1)"
  };

  const slideStyle = {
    width: `${100 / images.length}%`,
    flexShrink: 0,
    height: "100%",
    position: "relative",
    overflow: "hidden"
  };

  const btnBase = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 6,
    border: "none",
    background: "rgba(0,0,0,0.45)",
    color: "#e8fff7",
    width: 36,
    height: 36,
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)"
  };

  const dotsWrap = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: 10,
    display: "flex",
    gap: 8,
    zIndex: 6
  };

  return (
    <div
      className="hero-carousel"
      style={containerStyle}
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={() => startAutoplay()}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goTo(index - 1);
        if (e.key === "ArrowRight") goTo(index + 1);
      }}
      aria-roledescription="carousel"
    >
      <div style={trackStyle}>
        {images.map((src, i) => (
          <div
            key={i}
            className="carousel-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${images.length}`}
            style={slideStyle}
          >
            <img
              src={src}
              alt={`Banner ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block"
              }}
              onError={(e) => {
                console.error(`Failed to load image: ${src}`);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>

      <button
        aria-label="Previous"
        style={{ ...btnBase, left: 12 }}
        onClick={() => goTo(index - 1)}
      >
        ‹
      </button>

      <button
        aria-label="Next"
        style={{ ...btnBase, right: 12 }}
        onClick={() => goTo(index + 1)}
      >
        ›
      </button>

      <div style={dotsWrap}>
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            aria-pressed={i === index}
            onClick={() => goTo(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              background: i === index ? "#1fe0c8" : "transparent",
              cursor: "pointer",
              padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}

const LandingPage = () => {
  return (
    <main className="landing">
      {/* Logo and Badge Section */}
      <div className="landing-header">
        <p className="hero-badge-left">Ministry of Earth Sciences · CMLRE · Kochi</p>
        <div className="landing-logo-container">
          <img 
            src="/assets/logo.png" 
            alt="CMLRE Logo" 
            className="landing-logo"
          />
        </div>
      </div>

      {/* Banner Image / Carousel Below Navbar */}
      {/* Put your images into public/assets/ as explained, or update paths */}
      <HeroCarousel
        images={[
          "/assets/banner1.jpeg",
          "/assets/banner2.jpeg",
          "/assets/banner3.png"
        ]}
        height={400}
        interval={5000}
      />

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Driven Unified Data Platform for{" "}
            <span className="accent">Oceanographic, Fisheries & Biodiversity Insights</span>
          </h1>

          <p className="hero-subtitle">
            A cloud-ready, intelligent digital backbone that unifies oceanographic, fisheries, taxonomic, otolith and molecular (eDNA) data into one platform for ecosystem modelling and sustainable fisheries management.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">Get Started (Login)</Link>
            <a href="#features" className="btn btn-outline">View Features</a>
          </div>

          <div className="hero-tags">
            <span className="tag">Oceanography</span>
            <span className="tag">Fisheries</span>
            <span className="tag">Molecular Biodiversity</span>
            <span className="tag">AI & Data Platform</span>
          </div>
        </div>

        <div className="hero-card">
          <h2>Why this platform?</h2>
          <p>
            CMLRE manages massive, siloed datasets: physical, chemical and biological oceanography, fish abundance and taxonomy, otolith morphology, and environmental DNA (eDNA). Integrating these streams is critical for:
          </p>

          <ul>
            <li>Real-time ecosystem health monitoring</li>
            <li>Predicting fish distribution & stock dynamics</li>
            <li>Evidence-based conservation & blue economy planning</li>
          </ul>
        </div>
      </section>

      {/* Rest of your page unchanged (kept from original landing page) */}
    {/* ===== MAP SECTION: two-column grid (map left / ministers table right) ===== */}
{/* ================= MAP + LEADERSHIP (SIDE BY SIDE) ================= */}
{/* ================= MAP + LEADERSHIP (FORCED SIDE BY SIDE) ================= */}
<section
  className="map-and-side"
  style={{
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "1fr 500px",
    gap: 10,
    alignItems: "start",
    width: "100%",
    boxSizing: "border-box"
  }}
>
  {/* LEFT COLUMN — MAP */}
  <div className="map-column" style={{ width: "100%" }}>
    <div
      className="map-container"
      style={{
        width: "100%",
        height: "420px",
        minHeight: "420px",
        borderRadius: 12,
        boxSizing: "border-box",
        padding: 12
      }}
    >
      <ScrollableIndiaCoastlineMap height="420px" widthPercent={100} />
    </div>
  </div>

  {/* RIGHT COLUMN — LEADERSHIP TABLE */}
  <div className="side-column" style={{ alignSelf: "start" }}>
    <SideMinistersPanel/>
  </div>
</section>

      <section id="features" className="section section-alt">
        <h2>Core Capabilities</h2>
        <p className="section-text">
          The AI-driven platform will act as a national marine data backbone for India, enabling cross-domain analytics and decision support.
        </p>

        <div className="card-grid">
          <div className="card">
            <h3>Unified Data Ingestion</h3>
            <p>Streamlines all marine datasets into one unified pipeline.</p>
            <p className="tagline highlight"><i> One ocean of data, one seamless flow. </i></p>
          </div>

          <div className="card">
            <h3>Metadata & Standards</h3>
            <p>Ensures globally compatible, metadata-rich scientific records.</p>
            <p className="tagline highlight"><i> Data that the world instantly understands.</i></p>
          </div>

          <div className="card">
            <h3>AI Analytics & Modelling</h3>
            <p>AI uncovers trends, patterns, and ecosystem signals.</p>
            <p className="tagline highlight"><i> Let AI predict what the ocean whispers.</i></p>
          </div>

          <div className="card">
            <h3>Interactive Visualisation</h3>
            <p>Beautiful dashboards for fast, intuitive exploration.</p>
            <p className="tagline highlight"><i> See the science come alive in a glance. </i></p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Specialised Scientific Modules</h2>

        <div className="card-grid">
          <div className="card card-outline">
            <h3>Taxonomy & Species ID</h3>
            <p>Quickly identify and explore marine species.</p>
            <p className="tagline highlight"><i>Tiny bones, big secrets — decode them instantly.</i></p>
          </div>

          <div className="card card-outline">
            <h3>Otolith Morphology</h3>
            <p>Analyze otolith images to infer stock structure.</p>
            <p className="tagline highlight"><i> Small bones, big insights. </i></p>
          </div>

          <div className="card card-outline">
            <h3>Molecular & eDNA Hub</h3>
            <p>Decode biodiversity using barcode and eDNA data.</p>
            <p className="tagline highlight"><i>Discover life you can’t see — through DNA.</i></p>
          </div>
        </div>
      </section>

      <section className="section section-cta">
        <div className="cta-inner">
          <h2>Build the next-generation marine data backbone for India</h2>
          <p>Empower scientists, conservationists, and policymakers with a unified platform for holistic marine ecosystem assessment.</p>
          <Link to="/login" className="btn btn-primary">Login to Prototype</Link>
        </div>
      </section>

      <section className="section section-publications">
        <div className="publications-cta">
          <h3>Explore Official Publications</h3>
          <p>Access research papers, reports, and scientific publications from the Ministry of Earth Sciences</p>
          <a 
            href="https://www.moes.gov.in/documents/publication" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View MoES Publications
          </a>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
