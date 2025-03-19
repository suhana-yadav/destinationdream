import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submission
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  console.log("Login button clicked!"); // ✅ Debugging log

  const { email, password } = formData;

  if (!email || !password) {
    setErrorMessage("All fields are required.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:8083/auth/login",
      formData
    );

    console.log("Response received:", response.data); // ✅ Debugging log

    // ✅ Check if response contains token & customerId
    if (
      response.status === 200 &&
      response.data.token &&
      response.data.customerId
    ) {
      const { token, customerId } = response.data;

      // ✅ Store token & customerId in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("customerId", customerId);

      alert("Login successful!");
      navigate("/after-login-signup"); // ✅ Redirect user
    } else {
      console.error("Invalid response structure:", response.data);
      setErrorMessage("Unexpected response from server. Please try again.");
    }
  } catch (error) {
    setErrorMessage("Invalid email or password.");
    console.error("Login error:", error.response?.data || error.message);
  }
};


  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("OTP Submit button clicked!"); // ✅ Debugging log

    const { email } = formData;

    try {
      const response = await axios.post(
        "http://localhost:8083/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      console.log("OTP verification response:", response.data); // ✅ Debugging log

      if (response.status === 200) {
        const { token, customerId } = response.data;

        if (!customerId) {
          console.error("customerId is undefined. Check backend response.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("customerId", customerId);

        alert("Login successful!");
        navigate("/after-login-signup");
      }
    } catch (error) {
      setErrorMessage("Invalid OTP. Please try again.");
      console.error(
        "OTP verification error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-image"></div>
      <div className="login-form-container">
        <h1 className="login-title">Welcome Back!</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {!showOtpInput ? (
          // **Step 1: Login Form**
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="login-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="login-button"
              type="submit"
              disabled={!formData.email || !formData.password} // Prevent empty submission
            >
              Login
            </motion.button>
          </form>
        ) : (
          // **Step 2: OTP Verification Form**
          <form className="login-form" onSubmit={handleOtpSubmit}>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="login-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="login-button"
              type="submit"
              disabled={!otp} // Prevent empty OTP submission
            >
              Verify OTP
            </motion.button>
          </form>
        )}

        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
