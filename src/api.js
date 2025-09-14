import axios from "axios";

// Configure API base URL for production (Netlify) via REACT_APP_API_URL.
// Fallback to your Render backend if the env var is missing.
// Example: https://review-app-backend-xoam.onrender.com
export const API_BASE = (
  process.env.REACT_APP_API_URL ||
  "https://review-app-backend-xoam.onrender.com"
).replace(/\/$/, "");

export const http = axios.create({
  baseURL: API_BASE,
});

// Resolve asset URLs returned by backend like "/uploads/abc.jpg" to absolute URLs in production
export function toAbsoluteUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) {
    const base = API_BASE?.replace(/\/$/, "") || "";
    return base + url;
  }
  return url;
}

export const fetchReviews = async (token) => {
  const res = await http.get("/api/reviews", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchUserReviews = async (token) => {
  const res = await http.get("/api/user-reviews", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchUsers = async (token) => {
  const res = await http.get("/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addReview = async (reviewData, token) => {
  const res = await http.post("/api/reviews", reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateReview = async (id, reviewData, token) => {
  const res = await http.put(`/api/reviews/${id}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteReview = async (id, token) => {
  const res = await http.delete(`/api/reviews/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const toggleFavorite = async (id, token) => {
  const res = await http.patch(
    `/api/reviews/${id}/favorite`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const login = async (authForm) => {
  const res = await http.post("/api/login", authForm);
  return res.data;
};

export const register = async (authForm) => {
  const res = await http.post("/api/register", authForm);
  return res.data;
};

export const uploadCover = async (file) => {
  const data = new FormData();
  data.append("cover", file);
  const res = await http.post("/api/upload-cover", data);
  return res.data; // { url }
};

// Profile APIs
export const getMe = async (token) => {
  const res = await http.get("/api/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateMe = async (updates, token) => {
  const res = await http.put("/api/me", updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const uploadAvatar = async (file) => {
  const data = new FormData();
  data.append("avatar", file);
  const res = await http.post("/api/upload-avatar", data);
  return res.data; // { url }
};

export const changePassword = async (
  { currentPassword, newPassword },
  token
) => {
  const res = await http.put(
    "/api/me/password",
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Email flows
export const verifyEmail = async (token) => {
  const res = await http.get(
    `/api/verify-email?token=${encodeURIComponent(token)}`
  );
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await http.post(`/api/reset-password`, { token, password });
  return res.data;
};
