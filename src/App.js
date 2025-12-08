import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MinisterPage from "./pages/MinisterPage";
import SettingsPage from "./pages/SettingsPage";


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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
