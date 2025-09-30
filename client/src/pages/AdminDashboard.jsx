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
import EmployeeList from "../components/EmployeeList";
import EditEmployeeForm from "../components/EditEmployeeForm";

import { useEffect } from "react";

const AdminDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditList, setShowEditList] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  // Debug: log when editEmployee changes
  React.useEffect(() => {
    if (editEmployee) {
      console.log("EditEmployee set:", editEmployee);
    }
  }, [editEmployee]);

  // Handle browser history for modal
  useEffect(() => {
    if (showAddForm || showEditList || editEmployee) {
      window.history.pushState({ modal: true }, "");
      const handlePopState = (e) => {
        setShowAddForm(false);
        setShowEditList(false);
        setEditEmployee(null);
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
        if (window.history.state && window.history.state.modal) {
          window.history.go(1);
        }
      };
    }
  }, [showAddForm, showEditList, editEmployee]);

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
              <button
                className="btn edit"
                onClick={() => {
                  console.log("Edit Employee button clicked");
                  setShowEditList(true);
                }}
              >
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

      {/* Render modals outside main dashboard layout to avoid clipping */}
      <div>
        {/* Add Employee Modal */}
        {showAddForm && (
          <EmployeeForm
            closeModal={() => setShowAddForm(false)}
            onSuccess={(msg) => alert(msg)}
          />
        )}

        {/* Edit Employee List Modal */}
        {showEditList &&
          !editEmployee &&
          ((() => {
            console.log("About to render EmployeeList modal");
            return null;
          })() || (
            <div
              className="modal-backdrop"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.15)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="modal"
                style={{
                  background: "#fff",
                  color: "#000",
                  borderRadius: "16px",
                  minWidth: 400,
                  maxWidth: 560,
                  minHeight: 480,
                  maxHeight: 560,
                  width: "100%",
                  padding: "32px 40px 24px 40px",
                  boxShadow: "0 10px 32px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  position: "relative",
                  overflowY: "auto",
                  zIndex: 10000,
                }}
              >
                <EmployeeList
                  onEdit={(emp) => {
                    setEditEmployee(emp);
                    // Don't close the list modal, just switch to edit
                  }}
                  key={refreshList}
                />
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button
                    className="btn delete"
                    onClick={() => setShowEditList(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))}

        {/* Edit Employee Form Modal */}
        {editEmployee && (
          <EditEmployeeForm
            employee={editEmployee}
            onSave={() => {
              setEditEmployee(null);
              setRefreshList((r) => !r);
              setShowEditList(true); // Go back to list after save
            }}
            onCancel={() => {
              setEditEmployee(null);
              setShowEditList(true); // Go back to list on cancel
            }}
            showBack
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
