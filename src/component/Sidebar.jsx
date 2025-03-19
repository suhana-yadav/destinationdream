import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Sidebar.css"; // Ensure the CSS file exists

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove stored auth data
    navigate("/login-choice"); // Redirect to login
  };

  const handleBookings = () => {
    navigate("/booked-hotels"); // Navigate to booked hotels page
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        ×
      </button>
      <ul>
        <li>
          <button onClick={() => navigate("/profile")}>My Profile</button>
        </li>
        <li>
          <button onClick={handleBookings}>My Bookings</button> {/* Updated */}
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
