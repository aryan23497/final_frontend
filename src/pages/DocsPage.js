// src/pages/DocsPage.js
import "./DocsPage.css";

const DocsPage = () => {
  return (
    <main className="docs-root">
      {/* LEFT SIDEBAR NAV */}
      <aside className="docs-sidebar">
        <div className="docs-logo">CMFRI Marine Analytics</div>

        <div className="docs-side-section">
          <p className="side-section-title">GET STARTED</p>
          <button
            type="button"
            className="side-item side-item-active"
            onClick={() =>
              document.getElementById("overview")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Overview
          </button>
        </div>

        <div className="docs-side-section">
          <p className="side-section-title">CORE</p>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("auth")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Authentication
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("upload")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Dataset Upload
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("metadata")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Metadata Service
          </button>
        </div>

        <div className="docs-side-section">
          <p className="side-section-title">SERVICES</p>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("ocean")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Ocean Visualization
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("taxonomy")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Taxonomy
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("otolith")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Otolith
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("edna")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            eDNA / BLAST
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("data-info")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Data Info
          </button>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("test")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Test / Utility
          </button>
        </div>

        <div className="docs-side-section">
          <p className="side-section-title">INTEGRATION</p>
          <button
            type="button"
            className="side-item"
            onClick={() =>
              document.getElementById("frontend-notes")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Frontend Notes
          </button>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <section className="docs-main">
        {/* PAGE HEADER */}
        <header className="docs-header" id="overview">
          <p className="docs-kicker">SIH 2025 – CMLRE Problem Statement</p>
          <h1 className="docs-title">CMFRI Marine Analytics – API Documentation</h1>
          <p className="docs-intro">
            Backend API Reference for Ocean, Taxonomy, Otolith, and eDNA Services. 
            This document describes all backend APIs implemented for the CMFRI Marine Analytics platform, 
            including authentication & role-based login, dataset upload, metadata extraction and storage, 
            ocean parameter visualization, taxonomy lookup, otolith dataset & image access, 
            eDNA BLAST-based identification, and data-info metadata for external pipeline integration.
          </p>

          <div className="docs-pills-row">
            <span className="docs-pill">Version 1.0</span>
            <span className="docs-pill">FastAPI</span>
            <span className="docs-pill">Supabase</span>
          </div>
        </header>

        {/* ============ AUTH ============ */}
        <article className="docs-section" id="auth">
          <h2>2. Authentication APIs</h2>
          <p className="section-lead">
            Base prefix: /auth — Login and registration endpoints that return JWT access tokens for
            role-based access control in the frontend.
          </p>

          {/* /auth/register */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-post">POST</span>
              <span className="path">/auth/register</span>
              <span className="tag">Register User</span>
            </div>

            <p className="endpoint-about">
              Register a new user into the system (used by admin / backend, not public signup).
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Request Body (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "username": "raj",
  "email": "raj@example.com",
  "password": "raj123",
  "contact_no": "9876543210",
  "full_name": "Raj Kumar",
  "role": "SC",
  "drive_link": "https://drive.google.com/..."
}`}</code>
                </pre>
                <p className="note">
                  <strong>role</strong> can be:<br />
                  • SC – Scientist/Researcher<br />
                  • DM – Data Manager<br />
                  • DC – Data Collector<br />
                  • DE – Domain Expert<br />
                  • DA – Admin
                </p>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "status": "ok",
  "user": {
    "id": "uuid-here",
    "username": "raj",
    "email": "raj@example.com",
    "contact_no": "9876543210",
    "full_name": "Raj Kumar",
    "role": "SC",
    "drive_link": "https://drive.google.com/..."
  }
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* /auth/login */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-post">POST</span>
              <span className="path">/auth/login</span>
              <span className="tag">Login</span>
            </div>

            <p className="endpoint-about">
              Authenticate user and issue JWT token. Validates username and password and returns a JWT token 
              that the frontend sends in the Authorization header.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Request Body (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "username": "raj",
  "password": "raj123"
}`}</code>
                </pre>
                <p className="note">
                  You can alternatively send email instead of username depending on your schema.
                </p>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "status": "ok",
  "access_token": "JWT_TOKEN_STRING",
  "token_type": "bearer",
  "user": {
    "id": "uuid-here",
    "username": "raj",
    "email": "raj@example.com",
    "contact_no": "9876543210",
    "full_name": "Raj Kumar",
    "role": "SC",
    "drive_link": "https://drive.google.com/..."
  }
}`}</code>
                </pre>
                <p className="note">
                  <strong>Notes:</strong><br />
                  • access_token is a JWT signed with your AUTH_SECRET_KEY<br />
                  • Frontend should send this token as:<br />
                  <code>Authorization: Bearer &lt;access_token&gt;</code>
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* ============ UPLOAD ============ */}
        <article className="docs-section" id="upload">
          <h2>3. Dataset Upload API</h2>
          <p className="section-lead">
            Base prefix: /upload — Accept CSV/XLSX uploads, standardize columns, and insert rows into 
            corresponding Supabase tables (ocean_data, taxonomy_data, otolith_data). Extract metadata 
            and save into dataset_metadata.
          </p>

          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-post">POST</span>
              <span className="path">/upload?dtype=ocean|taxonomy|otolith</span>
              <span className="tag">Upload Dataset</span>
            </div>

            <p className="endpoint-about">
              Accepts a CSV/XLSX file, cleans column names and writes to the appropriate Supabase table 
              based on <code>dtype</code> query parameter.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Query Parameter</h3>
                <pre className="code">
                  <code>dtype = "ocean" or "taxonomy" or "otolith"</code>
                </pre>

                <h3>Request Body</h3>
                <pre className="code">
                  <code>{`Content-Type: multipart/form-data

file: <uploaded .csv or .xlsx file>`}</code>
                </pre>

                <h3>Example URLs</h3>
                <pre className="code">
                  <code>{`POST /upload?dtype=ocean
POST /upload?dtype=taxonomy
POST /upload?dtype=otolith`}</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "status": "ok",
  "saved_rows": 10342
}`}</code>
                </pre>

                <h3>Behavior Summary</h3>
                <p className="note">
                  <strong>For dtype = ocean:</strong><br />
                  • Maps columns to: datetime, lon, lat, dic, mld, pco2_original, chl, no3, sss, sst, 
                  deviant_uncertainty, station_id, locality, water_body<br />
                  • Handles date formats like 29-Jan-2019<br />
                  • Inserts into ocean_data<br /><br />

                  <strong>For dtype = taxonomy:</strong><br />
                  • Maps to: decimalLatitude, decimalLongitude, family, genus, kingdom, phylum, 
                  scientificName, species, subclass, subfamily, suborder, subphylum, superclass, 
                  superfamily, superorder<br />
                  • Inserts into taxonomy_data<br /><br />

                  <strong>For dtype = otolith:</strong><br />
                  • Maps to: otolith_id, family, scientific_name, project_code, station_id, locality, 
                  water_body, original_image_url, etc.<br />
                  • Downloads otolith images via URL and uploads to Supabase Storage Otolith bucket<br />
                  • Saves image URL as storage_path in otolith_data
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* ============ METADATA ============ */}
        <article className="docs-section" id="metadata">
          <h2>4. Metadata Service</h2>
          <p className="section-lead">
            Table: dataset_metadata — Automatically populated from /upload endpoint to track dataset 
            structure, number of records, and generation time for each upload.
          </p>

          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="tag">Auto-populated</span>
            </div>

            <p className="endpoint-about">
              Metadata is automatically stored when datasets are uploaded via the /upload endpoint.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Example Record Stored</h3>
                <pre className="code">
                  <code>{`{
  "dataset_type": "ocean",
  "file_path": null,
  "metadata": {
    "type": "ocean",
    "columns": [
      "datetime", "lon", "lat", 
      "dic", "mld", "pco2_original",
      "chl", "no3", "sss", "sst",
      "deviant_uncertainty"
    ],
    "records": 10342,
    "created_at": "2025-12-03T10:15:30.123456"
  },
  "version": 1
}`}</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Purpose</h3>
                <p className="note">
                  Track dataset structure, number of records, and generation time for each upload. 
                  This metadata helps in:<br />
                  • Dataset versioning<br />
                  • Column tracking<br />
                  • Record count monitoring<br />
                  • Upload history<br />
                  • Data lineage
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* ============ OCEAN ============ */}
        <article className="docs-section" id="ocean">
          <h2>5. Ocean Visualization APIs</h2>
          <p className="section-lead">
            Base prefix: /ocean — Generate line/scatter/bubble plots of ocean parameters vs lat, lon, 
            or datetime. Returns PNG images with titles, axis labels, legends, and range limits.
          </p>

          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-get">GET</span>
              <span className="path">/ocean/plot</span>
              <span className="tag">Ocean Plot (PNG)</span>
            </div>

            <p className="endpoint-about">
              Generate a line/scatter (and internally bubble) plot of one or multiple ocean parameters 
              vs lat, lon, or datetime. Returns a PNG image, not JSON.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Query Parameters</h3>
                <pre className="code">
                  <code>{`plot_type: "line" or "scatter"
x: "lat", "lon", or "datetime"
y: parameter name(s)
start_date: (optional, ISO YYYY-MM-DD)
end_date: (optional, ISO YYYY-MM-DD)`}</code>
                </pre>

                <h3>Available Parameters (y)</h3>
                <pre className="code">
                  <code>{`• dic (DIC: 1950–2100)
• mld (MLD: 0–100)
• pco2_original (PCO2: 250–550)
• chl (CHL: 5e-8–4e-7)
• no3 (NO3: 0–0.06)
• sss (SSS: 30–40)
• sst (SST: 20–35)
• deviant_uncertainty (0–5)`}</code>
                </pre>

                <h3>Example Request</h3>
                <pre className="code">
                  <code>{`GET /ocean/plot?plot_type=line&x=datetime&y=sst&start_date=2024-01-01&end_date=2024-01-31

GET /ocean/plot?plot_type=scatter&x=lat&y=sst&start_date=2023-01-01&end_date=2023-12-31`}</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response</h3>
                <pre className="code">
                  <code>{`Content-Type: image/png

<binary PNG data>`}</code>
                </pre>

                <h3>Plot Features</h3>
                <p className="note">
                  The generated PNG includes:<br />
                  • Titles and axis labels with units<br />
                  • Legend for multiple parameters<br />
                  • Light background for readability<br />
                  • Range limits aligned to parameter specifications<br />
                  • Professional styling for scientific visualization
                </p>

                <h3>Usage in Frontend</h3>
                <p className="note">
                  Call from React as:<br />
                  <code>&lt;img src=".../ocean/plot?..." /&gt;</code><br />
                  or via fetch Blob → URL
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* ============ TAXONOMY ============ */}
        <article className="docs-section" id="taxonomy">
          <h2>6. Taxonomy APIs</h2>
          <p className="section-lead">
            Base prefix: /taxonomy — Backed by taxonomy_data table in Supabase. Access taxonomy records 
            for species lists, filters and map views.
          </p>

          {/* /taxonomy/list */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-get">GET</span>
              <span className="path">/taxonomy/list</span>
              <span className="tag">List Taxonomy Rows</span>
            </div>

            <p className="endpoint-about">
              Return paginated list of taxonomy records from DB for table display in the UI.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Query Parameters</h3>
                <pre className="code">
                  <code>{`limit (default 1000)
offset (default 0)`}</code>
                </pre>

                <h3>Example Request</h3>
                <pre className="code">
                  <code>GET /taxonomy/list?limit=1000&amp;offset=0</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "count": 1000,
  "data": [
    {
      "id": "uuid",
      "family": "Carangidae",
      "genus": "Caranx",
      "scientific_name": "Caranx ignobilis",
      "decimalLatitude": 12.34,
      "decimalLongitude": 73.45
    }
  ]
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* /taxonomy/species/{name} */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-get">GET</span>
              <span className="path">/taxonomy/species/{"{name}"}</span>
              <span className="tag">Species Info by Scientific Name</span>
            </div>

            <p className="endpoint-about">
              Fetch a full taxonomy record by scientific name (case-insensitive).
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Path Parameter</h3>
                <pre className="code">
                  <code>{`{name} = scientific name string
(case-insensitive)`}</code>
                </pre>

                <h3>Example Request</h3>
                <pre className="code">
                  <code>GET /taxonomy/species/Thunnus albacares</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "family": "Scombridae",
  "genus": "Thunnus",
  "species": "albacares",
  "scientific_name": "Thunnus albacares",
  "decimalLatitude": 12.34,
  "decimalLongitude": 73.45
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* /taxonomy/filter */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-get">GET</span>
              <span className="path">/taxonomy/filter</span>
              <span className="tag">Filter Taxonomy</span>
            </div>

            <p className="endpoint-about">
              Filter species by family/genus/order for dynamic query forms.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Query Parameters</h3>
                <pre className="code">
                  <code>{`family (optional, lower-cased inside backend)
genus (optional)
order (optional)`}</code>
                </pre>

                <h3>Example Request</h3>
                <pre className="code">
                  <code>GET /taxonomy/filter?family=carangidae&amp;genus=caranx</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`[
  {
    "family": "Carangidae",
    "genus": "Caranx",
    "scientific_name": "Caranx ignobilis"
  }
]`}</code>
                </pre>
              </div>
            </div>
          </section>
        </article>

        {/* ============ OTOLITH ============ */}
        <article className="docs-section" id="otolith">
          <h2>7. Otolith APIs</h2>
          <p className="section-lead">
            Base prefix: /otolith — Backed by otolith_data table. Manage otolith images and metadata 
            including storage paths, image metadata, and ML labels.
          </p>

          {/* /otolith/list */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-get">GET</span>
              <span className="path">/otolith/list</span>
              <span className="tag">List Otolith Records</span>
            </div>

            <p className="endpoint-about">
              Returns paginated otolith records including storage paths for images.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Query Parameters</h3>
                <pre className="code">
                  <code>{`limit (e.g. 1000)
offset`}</code>
                </pre>

                <h3>Example Request</h3>
                <pre className="code">
                  <code>GET /otolith/list?limit=100&amp;offset=0</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "count": 37,
  "data": [
    {
      "id": "uuid",
      "otolith_id": "CMLRE/OTL/00027",
      "family": "Nomeidae",
      "scientific_name": "Cubiceps baxteri",
      "locality": "Off South Andaman",
      "water_body": "Andaman Sea",
      "original_image_url": "https://indobis.in/...",
      "storage_path": "https://<supabase-url>/storage/v1/object/public/Otolith/CMLRE_OTL_00027.jpg",
      "metadata": {
        "width": 1024,
        "height": 768,
        "mode": "L",
        "size_bytes": 56890
      },
      "label": null,
      "created_at": "2025-11-28T17:11:18.104559"
    }
  ]
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* /otolith/by-otolithid */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-get">GET</span>
              <span className="path">/otolith/by-otolithid</span>
              <span className="tag">Filter by Otolith ID</span>
            </div>

            <p className="endpoint-about">
              Fetch otolith record using original otolith_id.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Query Parameter</h3>
                <pre className="code">
                  <code>oid = otolith_id string</code>
                </pre>

                <h3>Example Request</h3>
                <pre className="code">
                  <code>GET /otolith/by-otolithid?oid=CMLRE/OTL/00027</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "id": "uuid",
  "otolith_id": "CMLRE/OTL/00027",
  "scientific_name": "Cubiceps baxteri",
  "storage_path": "https://.../Otolith/CMLRE_OTL_00027.jpg"
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* /otolith/unlabeled */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-get">GET</span>
              <span className="path">/otolith/unlabeled</span>
              <span className="tag">Unlabeled Otoliths (for future ML)</span>
            </div>

            <p className="endpoint-about">
              Get otolith records where label is null. Returns otoliths where the manual / ML label is still empty.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Example Request</h3>
                <pre className="code">
                  <code>GET /otolith/unlabeled</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`[
  {
    "id": "uuid",
    "otolith_id": "CMLRE/OTL/00099",
    "scientific_name": null,
    "storage_path": "https://.../Otolith/CMLRE_OTL_00099.jpg",
    "label": null
  }
]`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* /otolith/label */}
          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-post">POST</span>
              <span className="path">/otolith/label</span>
              <span className="tag">Add Label (for ML training)</span>
            </div>

            <p className="endpoint-about">
              Save a manual label for an otolith image. Updates a record with a human label, useful for 
              training the otolith image model.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Query Parameters</h3>
                <pre className="code">
                  <code>{`id = <uuid>
label = <string>`}</code>
                </pre>

                <h3>Example Request</h3>
                <pre className="code">
                  <code>POST /otolith/label?id=&lt;uuid&gt;&amp;label=Cubiceps baxteri</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "status": "ok",
  "id": "uuid",
  "label": "Cubiceps baxteri"
}`}</code>
                </pre>
              </div>
            </div>
          </section>
        </article>

        {/* ============ EDNA ============ */}
        <article className="docs-section" id="edna">
          <h2>8. eDNA / BLAST APIs</h2>
          <p className="section-lead">
            Base prefix: /edna — Backed by edna_data Supabase table + NCBI BLAST. Accept raw DNA sequence, 
            clean it, submit to NCBI BLAST, poll until result, parse top hit, fetch NCBI Taxonomy, 
            save record to edna_data, and return best match and taxonomy.
          </p>

          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-post">POST</span>
              <span className="path">/edna/analyze</span>
              <span className="tag">Analyze Sequence (BLAST)</span>
            </div>

            <p className="endpoint-about">
              Accept raw DNA sequence, clean it, submit to NCBI BLAST, poll until result, parse top hit, 
              fetch NCBI Taxonomy, save record to edna_data, and return best match and taxonomy. 
              Sends the sequence to NCBI BLAST, reads the best hit, and returns species name with full 
              taxonomy and confidence metrics.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Request Body</h3>
                <pre className="code">
                  <code>{`Raw text or JSON (depending on version):

If raw body:
GCCCTCGTCCATAAACCCATATCACAGGACTGAACACTAAAGGAGACCTGATC...`}</code>
                </pre>

                <h3>Example Request</h3>
                <pre className="code">
                  <code>POST /edna/analyze

Body:
GCCCTCGTCCATAAACCCATATCACAGGACTGAACACTAAAGGAGACCTGATC...</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "raw_sequence": "GCCCTCGTCCATAA...",
  "species": "Neoglyphidodon melas",
  "score": 372.297,
  "identity": 100.0,
  "evalue": 1.33685e-98,
  "taxonomy": {
    "kingdom": "Metazoa",
    "phylum": "Chordata",
    "class": "Actinopteri",
    "order": "Perciformes",
    "family": "Pomacentridae",
    "genus": "Neoglyphidodon",
    "species": "Neoglyphidodon melas"
  },
  "note": "ok"
}`}</code>
                </pre>

                <h3>Process Flow</h3>
                <p className="note">
                  1. Clean DNA sequence<br />
                  2. Submit to NCBI BLAST<br />
                  3. Poll for results<br />
                  4. Parse top hit<br />
                  5. Fetch full taxonomy from NCBI<br />
                  6. Save to edna_data table<br />
                  7. Return species identification with confidence metrics
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* ============ DATA INFO ============ */}
        <article className="docs-section" id="data-info">
          <h2>9. Data Info API (Pipeline Integration)</h2>
          <p className="section-lead">
            Base prefix: /data-info — Store metadata about datasets coming from Airflow / S3 / external 
            pipeline. Used by pipelines to register "virtual datasets" that may live in S3 or other storage, 
            but are visible inside OASIS.
          </p>

          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-post">POST</span>
              <span className="path">/data-info/add</span>
              <span className="tag">Add Data Info Record</span>
            </div>

            <p className="endpoint-about">
              Store metadata about datasets coming from Airflow / S3 / external pipeline. Used by pipelines 
              to register "virtual datasets" that may live in S3 or other storage, but are visible inside OASIS.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Request Body (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "dataset_name": "Oceanography Master v2",
  "dataset_domain": "Ocean",
  "dataset_link": "s3://bucket/path/to/ocean.csv",
  "meta_data": {
    "source": "Airflow pipeline",
    "rows": 120000
  },
  "curated_data": {
    "cleaned_columns": [
      "datetime", "lat", "lon", "dic"
    ]
  },
  "raw_data": {
    "sample_row": {
      "datetime": "2019-01-29",
      "lat": 12.34,
      "lon": 73.45
    }
  }
}`}</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Response (JSON)</h3>
                <pre className="code">
                  <code>{`{
  "status": "ok",
  "inserted_id": "uuid-here",
  "dataset_name": "Oceanography Master v2"
}`}</code>
                </pre>

                <h3>Purpose</h3>
                <p className="note">
                  This endpoint enables:<br />
                  • External pipeline integration<br />
                  • Virtual dataset registration<br />
                  • S3/cloud storage linking<br />
                  • Metadata tracking for external sources<br />
                  • Dataset discovery across platforms
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* ============ TEST ============ */}
        <article className="docs-section" id="test">
          <h2>10. Test / Utility Endpoint</h2>
          <p className="section-lead">
            Simple endpoint for testing connectivity and image handling in the frontend. 
            Test FastAPI → frontend connection by returning a static PNG.
          </p>

          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="method method-get">GET</span>
              <span className="path">/test/image</span>
              <span className="tag">Test Image</span>
            </div>

            <p className="endpoint-about">
              Returns a static PNG so we can verify CORS, headers and image rendering.
            </p>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Example Request</h3>
                <pre className="code">
                  <code>GET /test/image</code>
                </pre>

                <h3>Purpose</h3>
                <p className="note">
                  Use this endpoint to:<br />
                  • Verify API connectivity<br />
                  • Test CORS configuration<br />
                  • Validate image rendering<br />
                  • Check header configurations<br />
                  • Debug frontend-backend communication
                </p>
              </div>

              <div className="endpoint-col">
                <h3>Response</h3>
                <pre className="code">
                  <code>{`Content-Type: image/png

<binary PNG data>`}</code>
                </pre>
              </div>
            </div>
          </section>
        </article>

        {/* ============ FRONTEND NOTES ============ */}
        <article className="docs-section" id="frontend-notes">
          <h2>11. Notes for Frontend Integration</h2>
          <p className="section-lead">
            Best practices and guidelines for integrating these APIs into your frontend application.
          </p>

          <section className="endpoint-card">
            <div className="endpoint-top">
              <span className="tag">Integration Guide</span>
            </div>

            <div className="endpoint-grid">
              <div className="endpoint-col">
                <h3>Authentication</h3>
                <pre className="code">
                  <code>{`1. Call /auth/login
2. Store access_token in local storage
3. Include Authorization header:
   Authorization: Bearer <token>
   for protected endpoints`}</code>
                </pre>

                <h3>Plots</h3>
                <pre className="code">
                  <code>{`Call /ocean/plot from React as:
<img src=".../ocean/plot?..." />

or via fetch Blob → URL`}</code>
                </pre>

                <h3>Maps & HTML Pages</h3>
                <pre className="code">
                  <code>{`For older bubble maps at /visualize/map:
Load directly in <iframe> or new tab`}</code>
                </pre>
              </div>

              <div className="endpoint-col">
                <h3>Data Tables</h3>
                <pre className="code">
                  <code>{`Use JSON response from:
• /taxonomy/list
• /otolith/list

with table UI components`}</code>
                </pre>

                <h3>Error Handling</h3>
                <p className="note">
                  Always check response status codes:<br />
                  • 200: Success<br />
                  • 401: Unauthorized (token expired/invalid)<br />
                  • 404: Resource not found<br />
                  • 500: Server error<br /><br />
                  Implement proper error handling and user feedback for all API calls.
                </p>

                <h3>Performance Tips</h3>
                <p className="note">
                  • Use pagination (limit/offset) for large datasets<br />
                  • Cache authentication tokens<br />
                  • Implement loading states<br />
                  • Use debouncing for search/filter operations
                </p>
              </div>
            </div>
          </section>
        </article>

        <footer className="docs-footer">
          CMFRI Marine Analytics · SIH 2025 · API Documentation v1.0
        </footer>
      </section>
    </main>
  );
};

export default DocsPage;