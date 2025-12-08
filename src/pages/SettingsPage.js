// src/pages/SettingsPage.js
import React, { useState, useEffect } from "react";
import "./SettingsPage.css";

const SECTIONS = [
  { id: "account", label: "Account & Security" },
  { id: "profile", label: "Profile" },
  { id: "appearance", label: "Appearance" },
  { id: "notifications", label: "Notifications" },
  { id: "research", label: "Research Preferences" },
  { id: "system", label: "System" },
  { id: "privacy", label: "Privacy & Compliance" },
];

// 🔹 helper to apply theme on <html data-theme="...">
const applyTheme = (mode) => {
  const root = document.documentElement;

  let finalMode = mode;
  if (mode === "system") {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    finalMode = prefersDark ? "dark" : "light";
  }

  root.setAttribute("data-theme", finalMode);
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("account");

  const [form, setForm] = useState({
    displayName: "",
    designation: "",
    institute: "",
    phone: "",
    bio: "",
    theme: "dark",
    fontSize: "medium",
    density: "comfortable",
    reduceMotion: false,
    emailDatasetUpdates: true,
    emailApprovals: true,
    emailAlerts: true,
    weeklySummary: false,
    defaultWorkspace: "last-opened",
    aiLevel: "medium",
    dataFormat: "csv",
    exportQuality: "standard",
    language: "en",
    timezone: "IST",
    dateFormat: "dd-mm-yyyy",
    units: "metric",
    watermarkDownloads: true,
  });

  // 🔹 On mount → load stored theme (and optionally stored settings)
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("oasis_user_settings");
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.error("Failed to parse stored settings", err);
    }

    const storedTheme = localStorage.getItem("oasis_theme");
    if (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system") {
      applyTheme(storedTheme);
      setForm((prev) => ({ ...prev, theme: storedTheme }));
    } else {
      applyTheme("dark");
    }
  }, []);

  // 🔹 Whenever theme field changes → apply + persist theme
  useEffect(() => {
    if (!form.theme) return;
    applyTheme(form.theme);
    localStorage.setItem("oasis_theme", form.theme);
  }, [form.theme]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save all settings locally (can be wired to backend later)
    localStorage.setItem("oasis_user_settings", JSON.stringify(form));
    console.log("Settings saved:", form);
    alert("Settings saved. Theme and preferences will be remembered.");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="sp-section">
            <h2>Account & Security</h2>
            <p className="sp-section-sub">
              Manage your login, password and security preferences.
            </p>

            <div className="sp-card">
              <h3>Login & password</h3>
              <div className="sp-row sp-row-inline">
                <div>
                  <p className="sp-label">Email</p>
                  <p className="sp-muted">
                    This is your primary sign-in email. Change via account
                    administration.
                  </p>
                </div>
                <button className="sp-btn-ghost" type="button">
                  Change email
                </button>
              </div>

              <div className="sp-row">
                <label className="sp-label">Change password</label>
                <div className="sp-2col">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="sp-input"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="sp-input"
                  />
                </div>
                <button className="sp-btn-outline" type="button">
                  Update password
                </button>
              </div>
            </div>

            <div className="sp-card">
              <h3>Security</h3>
              <div className="sp-row sp-toggle-row">
                <div>
                  <p className="sp-label">Two-factor authentication</p>
                  <p className="sp-muted">
                    Add an extra step when signing in to secure your account.
                  </p>
                </div>
                <label className="sp-switch">
                  <input type="checkbox" />
                  <span className="sp-slider" />
                </label>
              </div>

              <div className="sp-row">
                <p className="sp-label">Active sessions</p>
                <p className="sp-muted">
                  You are currently signed in on this device. Use the dashboard
                  security console to sign out from other sessions.
                </p>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="sp-section">
            <h2>Profile</h2>
            <p className="sp-section-sub">
              How you appear to other users in OASIS.
            </p>

            <div className="sp-card">
              <h3>Basic information</h3>
              <div className="sp-row sp-avatar-row">
                <div className="sp-avatar-circle">B</div>
                <div>
                  <p className="sp-label">Avatar</p>
                  <p className="sp-muted">
                    Upload a profile image so collaborators can recognise you.
                  </p>
                  <button className="sp-btn-ghost" type="button">
                    Upload photo
                  </button>
                </div>
              </div>

              <div className="sp-2col">
                <div className="sp-field">
                  <label className="sp-label">Display name</label>
                  <input
                    className="sp-input"
                    value={form.displayName}
                    onChange={(e) =>
                      handleChange("displayName", e.target.value)
                    }
                    placeholder="Your name as shown to others"
                  />
                </div>
                <div className="sp-field">
                  <label className="sp-label">Designation</label>
                  <input
                    className="sp-input"
                    value={form.designation}
                    onChange={(e) =>
                      handleChange("designation", e.target.value)
                    }
                    placeholder="Scientist / Researcher"
                  />
                </div>
              </div>

              <div className="sp-2col">
                <div className="sp-field">
                  <label className="sp-label">Institute / organisation</label>
                  <input
                    className="sp-input"
                    value={form.institute}
                    onChange={(e) =>
                      handleChange("institute", e.target.value)
                    }
                    placeholder="CMLRE · Ministry of Earth Sciences"
                  />
                </div>
                <div className="sp-field">
                  <label className="sp-label">Contact number</label>
                  <input
                    className="sp-input"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+91 —"
                  />
                </div>
              </div>

              <div className="sp-field">
                <label className="sp-label">Short bio / research focus</label>
                <textarea
                  className="sp-textarea"
                  rows={3}
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="e.g. Ecosystem modelling, fisheries stock assessment, eDNA–based biodiversity monitoring."
                />
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="sp-section">
            <h2>Appearance</h2>
            <p className="sp-section-sub">
              Choose how OASIS looks and feels on your screen.
            </p>

            <div className="sp-card">
              <h3>Theme</h3>
              <div className="sp-row sp-radio-row">
                {["dark", "light", "system"].map((mode) => (
                  <label key={mode} className="sp-radio-pill">
                    <input
                      type="radio"
                      name="theme"
                      checked={form.theme === mode}
                      onChange={() => handleChange("theme", mode)}
                    />
                    <span className="sp-radio-label">
                      {mode === "dark"
                        ? "Dark"
                        : mode === "light"
                        ? "Light"
                        : "System default"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="sp-card">
              <h3>Layout & accessibility</h3>
              <div className="sp-2col">
                <div className="sp-field">
                  <label className="sp-label">Font size</label>
                  <select
                    className="sp-input"
                    value={form.fontSize}
                    onChange={(e) =>
                      handleChange("fontSize", e.target.value)
                    }
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="sp-field">
                  <label className="sp-label">Dashboard density</label>
                  <select
                    className="sp-input"
                    value={form.density}
                    onChange={(e) =>
                      handleChange("density", e.target.value)
                    }
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                  </select>
                </div>
              </div>

              <div className="sp-row sp-toggle-row">
                <div>
                  <p className="sp-label">Reduce motion</p>
                  <p className="sp-muted">
                    Minimises animations for a calmer experience.
                  </p>
                </div>
                <label className="sp-switch">
                  <input
                    type="checkbox"
                    checked={form.reduceMotion}
                    onChange={(e) =>
                      handleChange("reduceMotion", e.target.checked)
                    }
                  />
                  <span className="sp-slider" />
                </label>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="sp-section">
            <h2>Notifications</h2>
            <p className="sp-section-sub">
              Control when OASIS should notify you.
            </p>

            <div className="sp-card">
              <h3>Email alerts</h3>

              <div className="sp-toggle-row">
                <div>
                  <p className="sp-label">Dataset updates</p>
                  <p className="sp-muted">
                    New datasets or versions added to your subscribed
                    collections.
                  </p>
                </div>
                <label className="sp-switch">
                  <input
                    type="checkbox"
                    checked={form.emailDatasetUpdates}
                    onChange={(e) =>
                      handleChange(
                        "emailDatasetUpdates",
                        e.target.checked
                      )
                    }
                  />
                  <span className="sp-slider" />
                </label>
              </div>

              <div className="sp-toggle-row">
                <div>
                  <p className="sp-label">Approvals & reviews</p>
                  <p className="sp-muted">
                    Status changes for your data requests and analyses.
                  </p>
                </div>
                <label className="sp-switch">
                  <input
                    type="checkbox"
                    checked={form.emailApprovals}
                    onChange={(e) =>
                      handleChange("emailApprovals", e.target.checked)
                    }
                  />
                  <span className="sp-slider" />
                </label>
              </div>

              <div className="sp-toggle-row">
                <div>
                  <p className="sp-label">System alerts</p>
                  <p className="sp-muted">
                    Pipeline failures, quota warnings and important platform
                    messages.
                  </p>
                </div>
                <label className="sp-switch">
                  <input
                    type="checkbox"
                    checked={form.emailAlerts}
                    onChange={(e) =>
                      handleChange("emailAlerts", e.target.checked)
                    }
                  />
                  <span className="sp-slider" />
                </label>
              </div>

              <div className="sp-toggle-row">
                <div>
                  <p className="sp-label">Weekly summary</p>
                  <p className="sp-muted">
                    Activity report summarising datasets, models and
                    collaborations you interacted with.
                  </p>
                </div>
                <label className="sp-switch">
                  <input
                    type="checkbox"
                    checked={form.weeklySummary}
                    onChange={(e) =>
                      handleChange("weeklySummary", e.target.checked)
                    }
                  />
                  <span className="sp-slider" />
                </label>
              </div>
            </div>
          </div>
        );

      case "research":
        return (
          <div className="sp-section">
            <h2>Research preferences</h2>
            <p className="sp-section-sub">
              Fine-tune how OASIS supports your analyses.
            </p>

            <div className="sp-card">
              <h3>Workspace</h3>
              <div className="sp-field">
                <label className="sp-label">
                  Default workspace on login
                </label>
                <select
                  className="sp-input"
                  value={form.defaultWorkspace}
                  onChange={(e) =>
                    handleChange("defaultWorkspace", e.target.value)
                  }
                >
                  <option value="last-opened">Last opened workspace</option>
                  <option value="blank">Blank workspace</option>
                  <option value="viz">Visualisation dashboard</option>
                </select>
              </div>
            </div>

            <div className="sp-card">
              <h3>AI & data handling</h3>
              <div className="sp-field">
                <label className="sp-label">AI recommendation level</label>
                <select
                  className="sp-input"
                  value={form.aiLevel}
                  onChange={(e) => handleChange("aiLevel", e.target.value)}
                >
                  <option value="low">Low (subtle suggestions)</option>
                  <option value="medium">Medium (recommended)</option>
                  <option value="high">
                    High (aggressive dataset & model suggestions)
                  </option>
                </select>
              </div>

              <div className="sp-2col">
                <div className="sp-field">
                  <label className="sp-label">Preferred data format</label>
                  <select
                    className="sp-input"
                    value={form.dataFormat}
                    onChange={(e) =>
                      handleChange("dataFormat", e.target.value)
                    }
                  >
                    <option value="csv">CSV</option>
                    <option value="netcdf">NetCDF</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <div className="sp-field">
                  <label className="sp-label">Export quality</label>
                  <select
                    className="sp-input"
                    value={form.exportQuality}
                    onChange={(e) =>
                      handleChange("exportQuality", e.target.value)
                    }
                  >
                    <option value="standard">Standard</option>
                    <option value="high">High-resolution</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "system":
        return (
          <div className="sp-section">
            <h2>System</h2>
            <p className="sp-section-sub">
              Regional and measurement settings for your account.
            </p>

            <div className="sp-card">
              <h3>Locale</h3>
              <div className="sp-2col">
                <div className="sp-field">
                  <label className="sp-label">Language</label>
                  <select
                    className="sp-input"
                    value={form.language}
                    onChange={(e) =>
                      handleChange("language", e.target.value)
                    }
                  >
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="sp-field">
                  <label className="sp-label">Time zone</label>
                  <select
                    className="sp-input"
                    value={form.timezone}
                    onChange={(e) =>
                      handleChange("timezone", e.target.value)
                    }
                  >
                    <option value="IST">IST (Asia/Kolkata)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>

              <div className="sp-2col">
                <div className="sp-field">
                  <label className="sp-label">Date format</label>
                  <select
                    className="sp-input"
                    value={form.dateFormat}
                    onChange={(e) =>
                      handleChange("dateFormat", e.target.value)
                    }
                  >
                    <option value="dd-mm-yyyy">DD-MM-YYYY</option>
                    <option value="mm-dd-yyyy">MM-DD-YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="sp-field">
                  <label className="sp-label">Units</label>
                  <select
                    className="sp-input"
                    value={form.units}
                    onChange={(e) => handleChange("units", e.target.value)}
                  >
                    <option value="metric">Metric / SI</option>
                    <option value="scientific">Scientific (oceanic)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="sp-section">
            <h2>Privacy & compliance</h2>
            <p className="sp-section-sub">
              How your activity and downloads are logged inside OASIS.
            </p>

            <div className="sp-card">
              <h3>Downloads</h3>
              <div className="sp-toggle-row">
                <div>
                  <p className="sp-label">Watermark exported files</p>
                  <p className="sp-muted">
                    Adds a small, non-intrusive watermark identifying OASIS as
                    the data source.
                  </p>
                </div>
                <label className="sp-switch">
                  <input
                    type="checkbox"
                    checked={form.watermarkDownloads}
                    onChange={(e) =>
                      handleChange("watermarkDownloads", e.target.checked)
                    }
                  />
                  <span className="sp-slider" />
                </label>
              </div>
            </div>

            <div className="sp-card">
              <h3>Activity log</h3>
              <p className="sp-muted">
                OASIS records important actions (logins, dataset requests,
                approvals) for audit and compliance with Ministry of Earth
                Sciences guidelines. Contact your system administrator to
                request a copy of your activity log.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="settings-page">
      <div className="settings-shell">
        {/* LEFT: SECTION LIST */}
        <aside className="sp-sidebar">
          <h1 className="sp-title">Settings</h1>
          <p className="sp-subtitle">
            Tune OASIS to match how you work as a scientist / researcher.
          </p>
          <nav className="sp-nav">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={
                  "sp-nav-item" +
                  (activeSection === s.id ? " sp-nav-item-active" : "")
                }
                onClick={() => setActiveSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* RIGHT: ACTIVE SECTION CONTENT */}
        <section className="sp-content">
          {renderSection()}

          <div className="sp-footer">
            <button
              className="sp-btn-outline"
              type="button"
              onClick={() => {
                // simple reset to defaults
                setForm((prev) => ({
                  ...prev,
                  theme: "dark",
                  fontSize: "medium",
                  density: "comfortable",
                  reduceMotion: false,
                }));
              }}
            >
              Reset to defaults
            </button>
            <button
              className="sp-btn-primary"
              type="button"
              onClick={handleSave}
            >
              Save changes
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
