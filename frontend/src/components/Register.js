import React, { useState } from "react";
import api from "../api/axios";

async function registerUser({ name, email, password, roleName }) {
  try {
    const r = await api.post("/auth/register", {
      name,
      email,
      password,
      roleName,
    });
    return r.data;
  } catch (err) {
    return {
      message: err.response?.data?.message || "Network error",
    };
  }
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleName: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const res = await registerUser(form);
    setLoading(false);

    if (res && res.user) {
      setMessage(
        res.message || "User created successfully. Redirecting to login..."
      );
      setTimeout(() => (window.location.href = "/"), 1500);
      return;
    }

    setMessage(res.message || "Something went wrong");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="text-center mb-3">Register</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
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
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <select
          className="form-control mb-2"
          name="roleName"
          value={form.roleName}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
