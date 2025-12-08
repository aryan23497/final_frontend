// src/pages/MinisterPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import ministers from "../data/ministers";

/**
 * MinisterPage - render detailed profile for a minister.
 * Replaces the simpler page and uses the richer fields from ministers.js.
 */

export default function MinisterPage() {
  const { id } = useParams();
  const person = ministers.find((m) => m.id === id);

  if (!person) {
    return (
      <main style={{ padding: 24 }}>
        <h2>Minister not found</h2>
        <p>The minister you are looking for does not exist.</p>
        <Link to="/">Return to home</Link>
      </main>
    );
  }

  const {
    name,
    title,
    photo,
    contact = {},
    personal = {},
    education = [],
    educationInstitutions = [],
    profession = [],
    permanentAddress = {},
    presentAddress = {},
    positions = []
  } = person;

  return (
    <main className="landing" style={{ paddingTop: 40 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        {/* Top card: photo + name + quick contact */}
        <div className="hero-card" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <img
            src={photo}
            alt={`Portrait of ${name}`}
            style={{
              width: 160,
              height: 160,
              objectFit: "cover",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.04)"
            }}
            onError={(e) => {
              e.currentTarget.src = "/assets/ministers/placeholder.jpg";
            }}
          />

          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0 }}>{name}</h1>
            <p style={{ margin: "6px 0", color: "#9cccbf", lineHeight: 1.25 }}>{title}</p>

            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              {contact.email && (
                <a className="btn btn-outline" href={`mailto:${contact.email}`}>
                  Email
                </a>
              )}
              {contact.phone && (
                <a className="btn btn-outline" href={`tel:${contact.phone}`}>
                  Call Office
                </a>
              )}
              <Link className="btn btn-primary" to="/">
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Grid: Left = About & Personal, Right = Contact & Addresses */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
          {/* Left column */}
          <div>
            <div className="hero-card" style={{ marginBottom: 12 }}>
              <h3>About</h3>
              <p style={{ color: "#bfeee0", marginTop: 8, whiteSpace: "pre-wrap" }}>
                {person.bio || "Biography not available."}
              </p>
            </div>

            <div className="hero-card" style={{ marginBottom: 12 }}>
              <h3>Personal Details</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, width: 200, color: "#9aaeb0" }}>Father's Name</td>
                    <td style={{ padding: 8 }}>{personal.fathersName || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, color: "#9aaeb0" }}>Mother's Name</td>
                    <td style={{ padding: 8 }}>{personal.mothersName || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, color: "#9aaeb0" }}>Date of Birth</td>
                    <td style={{ padding: 8 }}>{personal.dob || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, color: "#9aaeb0" }}>Place of Birth</td>
                    <td style={{ padding: 8 }}>{personal.pob || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, color: "#9aaeb0" }}>Marital Status</td>
                    <td style={{ padding: 8 }}>{personal.maritalStatus || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, color: "#9aaeb0" }}>Spouse</td>
                    <td style={{ padding: 8 }}>{personal.spouseName || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, color: "#9aaeb0" }}>No. of Sons</td>
                    <td style={{ padding: 8 }}>{personal.numberOfSons != null ? personal.numberOfSons : "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="hero-card" style={{ marginBottom: 12 }}>
              <h3>Education</h3>
              <ul style={{ marginTop: 8, color: "#bfeee0" }}>
                {education.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>

              {educationInstitutions && educationInstitutions.length > 0 && (
                <>
                  <h4 style={{ marginTop: 12 }}>Institutions</h4>
                  <ul style={{ marginTop: 8, color: "#cfeee8" }}>
                    {educationInstitutions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="hero-card">
              <h3>Profession</h3>
              <ul style={{ marginTop: 8, color: "#bfeee0" }}>
                {profession.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column */}
          <aside>
            <div className="hero-card" style={{ marginBottom: 12 }}>
              <h4>Contact</h4>
              <p style={{ color: "#cfeee8", margin: "8px 0" }}>
                <strong>Office:</strong> {contact.office || "-"}
                <br />
                {contact.email ? (
                  <>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${contact.email}`} style={{ color: "#2dd4bf" }}>
                      {contact.email}
                    </a>
                    <br />
                  </>
                ) : null}
                {contact.phone ? (
                  <>
                    <strong>Phone:</strong> {contact.phone}
                    <br />
                  </>
                ) : null}
              </p>
            </div>

            <div className="hero-card" style={{ marginBottom: 12 }}>
              <h4>Present Address</h4>
              <p style={{ color: "#cfeee8", marginTop: 8 }}>
                {presentAddress.addressLine}
                <br />
                {presentAddress.city}
                <br />
                {presentAddress.phones && presentAddress.phones.length > 0 && (
                  <>
                    <strong>Tel:</strong> {presentAddress.phones.join(", ")}
                    <br />
                  </>
                )}
                {presentAddress.fax && (
                  <>
                    <strong>Fax:</strong> {presentAddress.fax}
                    <br />
                  </>
                )}
                {presentAddress.email && (
                  <>
                    <strong>Email:</strong> <a href={`mailto:${presentAddress.email}`} style={{ color: "#2dd4bf" }}>{presentAddress.email}</a>
                    <br />
                  </>
                )}
              </p>
            </div>

            <div className="hero-card">
              <h4>Permanent Address</h4>
              <p style={{ color: "#cfeee8", marginTop: 8 }}>
                {permanentAddress.addressLine}
                <br />
                {permanentAddress.city}
                <br />
                {permanentAddress.postal && <>{permanentAddress.postal}<br/></>}
                {permanentAddress.phones && permanentAddress.phones.length > 0 && (
                  <>
                    <strong>Tel:</strong> {permanentAddress.phones.join(", ")}
                    <br />
                  </>
                )}
              </p>
            </div>
          </aside>
        </div>

        {/* Positions / Timeline */}
        <div className="hero-card">
          <h3>Positions held</h3>
          <div style={{ marginTop: 12 }}>
            {positions.map((pos, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: "1px dashed rgba(255,255,255,0.04)" }}>
                <div style={{ color: "#9aaeb0", fontSize: 13 }}>{pos.period}</div>
                <div style={{ marginTop: 6, color: "#e6f6f1" }}>{pos.position}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
