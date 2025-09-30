import React, { useContext, useState } from "react";
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

  // Block access to login page if already authenticated
  if (currentUser) {
    navigate("/home", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //FOR EYE ICON
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
      //AXIOS ERROR MESSAGE
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
      <h1>Login</h1>
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
        <button type="submit" disabled={loading}>
          {" "}
          {loading ? "Please wait..." : "Login"}
        </button>
        {error && <p>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default Login;
