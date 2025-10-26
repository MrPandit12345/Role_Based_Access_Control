import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Enterprises() {
  const [enterprises, setEnterprises] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", contact: "" });

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const fetchEnterprises = async () => {
    try {
      const res = await api.get("/enterprises");
      setEnterprises(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/enterprises", form);
      setForm({ name: "", location: "", contact: "" });
      fetchEnterprises();
    } catch (err) {
      alert("Error creating enterprise");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/enterprises/${id}`);
      fetchEnterprises();
    } catch (err) {
      alert("Error deleting enterprise");
    }
  };

  return (
    <div className="container py-4">
      <h3>Enterprise Management</h3>
      <form onSubmit={handleSubmit} className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Contact"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {enterprises.map((e) => (
            <tr key={e._id}>
              <td>{e.name}</td>
              <td>{e.location}</td>
              <td>{e.contact}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(e._id)}
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
