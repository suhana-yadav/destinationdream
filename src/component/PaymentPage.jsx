// ...imports...
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount, reservationId } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [finalAmount, setFinalAmount] = useState(Number(totalAmount));
  const [discountApplied, setDiscountApplied] = useState(0);

  // Coupons
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("http://localhost:8083/specialoffers/all");
        const data = await response.json();

        const today = new Date().toISOString().split("T")[0];
        const activeCoupons = data.filter(
          (offer) => offer.startDate <= today && offer.endDate >= today
        );

        setCoupons(activeCoupons);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };

    fetchOffers();
  }, []);

  const handleApplyCoupon = () => {
    const offer = coupons.find((c) => c.specialOfferId === selectedCoupon);
    if (!offer) {
      alert("Please select a valid coupon.");
      return;
    }

    const minAmount = offer.minimumAmount || 0;
    if (Number(totalAmount) >= minAmount) {
      const discount = offer.discountAmount;
      const updatedAmount = Number(totalAmount) - discount;
      setFinalAmount(updatedAmount > 0 ? updatedAmount : 0);
      setDiscountApplied(discount);
      alert(`🎉 ₹${discount} off applied!`);
    } else {
      alert(`This coupon is valid only for purchases above ₹${minAmount}`);
    }
  };

  const handlePayment = async () => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      alert("Please log in.");
      navigate("/login-choice");
      return;
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, "");
    if (
      cleanedCardNumber !== "1234123412341234" ||
      expiry !== "12/25" ||
      cvv !== "123"
    ) {
      alert("Invalid demo card.");
      return;
    }

    if (!reservationId) {
      alert("Missing reservation. Try again.");
      return;
    }

    const paymentData = {
      amount: finalAmount,
      paymentMethod: "CREDIT_CARD",
      paymentStatus: "PAID",
      date: new Date().toISOString().split("T")[0],
      reservation: { reservationId },
    };

    try {
      const response = await fetch("http://localhost:8083/payments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) throw new Error("Payment failed.");
      alert("Payment Successful!");
      navigate("/booked-hotels", { state: { paymentSuccess: true } });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-box">
        <button className="apple-pay-btn">Payments</button>

        <div className="input-group">
          <label>Full name</label>
          <input type="text" placeholder="Jane Diaz" />
        </div>

        <div className="payment-methods">
          <button
            className={paymentMethod === "card" ? "active" : ""}
            onClick={() => setPaymentMethod("card")}
          >
            Credit Card
          </button>
          <button
            className={paymentMethod === "klarna" ? "active" : ""}
            onClick={() => setPaymentMethod("klarna")}
          >
            UPI
          </button>
        </div>

        {paymentMethod === "card" && (
          <>
            <div className="input-group">
              <label>Card number</label>
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                value={cardNumber}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = value
                    .replace(/(.{4})/g, "$1 ")
                    .trim()
                    .slice(0, 19);
                  setCardNumber(value);
                }}
              />
            </div>

            <div className="card-details">
              <div className="input-group">
                <label>Expiration date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div className="input-group">
                <label>Security code</label>
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  maxLength={3}
                />
              </div>
            </div>
          </>
        )}

        {/* Coupon Code Section */}
        <div className="input-group coupon-section">
          <label>Apply Coupon</label>
          <div className="coupon-select-wrapper">
            <select
              value={selectedCoupon}
              onChange={(e) => setSelectedCoupon(e.target.value)}
            >
              <option value="">-- Select Coupon --</option>
              {coupons.map((coupon) => (
                <option
                  key={coupon.specialOfferId}
                  value={coupon.specialOfferId}
                >
                  {coupon.couponCode || "Unnamed Coupon"} - ₹
                  {coupon.discountAmount} off
                </option>
              ))}
            </select>
            <button onClick={handleApplyCoupon}>Apply</button>
          </div>
        </div>

        {/* Applied Discount */}
        {discountApplied > 0 && (
          <p className="discount-applied">
            Discount Applied: ₹{discountApplied}
          </p>
        )}

        <p className="total-amount">Total: ₹{finalAmount}</p>
        <button className="submit-btn" onClick={handlePayment}>
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
