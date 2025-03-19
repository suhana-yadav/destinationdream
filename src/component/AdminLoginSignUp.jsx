import React from "react";
import "./SignUp.css"; // Import external CSS file

const AuthPage = ({ type }) => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{type === "login" ? "USER LOGIN" : "USER SIGN UP"}</h2>
        <form>
          {type === "signup" && <input type="text" placeholder="Name" />}
          {type === "signup" && (
            <input type="text" placeholder="Phone Number" />
          )}
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          {type === "signup" && (
            <input type="password" placeholder="Confirm Password" />
          )}
          <button type="submit">
            {type === "login" ? "LOGIN" : "SIGN UP"}
          </button>
        </form>
        {type === "login" && (
          <p>
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        )}
      </div>
      <div className="image-section"></div>
    </div>
  );
};

export default AuthPage;
