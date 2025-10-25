import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/";
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="container mt-5 text-center">
      <h3>Welcome, {user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Role: <strong>{user.role.name}</strong></p>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
    </div>
  );
}
