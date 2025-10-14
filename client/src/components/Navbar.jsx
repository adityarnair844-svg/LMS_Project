import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!currentUser) return null; // Or a loading indicator

  // Define menu items based on roles
  const menuItems = [
    { name: "Home", path: "/home", icon: <FaHome size={22} /> },
    // Employee & Manager
    ...(currentUser.role !== "ADMIN"
      ? [
          {
            name: "Leave",
            dropdown: [
              { name: "Leave Dashboard", path: "/employee/leavedashboard" },
              { name: "Optional Holiday Request", path: "/optionalholiday" },
              { name: "Leave Calendar", path: "/leavecalendar" },
              { name: "Compoff Dashboard", path: "/compdashboard" },
            ],
          },
        ]
      : []),
    // Manager only
    ...(currentUser.role === "MANAGER"
      ? [
          {
            name: "Leave Approval",
            path: "/manager/approval",
          },
        ]
      : []),
    // Admin only
    ...(currentUser.role === "ADMIN"
      ? [
          {
            name: "Leave Management",
            dropdown: [
          { name: "Leave Dashboard", path: "/admin/leavedashboard" },
          { name: "Holiday Calendar", path: "/adminleave/optional" },
        ],
          },
        ]
      : []),
    {
      name: "Helpdesk",
      dropdown: [{ name: "My Queries", path: "/myqueries" }],
    },
  ];

  return (
    <div className="navbar">
      <div className="navbar_container">
        <div className="links">
          {menuItems.map((item, idx) =>
            item.dropdown ? (
              <div className="dropdown" key={idx}>
                <button className="dropbtn">{item.name}</button>
                <div className="dropdown-content">
                  {item.dropdown.map((subItem, subIdx) => (
                    <Link to={subItem.path} key={subIdx}>
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link to={item.path} className="nav_link" key={idx}>
                {item.icon ? item.icon : item.name}
              </Link>
            )
          )}
        </div>
        <div className="logout_button">
          <button className="button-teal" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
