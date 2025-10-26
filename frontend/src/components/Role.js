import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/roles", {
        name,
        permissions: permissions.split(",").map((p) => p.trim()),
      });
      setName("");
      setPermissions("");
      fetchRoles();
    } catch (err) {
      alert("Error creating role");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (err) {
      alert("Error deleting role");
    }
  };

  return (
    <div className="container py-4">
      <h3>Role Management</h3>
      <form onSubmit={handleCreate} className="mb-3">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Role name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Permissions (comma-separated)"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100">Create</button>
          </div>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r._id}>
              <td>{r.name}</td>
              <td>{r.permissions?.join(", ")}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
