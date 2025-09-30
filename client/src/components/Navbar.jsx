import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { FaHome} from "react-icons/fa";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
const Navbar = () => {
  const navigate = useNavigate();
const {logout} = useContext(AuthContext)

const handleLogout = async () => {
  await logout();
  navigate("/"); 
};


  return (
    <div className="navbar">
      <div className="navbar_container">
        <div className="links">
          <Link to="/home" className="nav_link">
            {/* Home icon */}
            <FaHome size={22}   />
          {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M8 3.293l6 6V13.5a.5.5 0 0 1-.5.5H10v-4H6v4H2.5a.5.5 0 0 1-.5-.5V9.293l6-6z" />
              <path
                fillRule="evenodd"
                d="M7.293 1.5a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L8 3.207 2.707 8.914A1 1 0 0 1 1.293 7.5l6-6z"
              />
            </svg> */}
          </Link>

          <div className="dropdown">
            <button className="dropbtn">Leave</button>
            <div className="dropdown-content">
              <Link to="/compdashboard">Compoff Dashboard</Link>
              <Link to="/leavedashboard">Leave Dashboard</Link>
              <Link to="/optionalholiday">Optional Holiday Request</Link>
              <Link to="/leavecalendar">Leave Calendar</Link>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropbtn">Helpdesk</button>
            <div className="dropdown-content">
              <Link to="/myqueries">My Queries</Link>
            </div>
          </div>
        </div>
        <div className="logout_button">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
