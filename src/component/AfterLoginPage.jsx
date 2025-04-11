import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AfterLoginPage.css";

const AfterLoginPage = () => {
  const [hotels, setHotels] = useState([]); // Ensure hotels is always an array
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(""); // ✅ Added missing useState
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // ✅ Fetch hotels from API
  useEffect(() => {
    axios
      .get("http://localhost:8083/hotels/all")
      .then((response) => {
        console.log("API Response:", response.data); // 🔍 Debug API response
        setHotels(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        setHotels([]); // Prevents crashes
      });
    
  } , [] );

  // ✅ Function to render stars based on rating
  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  // ✅ Filter hotels based on search input & rating
  const filteredHotels = hotels.filter((hotel) => {
    if (!hotel || !hotel.name || !hotel.location) return false; // Ensure valid hotel data

    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      selectedRating === "" || hotel.rating >= parseInt(selectedRating);

    return matchesSearch && matchesRating;
  });

  // ✅ Handle Logout
  const handleLogout = () => {
    alert("You have been logged out!");
    window.location.href = "/login-choice";
  };
  const navigate = useNavigate();
  const handleBookNow = (hotel) => {
    console.log("Navigating to hotel:", hotel); // Debugging

    if (!hotel || !hotel.hotelId) {
      alert("Hotel ID is missing!");
      return;
    }
    navigate(`/hotel/${hotel.hotelId}`); // ✅ Correct way
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Destination Dream</div>

        {/* Search Bar */}
        <input
          type="text"
          className="search-input"
          placeholder="Search hotels by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Rating Filter Dropdown */}
        <select
          className="rating-filter"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">Filter by Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars & Up</option>
          <option value="3">3 Stars & Up</option>
          <option value="2">2 Stars & Up</option>
          <option value="1">1 Star & Up</option>
        </select>

        {/* Profile Button */}
        <button
          className="profile-btn"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          My Profile
        </button>
      </nav>

      {/* Sidebar Menu */}
      <div className={`sidebar ${showSidebar ? "show" : ""}`}>
        <button className="close-btn" onClick={() => setShowSidebar(false)}>
          ✖
        </button>
        <ul>
          <li onClick={() => navigate("/booked-hotels")}>Booked Hotels</li>
          <li onClick={() => navigate("/payments-done")}>Payments</li>
          <li onClick={handleLogout} className="logout-option">
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="hotels-container">
        <div className="hotel-grid">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel, index) => (
              <div className="hotel-card" key={index}>
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="hotel-img"
                />
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p className="hotel-location">{hotel.location}</p>
                  <p className="rating">{renderStars(hotel.rating)}</p>
                </div>
                <button
                  style={{
                    backgroundColor: "#243b55",
                    hover: "#3b5f85",
                  }}
                  className="book-now"
                  onClick={() => handleBookNow(hotel)}
                >
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">
              <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AfterLoginPage;
