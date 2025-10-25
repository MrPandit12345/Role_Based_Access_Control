import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState("checking"); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauth");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/auth/me");
        if (cancelled) return;
        if (res.status === 200) setStatus("ok");
        else setStatus("unauth");
      } catch (err) {
        if (cancelled) return;
        setStatus("unauth");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") return null; 
  if (status === "unauth") return <Navigate to="/" replace />;
  return children;
}
