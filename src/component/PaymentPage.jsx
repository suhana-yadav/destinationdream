import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId, roomId, checkInDate, checkOutDate, totalAmount } =
    location.state || {};

  const handlePayment = async () => {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Customer not logged in. Please log in first.");
      navigate("/login-choice");
      return;
    }

    // Simulate Payment Success
    const paymentSuccess = true;

    if (paymentSuccess) {
      const bookingData = {
        hotelId,
        roomId,
        checkInDate,
        checkOutDate,
        totalPrice: totalAmount,
        customerId,
        paymentStatus: "PAID",
        reservationStatus: "CONFIRMED",
      };

      try {
        const response = await fetch("http://localhost:8083/reservations/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          throw new Error("Failed to create reservation");
        }

        const result = await response.json();
        alert(
          `Payment Successful! Your reservation ID: ${result.reservationId}`
        );

        navigate("/booked-hotels"); // Redirect to booked hotels page
      } catch (error) {
        console.error("Error during booking:", error);
        alert("Booking failed. Please try again.");
      }
    } else {
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div>
      <h2>Payment Page</h2>
      <p>Total Amount: ₹{totalAmount}</p>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;
