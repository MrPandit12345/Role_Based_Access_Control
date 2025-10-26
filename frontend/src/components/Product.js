import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    category: "",
    enterpriseId: "",
    assignedEmployeeId: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchEnterprises();
    fetchEmployees();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
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

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", form);
      setForm({
        name: "",
        sku: "",
        price: "",
        category: "",
        enterpriseId: "",
        assignedEmployeeId: "",
      });
      fetchProducts();
    } catch (err) {
      alert("Error creating product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="container py-4">
      <h3>Product Management</h3>
      <form onSubmit={handleSubmit} className="row g-2 mb-3">
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
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
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.assignedEmployeeId}
            onChange={(e) =>
              setForm({ ...form, assignedEmployeeId: e.target.value })
            }
          >
            <option value="">Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Add Product</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Category</th>
            <th>Enterprise</th>
            <th>Assigned Employee</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>{p.enterpriseId?.name}</td>
              <td>
                {p.assignedEmployeeId
                  ? `${p.assignedEmployeeId.firstName} ${p.assignedEmployeeId.lastName}`
                  : "-"}
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p._id)}
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
