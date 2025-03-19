import React from "react";
import "./HomePage.css"; // Ensure this CSS file exists
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function HomePage() {
  const navigate = useNavigate(); // Hook to navigate between pages

  return (
    <div className="homepage-container">
      <div className="hero">
        <video autoPlay loop muted className="background-video">
          <source src="/homepagevid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h2>WELCOME TO</h2>
          <h1>Destination Dream</h1>
          {/* Navigate to /login-choice when clicked */}
          <button
            className="learn-more"
            onClick={() => navigate("/login-choice")}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
