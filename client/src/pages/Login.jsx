import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, currentUser } = useContext(AuthContext);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/home", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await login(inputs);
      setSuccess(res.data.message);
      navigate("/home", { replace: true });
    } catch (err) {
      console.log(err);
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
      <div className="styled-heading">Login</div>
      <form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          name="username"
          placeholder="Username"
          value={inputs.username}
          onChange={handleChange}
        />
        <div className="password_field">
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
          />
          <span className="eye_icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <span>
          <Link to="/forgotpass" className="link">
            Forgot Password
          </Link>
        </span>
        <button  className="button-teal" type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
        {error && <p>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default Login;
