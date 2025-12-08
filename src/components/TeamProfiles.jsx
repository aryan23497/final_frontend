// src/components/TeamProfiles.jsx
import React from "react";
import "./../styles/TeamProfiles.css";

/**
 * TeamProfiles
 * Props:
 *  - members: optional array of { id, name, role, img, profileUrl }
 *
 * If no `members` prop is provided, a default demo list will be shown.
 */
export default function TeamProfiles({ members }) {
  const defaultMembers = [
    {
      id: "jits",
      name: "Dr. Jitendra Singh",
      role: "Hon'ble Minister of State (Independent Charge), Ministry of Earth Sciences",
      img: "/assets/team/jitendra_singh.jpg",
      profileUrl: "#",
    },
    {
      id: "rav",
      name: "Dr. M. Ravichandran",
      role: "Secretary, Ministry of Earth Sciences",
      img: "/assets/team/m_ravichandran.jpg",
      profileUrl: "#",
    },
    {
      id: "mah",
      name: "Dr. R.S. Maheskumar",
      role: "Head, Centre for Marine Living Resources and Ecology",
      img: "/assets/team/r_s_maheshkumar.jpg",
      profileUrl: "#",
    },
  ];

  const list = Array.isArray(members) && members.length ? members : defaultMembers;

  return (
    <section className="team-wrap" aria-labelledby="team-heading">
      <h3 id="team-heading" className="team-title">Leadership & Contacts</h3>

      <ul className="team-grid" role="list">
        {list.map((m) => (
          <li key={m.id} className="team-card">
            <div className="team-card-inner">
              <div className="team-media">
                <img
                  src={m.img}
                  alt={m.name}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/team/avatar-fallback.png"; }}
                  className="team-photo"
                />
              </div>

              <div className="team-body">
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>

              <div className="team-actions">
                <a href={m.profileUrl || "#"} className="btn btn-outline" aria-label={`View profile of ${m.name}`}>
                  View Profile
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
