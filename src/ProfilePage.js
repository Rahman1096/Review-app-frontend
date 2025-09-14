import React, { useEffect, useState } from "react";
import { toAbsoluteUrl } from "./api";
import ReviewCard from "./ReviewCard";

const ProfilePage = ({
  profile,
  onSaveProfile,
  onUploadAvatar,
  onChangePassword,
  profileReviews,
  onEdit,
  onDelete,
  onFavorite,
}) => {
  const [form, setForm] = useState({
    username: profile?.username || "",
    bio: profile?.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdError, setPwdError] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [selectedAvatarName, setSelectedAvatarName] = useState("");
  const [avatarMsg, setAvatarMsg] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  };

  const handlePwdSave = async (e) => {
    e.preventDefault();
    setPwdError("");
    if (pwdForm.newPassword.length < 8) {
      setPwdError("New password must be at least 8 characters.");
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdError("Passwords do not match.");
      return;
    }
    setPwdSaving(true);
    try {
      await onChangePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Password updated successfully");
    } catch (err) {
      setPwdError(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setPwdSaving(false);
    }
  };

  // Wrap avatar change to both display filename and call parent upload handler
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    setSelectedAvatarName(file ? file.name : "");
    setAvatarMsg("");
    if (!file) return;
    // Create a temporary preview URL
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    try {
      await onUploadAvatar(e);
      setAvatarMsg("Photo updated");
      // After successful upload, we can clear the preview to use the server URL
      setTimeout(() => setAvatarPreview(""), 300);
    } catch {
      setAvatarMsg("Upload failed");
    }
  };

  // Cleanup preview URL when it changes or component unmounts
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSaveProfile(form);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <img
          src={
            avatarPreview ||
            (profile?.avatarUrl
              ? toAbsoluteUrl(profile.avatarUrl)
              : "https://via.placeholder.com/96")
          }
          alt="Avatar"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          {/* Hidden native input to avoid default 'No file chosen' label */}
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="avatar-input"
            style={{
              display: "inline-block",
              padding: "8px 12px",
              background: "#6f2dbd",
              color: "#fff",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {selectedAvatarName ? "Change Photo" : "Choose Photo"}
          </label>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            {selectedAvatarName
              ? `Selected: ${selectedAvatarName}`
              : "Recommended: square image"}
            {avatarMsg && (
              <span
                style={{
                  color: avatarMsg.includes("failed") ? "#dc2626" : "#059669",
                  marginLeft: 8,
                }}
              >
                {avatarMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ marginTop: 16 }}>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio"
          rows={3}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <h3 style={{ marginTop: 24 }}>Change Password</h3>
      <form onSubmit={handlePwdSave}>
        <input
          type="password"
          name="currentPassword"
          value={pwdForm.currentPassword}
          onChange={handlePwdChange}
          placeholder="Current password"
          required
        />
        <input
          type="password"
          name="newPassword"
          value={pwdForm.newPassword}
          onChange={handlePwdChange}
          placeholder="New password (min 8 chars)"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={pwdForm.confirmPassword}
          onChange={handlePwdChange}
          placeholder="Confirm new password"
          required
        />
        {pwdError && <p style={{ color: "red" }}>{pwdError}</p>}
        <button type="submit" disabled={pwdSaving}>
          {pwdSaving ? "Updating..." : "Update Password"}
        </button>
      </form>

      <h2 style={{ marginTop: 24 }}>Your Reviews & Favorites</h2>
      <div className="reviews">
        {profileReviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          profileReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={onEdit}
              onDelete={onDelete}
              onFavorite={onFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
