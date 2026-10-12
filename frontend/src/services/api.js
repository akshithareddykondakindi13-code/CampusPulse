
import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach the JWT token to every request when a user is logged in.
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("campuspulse.user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Could not read stored user session:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const STATUSES = ["PENDING", "IN_PROGRESS", "RESOLVED"];

/** Convert any Axios error into a readable message. */
export function getErrorMessage(err) {
  if (!err || !err.isAxiosError) {
    return (err && err.message) || "Unexpected error";
  }

  if (!err.response) {
    return `Cannot reach the server at ${API_BASE_URL}. Make sure the Spring Boot backend is running and CORS allows http://localhost:5173.`;
  }

  const { status, data } = err.response;
  const msg =
    typeof data === "string"
      ? data
      : data?.message ||
        data?.error ||
        (data?.errors && JSON.stringify(data.errors));

  if (status === 400) return msg || "Some fields are invalid. Please check your input.";
  if (status === 401) return msg || "Your session is missing or expired. Please log in again.";
  if (status === 403) return msg || "You are not allowed to perform this action.";
  if (status === 404) return msg || "The requested record was not found.";
  if (status === 409) return msg || "This record already exists.";
  if (status >= 500) return msg || "Server error. Please try again later.";

  return msg || `Request failed (${status}).`;
}

export const userApi = {
  register: (body) => api.post("/users/register", body).then((r) => r.data),
  login: (body) => api.post("/users/login", body).then((r) => r.data),
};

export const issueApi = {
  getAll: () => api.get("/issues").then((r) => r.data),
  getById: (id) => api.get(`/issues/${id}`).then((r) => r.data),
  getByUser: (userId) =>
    api.get(`/issues/user/${userId}`).then((r) => r.data),
  create: (issue) => api.post("/issues", issue).then((r) => r.data),
  update: (id, issue) =>
    api.put(`/issues/${id}`, issue).then((r) => r.data),
  updateStatus: (id, status) =>
    api.patch(`/issues/${id}/status`, { status }).then((r) => r.data),
  remove: (id) => api.delete(`/issues/${id}`).then((r) => r.data),
};

export function formatDate(issue) {
  const raw = issue.createdAt || issue.submittedAt || issue.createdDate;

  if (!raw) return "—";

  const d = new Date(raw);
  return isNaN(d.getTime()) ? String(raw) : d.toLocaleString();
}

export default api;
