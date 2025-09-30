import React, { useState } from "react";
import CardBox from "../components/CardBox";
import {
  FaUserCircle,
  FaUsers,
  FaBullhorn,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import EmployeeForm from "../components/EmployeeForm";

import { useEffect } from "react";

const AdminDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Handle browser history for modal
  useEffect(() => {
    if (showAddForm) {
      window.history.pushState({ modal: true }, "");
      const handlePopState = (e) => {
        setShowAddForm(false);
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
        // If modal is closed by other means, go forward in history to prevent unwanted back navigation
        if (window.history.state && window.history.state.modal) {
          window.history.go(1);
        }
      };
    }
  }, [showAddForm]);

  return (
    <>
      <div className="admin-dashboard">
        {/* Left side */}
        <div className="dashboard-left">
          {/* My Profile */}
          <CardBox
            className="stretch profile-card"
            title="My Profile"
            icon={<FaUserCircle size={30} color="#000" />}
            action={
              <button className="edit-profile">
                <FaEdit />
              </button>
            }
          >
            <div className="profile-card-body">
              <div className="profile-icon-big">
                <FaUserCircle size={80} color="#000" />
              </div>
              <h4>Admin Name</h4>
              <p>Phone: +91-9876543210</p>
            </div>
          </CardBox>

          {/* Employee Management */}
          <CardBox title="Employee Management" icon={<FaUsers />}>
            <div className="manage-employees">
              <button className="btn add" onClick={() => setShowAddForm(true)}>
                <FaPlus /> Add Employee
              </button>
              <button className="btn edit">
                <FaEdit /> Edit Employee
              </button>
              <button className="btn delete">
                <FaTrash /> Delete Employee
              </button>
            </div>
          </CardBox>
        </div>

        {/* Right side */}
        <div className="dashboard-right">
          <CardBox title="Announcements" icon={<FaBullhorn />}>
            <textarea
              className="announcement-textarea"
              placeholder="Write announcement here..."
            />
            <button className="btn">Save</button>
          </CardBox>
        </div>
      </div>

      {/* Modal */}
      {showAddForm && (
        <EmployeeForm
          closeModal={() => setShowAddForm(false)}
          onSuccess={(msg) => alert(msg)}
        />
      )}
    </>
  );
};

export default AdminDashboard;
