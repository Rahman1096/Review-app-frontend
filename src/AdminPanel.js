import React from "react";
import ReviewCard from "./ReviewCard";

const AdminPanel = ({ users, reviews, onDeleteReview }) => (
  <div>
    <h2>Admin Dashboard</h2>
    <h3>All Users</h3>
    <ul>
      {users.map((user) => (
        <li key={user._id}>
          {user.username} {user.isAdmin && <strong>(admin)</strong>}
        </li>
      ))}
    </ul>
    <h3>All Reviews</h3>
    <div className="reviews">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          onDelete={() => onDeleteReview(review._id)}
        />
      ))}
    </div>
  </div>
);

export default AdminPanel;
