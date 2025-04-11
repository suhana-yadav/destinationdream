import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HotelDetails.css";

const HotelDetails = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedRoomPrice, setSelectedRoomPrice] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const amenities = [
    "🛁 Free Wi-Fi",
    "🏊‍♂️ Swimming Pool",
    "🏋️‍♂️ Fitness Center",
    "💆‍♂️ Spa & Wellness Center",
    "🍽️ Restaurant & Bar",
    "🅿️ Parking Facility",
    "🏢 Conference Rooms",
  ];

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8083/hotels/${hotelId}`);
        if (!response.ok) throw new Error("Failed to fetch hotel details");
        const data = await response.json();
        setHotel(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableRooms = async () => {
      try {
        const response = await fetch(
          `http://localhost:8083/rooms/available/${hotelId}`
        );
        const data = await response.json();
        console.log("Fetched rooms data:", data); 
        if (!data) {
          throw new Error("No data received from the API.");
        }
        setAvailableRooms(data);
      } catch (error) {
        console.error("Error fetching available rooms:", error);
      }
    };

    fetchHotelDetails();
    fetchAvailableRooms();
  }, [hotelId]);

  const handleRoomSelection = (event) => {
    const roomId = event.target.value;
    setSelectedRoom(roomId);
    const room = availableRooms.find((r) => r.roomId === roomId);
    setSelectedRoomPrice(room ? room.price_per_night : 0);
  };

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !selectedRoomPrice)
      return hotel?.price;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

    return nights > 0 ? nights * selectedRoomPrice : selectedRoomPrice;
  };
  const handleBooking = async () => {
    const customerId = localStorage.getItem("customerId");

    if (!selectedRoom || !checkInDate || !checkOutDate) {
      alert("Please select a room and enter valid dates.");
      return;
    }

    if (!customerId) {
      alert("Customer not logged in. Please log in first.");
      return;
    }

    const bookingData = {
      hotelId,
      roomId: selectedRoom,
      checkInDate,
      checkOutDate,
      totalPrice: calculateTotalPrice(),
      customerId,
      paymentStatus: "PENDING",
      reservationStatus: "CONFIRMED",
    };

    try {
      const response = await fetch("http://localhost:8083/reservations/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to create reservation: ${errorMessage}`);
      }

      const result = await response.json();
      alert(
        `Booking successful! 🎉 Your reservation ID: ${result.reservationId}`
      );

      // Redirect to Booked Hotels page after successful booking
      navigate("/booked-hotels");
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Room is already booked");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">Destination Dream</div>
        <button
          className="back-btn"
          onClick={() => navigate("/after-login-signup")}
        >
          ← Back to Hotels
        </button>
        <button
          className="profile-btn"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          My Profile
        </button>
      </nav>
      <div className={`sidebar ${showSidebar ? "show" : ""}`}>
        <button className="close-btn" onClick={() => setShowSidebar(false)}>
          ✖
        </button>
        <ul>
          <li onClick={() => alert("Navigating to Booked Hotels...")}>
            Booked Hotels
          </li>
          <li onClick={() => alert("Filtering by Price...")}>
            Filter by Price
          </li>
          <li onClick={() => alert("Filtering by Rating...")}>
            Filter by Rating
          </li>
          <li
            onClick={() => {
              alert("You have been logged out!");
              window.location.href = "/login-choice";
            }}
          >
            Logout
          </li>
        </ul>
      </div>
      <div className="hotel-container">
        <div className="image-container">
          <img
            src={hotel?.imageUrl}
            alt={hotel?.name}
            className="hotel-image"
          />
        </div>
        <div className="details-container">
          <h1 className="hotel-name">{hotel?.name}</h1>
          <p className="hotel-location">
            {hotel?.address}, {hotel?.location}
          </p>
          <p className="hotel-price">₹{calculateTotalPrice()}</p>
          <div className="check-in-out">
            <label>Check-In:</label>
            <input
              type="date"
              value={checkInDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
            <label>Check-Out:</label>
            <input
              type="date"
              value={checkOutDate}
              min={checkInDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOutDate(e.target.value)}
            />
          </div>
          <div className="room-selection">
            <label>Select a Room:</label>
            <select value={selectedRoom} onChange={handleRoomSelection}>
              <option value="">-- Select a Room --</option>
              {availableRooms.map((room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.room_type} - ₹{room.price_per_night}
                </option>
              ))}
            </select>
          </div>
          <div className="amenities-container">
            <h2>Amenities</h2>
            <ul>
              {amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
          <button className="book-now" onClick={handleBooking}>
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
