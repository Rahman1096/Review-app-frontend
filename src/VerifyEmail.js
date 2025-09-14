import React, { useState } from "react";
import { verifyEmail } from "./api";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  React.useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then((res) => setMessage(res.message))
        .catch((err) =>
          setMessage(err.response?.data?.message || "Verification failed")
        );
    }
  }, [token]);

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
