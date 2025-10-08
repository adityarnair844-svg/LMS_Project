import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPass = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  setSuccess("");
  };

  //FOR EYE ICON
  const toggleNewPassword = () => setShowNewPassword(prev => !prev);
const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);
const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/forgotpass",
        formData
      );
      console.log(res);
      setSuccess(res.data);
      setLoading(false);
    } catch (err) {
      //AXIOS ERROR MESSAGE
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="styled-heading">Set New Password</div>
      <form onSubmit={handleSubmit}>
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <div className="password_field">
          <input
            required
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <span className="eye_icon" onClick={toggleNewPassword}>
            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <div className="password_field">
          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span className="eye_icon" onClick={toggleConfirmPassword}>
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <span>
          <Link to="/" className="link">
            Back
          </Link>
        </span>
        <button className="button-teal" type="submit" disabled={loading}>{loading ? "Please wait..." : "Change Password"}</button>
        {error && <p>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default ForgotPass;
