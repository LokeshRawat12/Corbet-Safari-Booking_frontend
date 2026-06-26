const FALLBACK_BASE_URL = typeof window !== "undefined" ? window.location.origin : "http://localhost:4000";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? FALLBACK_BASE_URL;

if (!import.meta.env.VITE_API_BASE_URL && typeof window !== "undefined") {
  console.warn(
    "VITE_API_BASE_URL is not set. Falling back to:",
    API_BASE_URL
  );
}

export const apiUrl = (path) => {
  if (typeof path !== "string") throw new TypeError("apiUrl expects a string path.");
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
};

export const apiFetch = (path, options) => fetch(apiUrl(path), options);
