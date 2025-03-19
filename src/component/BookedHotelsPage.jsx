import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./BookedHotelPage.module.css";

const BookedHotelsPage = () => {
  const [bookedHotels, setBookedHotels] = useState([]);
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!customerId) {
      console.warn("Customer ID is missing! Please log in again.");
      return;
    }

    axios
      .get(`http://localhost:8083/reservations/customer/${customerId}`)
      .then((response) => setBookedHotels(response.data))
      .catch((error) => console.error("Error fetching booked hotels:", error));
  }, [customerId]);

  const handleCancel = (reservationId) => {
    axios
      .delete(`http://localhost:8083/reservations/delete/${reservationId}`)
      .then(() => {
        setBookedHotels(
          bookedHotels.filter((hotel) => hotel.reservationId !== reservationId)
        );
      })
      .catch((error) => console.error("Error canceling reservation:", error));
  };

  const handleUpdate = (reservationId) => {
    navigate(`/update-reservation/${reservationId}`);
  };

  return (
    <div>
      {/* Minimal Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>Destination Dream</div>
        <button
          onClick={() => navigate("/after-login-signup")}
          className={styles.navButton}
        >
          DashBoard
        </button>
      </nav>

      {/* Booked Hotels Section */}
      <div className={styles.bookedHotelsSection}>
        <h2 className={styles.title}>My Booked Hotels</h2>
        {bookedHotels.length === 0 ? (
          <p className={styles.noBookings}>No bookings yet.</p>
        ) : (
          <div className={styles.bookedHotelsList}>
            {bookedHotels.map((reservation) => (
              <div key={reservation.reservationId} className={styles.hotelCard}>
                <img
                  src={reservation.hotel?.imageUrl}
                  alt={reservation.hotel?.name}
                  className={styles.hotelImage}
                />
                <div className={styles.hotelInfo}>
                  <h3 className={styles.hotelName}>
                    {reservation.hotel?.name}
                  </h3>
                  <p className={styles.hotelLocation}>
                    <strong>Location:</strong> {reservation.hotel?.location}
                  </p>
                  <p>
                    <strong>Room Type:</strong> {reservation.room?.room_type}
                  </p>
                  <p>
                    <strong>Check-in:</strong> {reservation.checkInDate}
                  </p>
                  <p>
                    <strong>Check-out:</strong> {reservation.checkOutDate}
                  </p>
                  <p>
                    <strong>Total Cost:</strong> ${reservation.totalCost}
                  </p>
                  <div className={styles.buttonGroup}>
                    {/* <button
                      onClick={() => handleUpdate(reservation.reservationId)}
                      className={styles.updateButton}
                    >
                      Update
                    </button> */}
                    <button
                      onClick={() => handleCancel(reservation.reservationId)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedHotelsPage;
