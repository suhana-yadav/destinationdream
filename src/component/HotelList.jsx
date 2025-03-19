import React from "react";
import { useNavigate } from "react-router-dom";

const HotelList = ({ hotels }) => {
  const navigate = useNavigate();

  const handleHotelClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`); // Navigate to hotel details instead of room
  };

  return (
    <div className="hotel-list">
      {hotels.map((hotel) => (
        <div key={hotel.id} className="hotel-card">
          <img src={hotel.image} alt={hotel.name} className="hotel-image" />
          <h2>{hotel.name}</h2>
          <p>{hotel.location}</p>
          <p>⭐ {hotel.rating}</p>
          <button
            onClick={() => handleHotelClick(hotel.id)}
            className="book-now-btn"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default HotelList;
