import React, { useState, useContext } from "react";
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

const EmployeeDashboard = () => {
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
                                {console.log("current user:", currentUser)}
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

                </div>

                {/* Right side */}
                <div className="dashboard-right">
                    <CardBox title="Announcements" icon={<FaBullhorn />}>
                        <div>

                        </div>
                    </CardBox>
                </div>
            </div>
        </>
    );
};

export default EmployeeDashboard;