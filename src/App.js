import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import PasswordResetRequest from "./PasswordResetRequest";
import AdminPanel from "./AdminPanel";
import ProfilePage from "./ProfilePage";
import * as api from "./api";
import { Routes, Route } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";
import ResetPassword from "./ResetPassword";
import "./App.css";
import { useToast } from "./Toast";

function App() {
  const { notify } = useToast();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [profileReviews, setProfileReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("main");
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    bookTitle: "",
    author: "",
    review: "",
    rating: "",
    coverImage: "",
  });
  const [editMode, setEditMode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showResetRequest, setShowResetRequest] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (token) {
      loadReviews();
      checkAdmin();
    }
  }, [token]);

  const checkAdmin = async () => {
    try {
      await api.fetchUsers(token);
      setIsAdmin(true);
    } catch {
      setIsAdmin(false);
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await api.fetchReviews(token);
      const sorted = [...data].sort(
        (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)
      );
      setReviews(sorted);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleFavorite = async (id) => {
    try {
      await api.toggleFavorite(id, token);
      loadReviews();
      notify("Updated favorite", { type: "success" });
    } catch {
      notify("Failed to update favorite status", { type: "error" });
    }
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (reviewData) => {
    try {
      if (editMode) {
        await api.updateReview(editMode, reviewData, token);
        setEditMode(null);
        notify("Review updated", { type: "success" });
      } else {
        await api.addReview(reviewData, token);
        notify("Review added", { type: "success" });
      }
      loadReviews();
      setForm({
        bookTitle: "",
        author: "",
        review: "",
        rating: "",
        coverImage: "",
      });
    } catch {
      notify("You must be logged in to add or edit reviews", { type: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteReview(id, token);
      loadReviews();
      notify("Review deleted", { type: "success" });
    } catch {
      notify("You must be logged in to delete reviews", { type: "error" });
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === "login") {
        const res = await api.login(authForm);
        setToken(res.token);
        localStorage.setItem("token", res.token);
        notify("Welcome back!", { type: "success" });
      } else {
        await api.register(authForm);
        setAuthMode("login");
        notify("Registration successful. Please verify your email.", {
          type: "success",
          duration: 4000,
        });
      }
      setAuthForm({ username: "", password: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Authentication failed";
      setAuthError(msg);
      notify(msg, { type: "error", duration: 4000 });
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setView("main");
    notify("Logged out", { type: "info" });
  };

  const handleEdit = (review) => {
    setForm({
      bookTitle: review.bookTitle,
      author: review.author,
      review: review.review,
      rating: review.rating,
      coverImage: review.coverImage || "",
    });
    setEditMode(review._id);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {/* Route-level pages for email flows */}
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      {token && (
        <nav
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <button onClick={() => setView("main")}>Home</button>
          <button
            onClick={async () => {
              setView("profile");
              try {
                const [me, myReviews] = await Promise.all([
                  api.getMe(token),
                  api.fetchUserReviews(token),
                ]);
                setProfile(me);
                setProfileReviews(myReviews);
              } catch {}
            }}
          >
            Profile
          </button>
          {isAdmin && (
            <button
              onClick={async () => {
                setView("admin");
                try {
                  const data = await api.fetchUsers(token);
                  setUsers(data);
                } catch {}
              }}
            >
              Admin
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      )}
      <h1>Book Reviews</h1>
      {!token ? (
        <div className="auth-container">
          <h2>{authMode === "login" ? "Login" : "Register"}</h2>
          {!showResetRequest ? (
            <>
              <form onSubmit={handleAuthSubmit} className="auth-form">
                <input
                  type="text"
                  name="username"
                  value={authForm.username}
                  onChange={handleAuthChange}
                  placeholder="Username"
                  required
                />
                {authMode === "register" && (
                  <input
                    type="email"
                    name="email"
                    value={authForm.email}
                    onChange={handleAuthChange}
                    placeholder="Email"
                    required
                  />
                )}
                <input
                  type="password"
                  name="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  placeholder="Password"
                  required
                />
                <button type="submit">
                  {authMode === "login" ? "Login" : "Register"}
                </button>
              </form>
              {authMode === "login" && (
                <button
                  style={{ marginTop: 8 }}
                  onClick={() => setShowResetRequest(true)}
                >
                  Forgot password?
                </button>
              )}
              <button
                onClick={() =>
                  setAuthMode(authMode === "login" ? "register" : "login")
                }
              >
                {authMode === "login" ? "Create an account" : "Back to login"}
              </button>
              {authError && <p style={{ color: "red" }}>{authError}</p>}
            </>
          ) : (
            <PasswordResetRequest onBack={() => setShowResetRequest(false)} />
          )}
        </div>
      ) : (
        <>
          {view === "main" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-bar"
                  style={{ maxWidth: 400 }}
                />
              </div>
              <ReviewForm
                onSubmit={handleSubmit}
                editMode={editMode}
                initialForm={form}
                token={token}
              />
              <div className="reviews">
                {reviewsLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="review">
                        <div
                          className="skeleton skeleton-line"
                          style={{ width: "70%" }}
                        />
                        <div
                          className="skeleton skeleton-line"
                          style={{ width: "40%" }}
                        />
                        <div
                          className="skeleton skeleton-thumb"
                          style={{ borderRadius: 8, margin: "8px 0" }}
                        />
                        <div
                          className="skeleton skeleton-line"
                          style={{ width: "90%" }}
                        />
                        <div
                          className="skeleton skeleton-line"
                          style={{ width: "85%" }}
                        />
                      </div>
                    ))
                  : filteredReviews.map((review) => (
                      <ReviewCard
                        key={review._id}
                        review={review}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onFavorite={handleFavorite}
                      />
                    ))}
              </div>
            </>
          )}
          {view === "profile" && (
            <ProfilePage
              profile={profile}
              onSaveProfile={async (updates) => {
                try {
                  const updated = await api.updateMe(updates, token);
                  setProfile(updated);
                  notify("Profile updated", { type: "success" });
                } catch (e) {
                  throw e;
                }
              }}
              onUploadAvatar={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const { url } = await api.uploadAvatar(file);
                  const updated = await api.updateMe({ avatarUrl: url }, token);
                  setProfile(updated);
                  notify("Photo updated", { type: "success" });
                } catch (e) {
                  notify("Failed to upload avatar", { type: "error" });
                }
              }}
              onChangePassword={async ({ currentPassword, newPassword }) => {
                try {
                  await api.changePassword(
                    { currentPassword, newPassword },
                    token
                  );
                } catch (e) {
                  throw e;
                }
              }}
              profileReviews={profileReviews}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onFavorite={handleFavorite}
            />
          )}
          {view === "admin" && (
            <AdminPanel
              users={users}
              reviews={reviews}
              onDeleteReview={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}

// End of file
export default App;
