import React, { useState, useContext } from "react";
import CardBox from "../components/CardBox";
import axios from "axios";
import {
    FaUserCircle,
    FaUsers,
    FaBullhorn,
    FaEdit,
    FaPlus,
    FaTrash,
    FaInfoCircle
} from "react-icons/fa";
import { AuthContext } from "../context/authContext";
import UserDetails from "../components/UserDetails";

import { useEffect } from "react";

const EmployeeDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditList, setShowEditList] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [refreshList, setRefreshList] = useState(false);
    const [showDeleteList, setShowDeleteList] = useState(false);
    const [showDetails, setShowDetails] = useState(null);

    // Debug: log when editEmployee changes
    React.useEffect(() => {
        if (editEmployee) {
            console.log("EditEmployee set:", editEmployee);
        }
    }, [editEmployee]);

    // Handle browser history for modal
    useEffect(() => {
        if (showAddForm || showEditList || editEmployee || showDetails) {
            window.history.pushState({ modal: true }, "");
            const handlePopState = (e) => {
                setShowAddForm(false);
                setShowEditList(false);
                setEditEmployee(null);
                setShowDetails(null);
            };
            window.addEventListener("popstate", handlePopState);
            return () => {
                window.removeEventListener("popstate", handlePopState);
                if (window.history.state && window.history.state.modal) {
                    window.history.go(1);
                }
            };
        }
    }, [showAddForm, showEditList, editEmployee, showDetails]);

    // Fetch full user details just like AdminDashboard
    const handleShowDetails = async () => {
        if (!currentUser) return;

        try {
            const res = await axios.get(
                `http://localhost:8800/api/employee/${currentUser.employee_id}`,
                { withCredentials: true }
            );
            setShowDetails(res.data); // now contains all fields including designation & department
        } catch (err) {
            console.error("Failed to fetch user details:", err);
            alert("Could not load user details");
        }
    };

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
                            <button className="edit-profile" onClick={handleShowDetails}>
                                <FaInfoCircle />
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
                        <div></div>
                    </CardBox>
                </div>
            </div>

            {/* User Details Modal */}
            {showDetails && (
                <UserDetails
                    employee={showDetails} // full details fetched from backend
                    onBack={() => setShowDetails(false)}
                    showBack
                />
            )}
        </>
    );
};

export default EmployeeDashboard;
