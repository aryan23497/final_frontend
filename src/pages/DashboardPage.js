// src/pages/DashboardPage.js
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DashboardPage.css";

import DataUploadSection from "../components/DataUploadSection";

// Scientist modules
import ScientistHomeModule from "../modules/ScientistHomeModule";
import VisualizationTool from "../modules/VisualizationTool";
import VisualizationParametersPanel from "../modules/VisualizationParametersPanel";
import AIRecommendationModule from "../modules/AIRecommendationModule";
import IngestionPipelineModule from "../modules/IngestionPipelineModule";
import MetadataTaggerModule from "../modules/MetadataTaggerModule";
import InfluenceEngineModule from "../modules/InfluenceEngineModule";
import LiteratureLibraryModule from "../modules/LiteratureLibraryModule";
import ImageAnalyzerModule from "../modules/ImageAnalyzerModule";
import CloudDataServerModule from "../modules/CloudDataServerModule";
import DataProcessorModule from "../modules/DataProcessorModule";
import DataAccessServerModule from "../modules/DataAccessServerModule";
import DataInsightsModule from "../modules/DataInsightsModule";


// Domain-expert detailed modules
import OceanographyModule from "../modules/OceanographyModule";
import MarineBiologyModule from "../modules/MarineBiologyModule";
import TaxonomySystematicsModule from "../modules/TaxonomySystematicsModule";
import MolecularBiologyModule from "../modules/MolecularBiologyModule";
import EDNAMetabarcodingModule from "../modules/EDNAMetabarcodingModule";

// Data Manager modules
import DataRequestModule from "../modules/DataRequestModule";
import DataUpdateModule from "../modules/DataUpdateModule";
import TimelineDebugModule from "../modules/TimelineDebugModule";

// Data collector
import UploadHistoryModule from "../modules/UploadHistoryModule";

/* ===== Scientist / Researcher Modules ===== */
const SCIENTIST_MODULES = [
   {
    id: "home",
    name: "Real-time Plot",
    desc: "Real-time oceanography overview and quick access to key tools.",
  },
  {
    id: "viz",
    name: "Visualization Tool",
    desc: "Interactive dashboards for oceanographic, fisheries & biodiversity analysis.",
  },
  {
    id: "ai-reco",
    name: "AI Recommendation System",
    desc: "Recommends datasets, views and analytical paths using AI.",
  },
  {
    id: "ingest",
    name: "Ingestion Pipeline",
    desc: "Pipelines to ingest, validate and standardize datasets from multiple sources.",
  },
  {
    id: "meta",
    name: "Metadata Tagger",
    desc: "Automatically tags datasets using marine & taxonomic standards.",
  },
  {
    id: "engine",
    name: "Influence Engine",
    desc: "Maps environmental parameters to ecosystem and fisheries outcomes.",
  },
  {
    id: "library",
    name: "Literature Library",
    desc: "Digital repository of scientific literature linked to datasets.",
  },
  {
    id: "image",
    name: "Image Analyzer",
    desc: "Image and otolith analysis for morphology and species identification.",
  },
  {
    id: "cloud",
    name: "Cloud Data Server",
    desc: "Cloud storage & compute for the marine data platform.",
  },
  {
    id: "processor",
    name: "Data Processor",
    desc: "ETL & processing jobs for cleaning and aggregating data.",
  },
  {
    id: "das",
    name: "Data Access Server (DAS)",
    desc: "Secure API layer to access datasets and models.",
  },
  {
    id: "insights",
    name: "Data Insights",
    desc: "AI-driven summaries, anomalies & key indicators",
  },
];

/* ===== Data Manager (DM) Modules ===== */
const DM_MODULES = [
  {
    id: "upload",
    name: "Data Upload",
    desc: "Upload and register new datasets into the system.",
  },
  {
    id: "request",
    name: "Data Request",
    desc: "Manage internal and external data access requests.",
  },
  {
    id: "update",
    name: "Data Update",
    desc: "Track and apply updates or corrections to existing datasets.",
  },
  {
    id: "timeline",
    name: "Timeline / Debug",
    desc: "Monitor ingestion timelines, errors and debug logs.",
  },
];

/* ===== Admin Modules ===== */
const ADMIN_MODULES = [
  {
    id: "show-db",
    name: "Show Databases",
    desc: "Overview of all configured databases / data stores connected to the platform.",
  },
  {
    id: "admin-debug",
    name: "Error & Debug",
    desc: "Centralised error console for pipelines, services and system-level failures.",
  },
  {
    id: "change-requests",
    name: "Change Requests",
    desc: "Review and approve requests to change influence rules, configurations or system settings.",
  },
  {
    id: "user-analysis",
    name: "System Users Analysis",
    desc: "Analytics on users, roles, activity patterns and access logs.",
  },
];

/* ===== Domain Expert Modules (5 main modules) ===== */
const DOMAIN_EXPERT_MODULES = [
  {
    id: "oce",
    name: "Oceanography",
    desc: "Physical, chemical and biological ocean processes linked to habitats and species.",
    subtopics: [
      { id: "phys", label: "Physical Oceanography", icon: "🌊" },
      { id: "chem", label: "Chemical Oceanography", icon: "⚗️" },
      { id: "bio", label: "Biological Oceanography", icon: "🧫" },
      { id: "hab", label: "Habitat Mapping", icon: "🗺️" },
      { id: "sat", label: "Satellite Data", icon: "🛰️" },
      { id: "spatial", label: "Spatial Analysis", icon: "📍" },
      { id: "sdm", label: "Species Distribution Modelling (SDM)", icon: "📈" },
      { id: "colour", label: "Ocean Colour & SST Analysis", icon: "🌈" },
    ],
  },
  {
    id: "mb",
    name: "Marine Biology",
    desc: "Species, communities and ecosystem interactions in the marine environment.",
    subtopics: [
      { id: "org", label: "Marine Organisms", icon: "🐟" },
      { id: "eco", label: "Marine Ecology", icon: "🌿" },
    ],
  },
  {
    id: "tax",
    name: "Taxonomy & Systematics",
    desc: "Classification, naming and identification of marine species.",
    subtopics: [
      { id: "classical", label: "Classical Taxonomy", icon: "📚" },
      { id: "fish-tax", label: "Fish Taxonomy", icon: "🐠" },
      { id: "id-keys", label: "Species Identification & Keys", icon: "🔑" },
      { id: "rules", label: "Nomenclature & Classification Rules", icon: "📜" },
    ],
  },
  {
    id: "mol",
    name: "Molecular Biology / DNA Barcoding",
    desc: "Sequence-based identification and molecular analysis for marine biodiversity.",
    subtopics: [
      { id: "barcoding", label: "DNA Barcoding", icon: "🧬" },
      { id: "pcr", label: "PCR & Sequencing", icon: "🧪" },
      { id: "markers", label: "Molecular Markers", icon: "🧾" },
    ],
  },
  {
    id: "edna",
    name: "eDNA & Metabarcoding",
    desc: "Environmental DNA workflows for hidden and cryptic biodiversity.",
    subtopics: [
      { id: "sampling", label: "eDNA Sampling", icon: "💧" },
      { id: "meta", label: "Metabarcoding", icon: "🧫" },
      { id: "seq-ana", label: "Sequence Analysis", icon: "🧮" },
    ],
  },
];

/* ===== Data Collector Modules ===== */
const DATA_COLLECTOR_MODULES = [
  {
    id: "dc-upload",
    name: "Data Upload",
    desc: "Upload raw datasets (with approval and final integration by Data Manager).",
  },
  {
    id: "dc-history",
    name: "Upload History",
    desc: "View history and status of your previous uploads and their approvals.",
  },
];

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const role = useMemo(
    () =>
      (location.state && location.state.role) ||
      localStorage.getItem("user_role") ||
      "Scientist / Researcher",
    [location.state]
  );

  const isDataManager = role === "Data Manager (DM)";
  const isAdmin = role === "Admin";
  const isDomainExpert = role === "Domain Expert";
  const isDataCollector = role === "Data Collector";

  const menuItems = useMemo(() => {
    if (isAdmin) return ADMIN_MODULES;
    if (isDataManager) return DM_MODULES;
    if (isDataCollector) return DATA_COLLECTOR_MODULES;
    if (isDomainExpert) return DOMAIN_EXPERT_MODULES;
    return SCIENTIST_MODULES;
  }, [isAdmin, isDataManager, isDataCollector, isDomainExpert]);

  const [selectedModuleId, setSelectedModuleId] = useState(
    menuItems[0]?.id || ""
  );
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  useEffect(() => {
    setSelectedModuleId(menuItems[0]?.id || "");
    setSelectedTopicId(null);
  }, [menuItems]);

  const selectedModule =
    menuItems.find((m) => m.id === selectedModuleId) || menuItems[0];

  const handleLogout = () => {
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    navigate("/");
  };

  const isUploadModule =
    (isDataManager && selectedModule?.id === "upload") ||
    (isDataCollector && selectedModule?.id === "dc-upload");

  /* ===== Decide what to render in MAIN AREA ===== */
  const renderModuleContent = () => {
    // 1) DM / Data Collector → Upload workspace
    if (isUploadModule) {
      return <DataUploadSection />;
    }

    // 2) Scientist / Researcher → specialised pages
    const isScientist =
      !isDataManager && !isAdmin && !isDomainExpert && !isDataCollector;

    if (isScientist) {
      switch (selectedModule?.id) {
        
        case "home":
      return <ScientistHomeModule />;
        case "viz":
          return <VisualizationTool />;
        case "ai-reco":
          return <AIRecommendationModule />;
        case "ingest":
          return <IngestionPipelineModule />;
        case "meta":
          return <MetadataTaggerModule />;
        case "engine":
          return <InfluenceEngineModule />;
        case "library":
          return <LiteratureLibraryModule />;
        case "image":
          return <ImageAnalyzerModule />;
        case "cloud":
          return <CloudDataServerModule />;
        case "processor":
          return <DataProcessorModule />;
        case "das":
          return <DataAccessServerModule />;
        case "insights":
          return <DataInsightsModule />;
        default:
          break;
      }
    }

    // 3) Domain Expert → specialised pages
    if (isDomainExpert) {
      switch (selectedModule?.id) {
        case "oce":
          return <OceanographyModule />;
        case "mb":
          return <MarineBiologyModule />;
        case "tax":
          return <TaxonomySystematicsModule />;
        case "mol":
          return <MolecularBiologyModule />;
        case "edna":
          return <EDNAMetabarcodingModule />;
        default:
          break;
      }
    }

    // 4) Data Manager → dedicated pages (non-upload)
    // in DashboardPage renderModuleContent()
if (isDataManager) {
  switch (selectedModule?.id) {
    case "request":
      return <DataRequestModule />;
    case "update":
      return <DataUpdateModule />;
    case "timeline":
      return <TimelineDebugModule />;   // ✅ this one
    default:
      break;
  }
}

    // 5) Data Collector → Upload History dedicated page
    if (isDataCollector && selectedModule?.id === "dc-history") {
      return <UploadHistoryModule />;
    }

    // 6) Default: existing cards layout (Admin, Domain Expert modules without custom page, etc.)
    return (
      <div className="module-cards">
        {/* Overview card */}
        <div className="module-card">
          <h3>Overview</h3>
          <p>
            High-level summary and purpose of{" "}
            <strong>{selectedModule?.name}</strong>.
          </p>
        </div>

        {/* Middle card */}
        <div className="module-card">
          <h3>{isDomainExpert ? "Topics" : "Quick Actions"}</h3>

          {isDomainExpert && selectedModule?.subtopics ? (
            <div className="domain-pill-column">
              {selectedModule.subtopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={
                    "domain-pill" +
                    (selectedTopicId === topic.id
                      ? " domain-pill-active"
                      : "")
                  }
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <span className="domain-icon">{topic.icon}</span>
                  <span className="domain-label">{topic.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <ul>
              {/* Admin actions */}
              {isAdmin && selectedModule?.id === "show-db" && (
                <>
                  <li>List all databases</li>
                  <li>Check connection health</li>
                  <li>View storage usage</li>
                </>
              )}
              {isAdmin && selectedModule?.id === "admin-debug" && (
                <>
                  <li>Open error console</li>
                  <li>Filter by service/module</li>
                  <li>Download error report</li>
                </>
              )}
              {isAdmin && selectedModule?.id === "change-requests" && (
                <>
                  <li>View open change requests</li>
                  <li>Review influence rule changes</li>
                  <li>Approve / reject & log decision</li>
                </>
              )}
              {isAdmin && selectedModule?.id === "user-analysis" && (
                <>
                  <li>View active users by role</li>
                  <li>Check recent activity</li>
                  <li>Export usage analytics</li>
                </>
              )}

              {/* Data Collector actions (non-upload) */}
              {isDataCollector && selectedModule?.id === "dc-history" && (
                <>
                  <li>View previous uploads</li>
                  <li>Check approval status</li>
                  <li>Download upload receipts</li>
                </>
              )}

              {/* Default Scientist / other actions when no special page */}
              {!isDataManager &&
                !isAdmin &&
                !isDataCollector &&
                !isDomainExpert && (
                  <>
                    <li>Open module console</li>
                    <li>View sample outputs</li>
                    <li>Explore linked datasets</li>
                  </>
                )}
            </ul>
          )}
        </div>

        {/* Status card */}
        <div className="module-card">
          <h3>Status</h3>
          {isDomainExpert && selectedTopicId ? (
            <p>
              Selected topic:{" "}
              <strong>
                {
                  selectedModule.subtopics.find(
                    (t) => t.id === selectedTopicId
                  )?.label
                }
              </strong>
              . You can attach analysis dashboards or rule editors here.
            </p>
          ) : (
            <p>Active • Last activity: a few minutes ago.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="dashboard">
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-title">OASIS · CMLRE</div>

          <div className="sidebar-user-box">
            <p className="sidebar-user-label">Logged in as</p>
            <p className="sidebar-user-role">{role}</p>
          </div>

          <p className="sidebar-heading">Modules</p>
          {menuItems.map((mod) => (
            <button
              key={mod.id}
              className={`sidebar-item ${
                mod.id === selectedModuleId ? "sidebar-item-active" : ""
              }`}
              onClick={() => {
                setSelectedModuleId(mod.id);
                setSelectedTopicId(null);
              }}
            >
              {mod.name}
            </button>
          ))}

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="dashboard-main">
          <section className="dashboard-section">
            <h2>{selectedModule?.name}</h2>
            <p className="dashboard-section-text">
              {selectedModule?.desc || ""}
            </p>

            {renderModuleContent()}
          </section>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
