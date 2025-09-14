import React, { useState } from "react";
import StarRating from "./StarRating";
import * as api from "./api";
import { toAbsoluteUrl } from "./api";

export default function ReviewForm({ onSubmit, editMode, initialForm, token }) {
  const [form, setForm] = useState(
    initialForm || {
      bookTitle: "",
      author: "",
      review: "",
      rating: "",
      coverImage: "",
    }
  );
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validate rating
    const ratingNum = Number(form.rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      setError("Rating must be a number between 1 and 5.");
      return;
    }
    setSubmitting(true);
    try {
      let coverImageUrl = form.coverImage;
      if (coverFile) {
        const res = await api.uploadCover(coverFile);
        coverImageUrl = toAbsoluteUrl(res.url);
      }
      await onSubmit({ ...form, rating: ratingNum, coverImage: coverImageUrl });
      setForm({
        bookTitle: "",
        author: "",
        review: "",
        rating: "",
        coverImage: "",
      });
      setCoverFile(null);
      setCoverPreview("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="bookTitle"
        value={form.bookTitle}
        onChange={handleChange}
        placeholder="Book Title"
        required
      />
      <input
        type="text"
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />
      <textarea
        name="review"
        value={form.review}
        onChange={handleChange}
        placeholder="Your Review"
        required
      />
      <div>
        <label style={{ display: "block", marginBottom: 6 }}>Rating</label>
        <StarRating
          value={Number(form.rating) || 0}
          onChange={(v) => setForm({ ...form, rating: v })}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleCoverChange}
        style={{ marginBottom: 12 }}
      />
      {coverPreview && (
        <img
          src={coverPreview}
          alt="Cover Preview"
          style={{ maxWidth: 120, marginBottom: 12, borderRadius: 8 }}
        />
      )}
      {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}
      <button type="submit" className="add-review-btn" disabled={submitting}>
        {submitting
          ? editMode
            ? "Updating..."
            : "Adding..."
          : editMode
          ? "Update Review"
          : "Add Review"}
      </button>
    </form>
  );
}
