import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MinisterPage from "./pages/MinisterPage";
import SettingsPage from "./pages/SettingsPage";
import DocsPage from "./pages/DocsPage";

// Small, safe addition: expose a backend base URL to modules via a window global.
// This does not alter routing or components — it only supplies a value modules can read.
// You can set REACT_APP_API_BASE in .env to override, otherwise default to 127.0.0.1:8000
// (No production-sensitive secrets should be placed here.)
const API_BASE_FROM_ENV = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000"; // <-- ADD
if (!window.__API_BASE__) window.__API_BASE__ = API_BASE_FROM_ENV; // <-- ADD

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />  {/* required */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/ministers/:id" element={<MinisterPage />} />
           <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
