import React, { useState } from "react";

const API_URL = "http://localhost:5000";

async function registerUser({ name, email, password, roleName }) {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, roleName }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { message: data.message || data.error || "Registration failed" };
    }
    return data;
  } catch (err) {
    return { message: err.message || "Network error" };
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

    // Server returns a success message and the created user; it does not return a token.
    if (res && res.user) {
      setMessage(
        res.message || "User created successfully. Redirecting to login..."
      );
      // Redirect to login after a short delay
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
