import React, { useState } from "react";
import { http } from "./api";

const PasswordResetRequest = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await http.post("/api/request-reset", { email });
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      <button style={{ marginTop: 8 }} onClick={onBack}>
        Back to login
      </button>
      <p>{message}</p>
    </div>
  );
};

export default PasswordResetRequest;
