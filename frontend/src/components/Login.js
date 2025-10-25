import React, { useState } from "react";

const API_URL = "http://localhost:5000";

async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { message: data.message || data.error || "Login failed" };
    }
    return data;
  } catch (err) {
    return { message: err.message || "Network error" };
  }
}

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
    const res = await loginUser(form);
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
    </div>
  );
}
