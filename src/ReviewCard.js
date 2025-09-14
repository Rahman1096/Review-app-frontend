import React from "react";
import StarRating from "./StarRating";
import { toAbsoluteUrl } from "./api";

export default function ReviewCard({ review, onEdit, onDelete, onFavorite }) {
  return (
    <div className={`review${review.favorite ? " favorite-review" : ""}`}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3>
          {review.bookTitle} by {review.author}
        </h3>
        <span
          style={{
            cursor: "pointer",
            fontSize: "1.6rem",
            color: review.favorite ? "#ffd700" : "#ccc",
          }}
          title={review.favorite ? "Unfavorite" : "Mark as favorite"}
          onClick={() => onFavorite(review._id)}
        >
          ★
        </span>
      </div>
      {review.coverImage && (
        <img
          src={toAbsoluteUrl(review.coverImage)}
          alt="Book Cover"
          style={{ maxWidth: 120, marginBottom: 8, borderRadius: 8 }}
        />
      )}
      <p>{review.review}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#6b7280", fontWeight: 600 }}>Rating</span>
        <StarRating value={Number(review.rating) || 0} readOnly size={20} />
      </div>
      <button onClick={() => onEdit(review)}>Edit</button>
      <button onClick={() => onDelete(review._id)}>Delete</button>
    </div>
  );
}
