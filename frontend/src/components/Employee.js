import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    department: "",
    role: "",
    salary: "",
    enterpriseId: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchEnterprises();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
      await api.post("/employees", form);
      setForm({
        firstName: "",
        lastName: "",
        department: "",
        role: "",
        salary: "",
        enterpriseId: "",
      });
      fetchEmployees();
    } catch (err) {
      alert("Error creating employee");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert("Error deleting employee");
    }
  };

  return (
    <div className="container py-4">
      <h3>Employee Management</h3>
      <form onSubmit={handleSubmit} className="row g-2 mb-3">
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Salary"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.enterpriseId}
            onChange={(e) =>
              setForm({ ...form, enterpriseId: e.target.value })
            }
          >
            <option value="">Enterprise</option>
            {enterprises.map((ent) => (
              <option key={ent._id} value={ent._id}>
                {ent.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Add Employee</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Enterprise</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
              <td>{emp.salary}</td>
              <td>{emp.enterpriseId?.name}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(emp._id)}
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
