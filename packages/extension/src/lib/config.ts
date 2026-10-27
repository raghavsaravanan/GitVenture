export const DASHBOARD_URL = (import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5173").replace(/\/$/, "");

export const dashboardPath = (path = "") => `${DASHBOARD_URL}${path.startsWith("/") ? path : `/${path}`}`;
