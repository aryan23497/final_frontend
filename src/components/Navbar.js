import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  // Track login state
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user_role")
  );

  const userRole = localStorage.getItem("user_role");
  const userEmail = localStorage.getItem("user_email");

  const userInitial =
    (userEmail && userEmail.charAt(0)) ||
    (userRole && userRole.charAt(0)) ||
    "U";

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user_role"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    setOpenProfile(false);
    setIsLoggedIn(false);
    navigate("/"); // back to landing page
  };

  // ✅ ONLY show profile icon on dashboard when logged in
  const showProfileIcon = isLoggedIn && location.pathname === "/dashboard";

  // ✅ Hide Login ONLY on dashboard when logged in
  const hideLogin = isLoggedIn && location.pathname === "/dashboard";

  // ✅ ROLE MENU ITEMS
  const getRoleMenuItems = (role) => {
    switch (role) {
      case "Scientist / Researcher":
        return [
          { id: "profile", label: "My Profile", route: "/profile" },
          { id: "workspace", label: "My Workspace", route: "/workspace" },
          { id: "requests", label: "My Requests", route: "/requests" },
          { id: "settings", label: "Settings", route: "/settings" },
        ];
      case "Data Manager (DM)":
        return [
          { id: "profile", label: "My Profile", route: "/profile" },
          {
            id: "upload-history",
            label: "Upload History",
            route: "/upload-history",
          },
          {
            id: "pending-approvals",
            label: "Pending Approvals",
            route: "/pending-approvals",
          },
          { id: "system-logs", label: "System Logs", route: "/system-logs" },
          { id: "settings", label: "Settings", route: "/settings" },
        ];
      case "Admin":
        return [
          { id: "profile", label: "My Profile", route: "/profile" },
          {
            id: "user-mgmt",
            label: "User Management",
            route: "/user-management",
          },
          {
            id: "role-assign",
            label: "Role Assignment",
            route: "/role-assignment",
          },
          { id: "system-health", label: "System Health", route: "/system-health" },
          { id: "audit-logs", label: "Audit Logs", route: "/audit-logs" },
          { id: "settings", label: "Settings", route: "/settings" },
        ];
      case "Domain Expert":
        return [
          { id: "profile", label: "My Profile", route: "/profile" },
          {
            id: "assigned-domains",
            label: "Assigned Domains",
            route: "/assigned-domains",
          },
          {
            id: "rule-editor",
            label: "Rule Editor Access",
            route: "/rule-editor",
          },
          {
            id: "contrib-log",
            label: "Contribution Log",
            route: "/contributions",
          },
          { id: "settings", label: "Settings", route: "/settings" },
        ];
      case "Data Collector":
        return [
          { id: "profile", label: "My Profile", route: "/profile" },
          { id: "my-uploads", label: "My Uploads", route: "/my-uploads" },
          {
            id: "upload-status",
            label: "Upload Status",
            route: "/upload-status",
          },
          {
            id: "feedback",
            label: "Feedback / Rejections",
            route: "/upload-feedback",
          },
          { id: "settings", label: "Settings", route: "/settings" },
        ];
      default:
        return [
          { id: "profile", label: "My Profile", route: "/profile" },
          { id: "settings", label: "Settings", route: "/settings" },
        ];
    }
  };

  const roleMenuItems = getRoleMenuItems(userRole);

  const handleMenuClick = (item) => {
    setOpenProfile(false);
    if (item.route) navigate(item.route);
    else alert(`${item.label} page coming soon`);
  };

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <span className="logo">OASIS</span>
      </div>

      {/* CENTER */}
      <nav className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${
            location.pathname === "/" ? "nav-link-active" : ""
          }`}
        >
          Home
        </Link>

        <Link
          to="/docs"
          className={`nav-link ${
            location.pathname === "/docs" ? "nav-link-active" : ""
          }`}
        >
          Docs
        </Link>
      </nav>

      {/* RIGHT */}
      <div className="navbar-right">
        {/* ✅ LOGIN BUTTON */}
        {!hideLogin && (
          <Link
            to="/login"
            className={`nav-link nav-login-btn ${
              location.pathname === "/login" ? "nav-link-active" : ""
            }`}
          >
            Login
          </Link>
        )}

        {/* ✅ PROFILE ICON */}
        {showProfileIcon && (
          <div className="profile-wrapper">
            <button
              type="button"
              className="profile-icon"
              onClick={() => setOpenProfile((prev) => !prev)}
            >
              {userInitial.toUpperCase()}
            </button>

            {openProfile && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <p className="profile-email">{userEmail}</p>
                  <p className="profile-role">{userRole}</p>
                </div>

                {roleMenuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="profile-item"
                    onClick={() => handleMenuClick(item)}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="profile-divider" />

                <button
                  type="button"
                  className="profile-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;