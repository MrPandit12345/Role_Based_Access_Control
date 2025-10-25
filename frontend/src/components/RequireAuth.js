import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL ="http://localhost:5000";

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | unauth

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauth");
      return;
    }

    // Verify token with backend /api/auth/me
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (res.ok) {
          setStatus("ok");
        } else {
          // token invalid or expired
          setStatus("unauth");
        }
      } catch (err) {
        if (cancelled) return;
        setStatus("unauth");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") return null; // or a loading spinner
  if (status === "unauth") return <Navigate to="/" replace />;
  return children;
}
