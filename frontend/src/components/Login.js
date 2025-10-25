import React, { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    let res;
    try {
      const r = await api.post("/auth/login", form);
      res = r.data;
    } catch (err) {
      res = {
        message: err.response?.data?.message || "Network error",
      };
    }
    setLoading(false);
    if (res && res.token) {
      localStorage.setItem("token", res.token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
      window.location.href = "/dashboard";
    } else {
      setMessage(res.message || "Invalid credentials");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="text-center mb-3">Login</h3>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="text-center mt-3 border border-solid p-2 bg-danger mt-3">
        <a href="/register" className="text-white text-decoration-none">
          <span className="font-weight-bold">Don't have an account?</span> Register
        </a>
      </div>
    </div>
  );
}
