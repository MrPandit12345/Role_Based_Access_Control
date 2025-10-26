import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleName: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setForm({ name: "", email: "", password: "", roleName: "" });
      fetchUsers();
    } catch (err) {
      alert("Error creating user");
    }
  };

  return (
    <div className="container py-4">
      <h3>User Management</h3>
      <form onSubmit={handleSubmit} className="mb-3 row g-2">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.roleName}
            onChange={(e) => setForm({ ...form, roleName: e.target.value })}
          >
            <option value="">Role</option>
            {roles.map((r) => (
              <option key={r._id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
