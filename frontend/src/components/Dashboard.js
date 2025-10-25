import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FaUserShield,
  FaUsers,
  FaBuilding,
  FaBoxOpen,
  FaUserTie,
  FaHome,
} from "react-icons/fa";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await api.get("/auth/me");
        const userData = res.data.user;
        setUser(userData);

        if (userData.role.name.toLowerCase() === "admin") {
          setModules([
            { module: "dashboard" },
            { module: "users" },
            { module: "enterprises" },
            { module: "employees" },
            { module: "products" },
          ]);
        } else {
          const allowedModules =
            userData.role.permissions?.filter((perm) => perm.read) || [];
          setModules(allowedModules);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Session expired, please log in again");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    fetchUserData();
  }, []);

  if (!user) return <div className="text-center mt-5">Loading dashboard...</div>;

   const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">Welcome, {user.name}</h2>
        <p className="text-muted">
          Role: <strong>{user.role.name}</strong>
        </p>
      </div>

      <div className="row g-4">
        {modules.length > 0 ? (
          modules.map((mod) => (
            <div className="col-md-4" key={mod.module}>
              <DashboardCard module={mod.module} role={user.role.name} />
            </div>
          ))
        ) : (
          <p>No modules assigned to your role.</p>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

function DashboardCard({ module, role }) {
  const moduleIcons = {
    dashboard: <FaHome size={28} color="#0d6efd" />,
    users: <FaUsers size={28} color="#0d6efd" />,
    enterprises: <FaBuilding size={28} color="#0d6efd" />,
    employees: <FaUserTie size={28} color="#0d6efd" />,
    products: <FaBoxOpen size={28} color="#0d6efd" />,
  };

  const moduleTitles = {
    dashboard: "Dashboard Overview",
    users: "User Management",
    enterprises: "Enterprise Management",
    employees: "Employee Module",
    products: "Product Module",
  };

  const handleNavigate = () => {
    window.location.href = `/${module}`;
  };

  return (
    <div className="card shadow-sm h-100 border-0">
      <div className="card-body d-flex flex-column justify-content-between">
        <div className="d-flex align-items-center mb-3">
          {moduleIcons[module] || <FaUserShield size={28} color="#0d6efd" />}
          <h5 className="ms-3 mb-0 fw-semibold text-capitalize">
            {moduleTitles[module] || module}
          </h5>
        </div>

        <p className="text-muted small">
          {role.toLowerCase() === "admin"
            ? "Full access to create, read, update and delete."
            : "Limited access as per role permissions."}
        </p>

        <button
          onClick={handleNavigate}
          className="btn btn-primary w-100 mt-auto"
        >
          Go to {moduleTitles[module] || module}
        </button>
      </div>
    </div>
  );
}
