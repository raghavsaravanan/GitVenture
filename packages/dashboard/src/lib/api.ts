export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";
const TOKEN_KEY = "gitventureToken";
export const session = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    document.dispatchEvent(new Event("gitventure:sign-out"));
    localStorage.removeItem(TOKEN_KEY);
    try {
      sessionStorage.removeItem("gitventureIngestSeen");
    } catch {
      /* ignore */
    }
  },
};

function forceSignIn() {
  session.clear();
  if (typeof window !== "undefined" && window.location.pathname !== "/") {
    window.location.assign("/");
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = session.get();
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body.error === "string" ? body.error : `Request failed (${response.status})`;
    // Deleted/missing player or expired JWT — drop the stale token and return to login.
    if (response.status === 401 || (response.status === 404 && message === "Player not found")) {
      forceSignIn();
    }
    throw new Error(message);
  }
  return body as T;
}
