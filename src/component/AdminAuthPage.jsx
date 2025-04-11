import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Step 1: import
import "./Admin.css";

const AdminAuthPage = () => {
  const [type, setType] = useState("login");
  const [adminData, setAdminData] = useState({
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate(); // ✅ Step 2: init

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "signup") {
      if (adminData.password !== adminData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const res = await fetch("http://localhost:8083/admins/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminName: adminData.adminName,
            email: adminData.email,
            password: adminData.password,
            confirmPassword: adminData.confirmPassword,
          }),
        });

        if (res.ok) {
          alert("Admin signed up successfully!");
          setType("login");
        } else {
          alert("Sign-up failed. Please check the server response.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while signing up.");
      }
    } else {
      // ✅ LOGIN
      try {
        const res = await fetch("http://localhost:8083/admins/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: adminData.email,
            password: adminData.password,
          }),
        });
        if (res.ok) {
          alert("Login successful!");
          navigate("/admin-dashboard"); // ✅ Step 3: redirect
        } else {
          alert("Login failed. Check your email or password.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while logging in.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{type === "login" ? "ADMIN LOGIN" : "ADMIN SIGN UP"}</h2>
        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <input
              type="text"
              placeholder="Admin Name"
              name="adminName"
              value={adminData.adminName}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            required
          />

          {type === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={adminData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit">
            {type === "login" ? "LOGIN" : "SIGN UP"}
          </button>
        </form>

        <p>
          {type === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setType("signup")}
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already registered?{" "}
              <span
                onClick={() => setType("login")}
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
      <div className="image-section"></div>
    </div>
  );
};

export default AdminAuthPage;
