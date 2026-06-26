export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export const apiUrl = (path) => {
  if (typeof path !== "string") throw new TypeError("apiUrl expects a string path.");
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
};

export const apiFetch = (path, options) => fetch(apiUrl(path), options);
