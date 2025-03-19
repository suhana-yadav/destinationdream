import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RoomDetails = () => {
  const { roomId } = useParams(); // ✅ Get room ID from URL
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8083/rooms/${roomId}`) // ✅ Fetch room details
      .then((response) => {
        setRoom(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [roomId]);

  if (loading) return <h2>Loading room details...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="room-details-container">
      <h2>Room Details</h2>
      <p>
        <strong>Type:</strong> {room.roomType}
      </p>
      <p>
        <strong>Capacity:</strong> {room.capacity} persons
      </p>
      <p>
        <strong>Price:</strong> ₹{room.price}/night
      </p>
      <button
        className="confirm-booking"
        onClick={() => alert("Booking Confirmed!")}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default RoomDetails;
