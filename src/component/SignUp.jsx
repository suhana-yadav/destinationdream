import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const [customer, setCustomer] = useState({
    customerName: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSendOtp = async () => {
    if (!customer.email) {
      alert("Please enter your email to receive OTP.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8083/auth/send-otp",
        { email: customer.email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        alert("OTP sent to your email. Please check your inbox.");
        setIsOtpSent(true);
      }
    } catch (error) {
      alert("Failed to send OTP. Try again.");
    }
  };

  const handleOtpVerification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8083/auth/verify-otp",
        { email: customer.email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        alert("OTP verified! You can now sign up.");
        setIsOtpVerified(true);
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert("OTP verification failed. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      alert("Please verify OTP before signing up.");
      return;
    }
    if (!validatePassword(customer.password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }
    if (customer.password !== customer.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8083/auth/signup",
        customer,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        alert("Signup successful!");
        navigate("/after-login-signup");
      }
    } catch (error) {
      alert("Signup failed! Try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h2 className="signup-title">Sign Up</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {!isOtpSent ? (
          <div>
            <input
              type="email"
              name="email"
              className="signup-input"
              placeholder="Enter Email"
              value={customer.email}
              onChange={handleChange}
              required
            />
            <button className="signup-button" onClick={handleSendOtp}>
              Send OTP
            </button>
          </div>
        ) : !isOtpVerified ? (
          <div>
            <h3>Enter OTP sent to your email</h3>
            <input
              type="text"
              className="signup-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              required
            />
            <button className="signup-button" onClick={handleOtpVerification}>
              Verify OTP
            </button>
          </div>
        ) : (
          <form className="signup-form" onSubmit={handleSignup}>
            <input
              type="text"
              name="customerName"
              className="signup-input"
              placeholder="Full Name"
              value={customer.customerName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contact"
              className="signup-input"
              placeholder="Contact"
              value={customer.contact}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              className="signup-input"
              placeholder="Address"
              value={customer.address}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="signup-input"
              placeholder="Password"
              value={customer.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              className="signup-input"
              placeholder="Confirm Password"
              value={customer.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        )}
        <p className="login-text">
          Already have an account? <Link to="/login-choice">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
