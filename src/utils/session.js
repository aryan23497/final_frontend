// src/utils/session.js

// How long a login session should last (in milliseconds)
// Here: 4 hours. Change if you want (e.g. 1 hour = 1000 * 60 * 60)
const SESSION_DURATION_MS = 1000 * 60 * 60 * 4;

/** Start a new session after successful login */
export function startSession(role, email) {
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_MS;

  localStorage.setItem("user_role", role);
  localStorage.setItem("user_email", email);
  localStorage.setItem("session_expires_at", String(expiresAt));
}

/** Clear all session info (called on Logout) */
export function clearSession() {
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_email");
  localStorage.removeItem("session_expires_at");
}

/** Read current session. Returns {role, email} or null if expired / missing */
export function getSession() {
  const role = localStorage.getItem("user_role");
  if (!role) return null;

  const email = localStorage.getItem("user_email");
  const expires = parseInt(
    localStorage.getItem("session_expires_at") || "0",
    10
  );

  if (!expires || Date.now() > expires) {
    // Session expired → clean up
    clearSession();
    return null;
  }

  return { role, email };
}

/** Quick check: is user logged in with a valid session? */
export function isLoggedIn() {
  return !!getSession();
}
