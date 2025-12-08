import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "Scientist / Researcher", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.role) {
      alert("Please fill all fields and select a role.");
      return;
    }

    console.log("Logging in as:", form.email, "Role:", form.role);

    // Here later you can call FastAPI with email, password, role
    // For now, we directly go to dashboard:
    // optional: store role so dashboard can show role-specific UI
    localStorage.setItem("user_role", form.role);
    localStorage.setItem("user_email", form.email);
    navigate("/dashboard", { state: { role: form.role } });

    //navigate("/dashboard");
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <p className="login-subtitle">
          Access the unified data platform prototype
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <label className="form-label">
            Official Email
            <input
              type="email"
              name="email"
              placeholder="you@cmlre.gov.in"
              value={form.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          {/* Password */}
          <label className="form-label">
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          {/* Role select */}
          <label className="form-label">
            Select Role
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="form-input"   // uses same styling as input
            >
              <option value="Scientist / Researcher">
                Scientist / Researcher
              </option>
              <option value="Data Manager (DM)">Data Manager (DM)</option>
              <option value="Domain Expert">Domain Expert</option>
              <option value="Data Collector">Data Collector</option>
              <option value="Admin">Admin</option>
            </select>
          </label>

          <button type="submit" className="btn btn-primary login-btn">
            Login
          </button>
        </form>

        <p className="login-note">
          * Prototype only – authentication and role permissions can be linked to
          backend later.
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
