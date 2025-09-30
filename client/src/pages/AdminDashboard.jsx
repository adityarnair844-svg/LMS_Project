import React, { useState, useContext  } from "react";
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
import EditEmployeeSearchModal from "../components/EditEmployeeSearchModal";
import DeleteEmployeeSearchModal from "../components/DeleteEmployeeSearchModal";
import { AuthContext } from "../context/authContext";


import { useEffect } from "react";

const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditList, setShowEditList] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);

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
             {currentUser ? (
  <>
    <h4>{currentUser.first_name} {currentUser.last_name}</h4>
    <p>Phone: {currentUser.phone_no}</p>
  </>
) : (
  <p>Loading...</p>
)}

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
             <button
  className="btn delete"
  onClick={() => setShowDeleteList(true)}
>
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

        {/* Edit Employee Search Modal */}
        {showEditList && !editEmployee && (
          <EditEmployeeSearchModal
            onFound={(emp) => setEditEmployee(emp)}
            onClose={() => setShowEditList(false)}
          />
        )}

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

        {/* Delete Employee Search Modal */}
         {showDeleteList && (
  <DeleteEmployeeSearchModal
    onClose={() => setShowDeleteList(false)}
  />
)}       

      </div>
    </>
  );
};

export default AdminDashboard;
