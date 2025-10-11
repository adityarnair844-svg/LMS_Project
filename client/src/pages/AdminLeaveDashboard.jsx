import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import NoResult from "../assets/NoResult.png";
import AddLeaveForm from '../components/AddLeaveForm';
import { FaEdit, FaTrash, FaSync } from 'react-icons/fa';


const AdminLeaveDashboard = () => {

  const [leaves, setLeaves] = useState([]);
  const [showAddLeaveForm, setShowAddLeaveForm] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [loading, setLoading] = useState(true);
  const [message, setMsg] = useState("")
  const [error, setError] = useState("");

  const fetchLeaves = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/leave/leaveTypes");
        const data = Array.isArray(res.data) ? res.data : [res.data];

        // For each leave, check if it can be deleted
        const leavesWithDeleteStatus = await Promise.all(
          data.map(async (leave) => {
            try {
              const validateRes = await axios.get(
                `http://localhost:8800/api/leave/validateDelete/${leave.leave_type_id}`
              );
              return { ...leave, canDelete: validateRes.data.canDelete };
            } catch (err) {
              console.error(err);
              return { ...leave, canDelete: false }; // default safe
            }
          })
        );

        setLeaves(leavesWithDeleteStatus);
        console.log(leaves);
        setIsEmpty(leavesWithDeleteStatus.length === 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaves:", err);
        setError("Failed to load leaves");
        setLoading(false);
      }
    };
  useEffect(() => {
    
    fetchLeaves();
  }, []);

  const addNewLeaves = (<div style={{ padding: '30px' }}>

    <button style={{ display: 'block', margin: 'auto', width: '10%' }} className='leave-button'
      onClick={() => {
        setShowAddLeaveForm(true);
        console.log("Add Leaves clicked", showAddLeaveForm);
      }}>
      Add Leaves
    </button>
    {showAddLeaveForm && <AddLeaveForm closeModal={() => setShowAddLeaveForm(false)} onSuccess={() => setMsg("Leave Added Successfully !!!")} />}
    {message.length > 0 && alert(message)}
  </div>)

  const handleDelete = async (leave_type_id) => {
    const leave = leaves.find(l => l.leave_type_id === leave_type_id);
    if (!leave.canDelete) return;

    if (window.confirm("Are you sure you want to delete this leave type?")) {
      try {
        await axios.delete(`http://localhost:8800/api/leave/${leave_type_id}`);
        setLeaves(leaves.filter(l => l.leave_type_id !== leave_type_id));
        alert("Leave type deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Error deleting leave type");
      }
    }
  };

  const handleSyncLeave = async (leave_type_id) => {
  if (!window.confirm(`Are you sure you want to sync leave type ${leave_type_id} for all employees?`)) {
    return;
  }

  try {
    // Optional: disable button UI during request
    setLoading(true);

    const res = await axios.post(`http://localhost:8800/api/leave/syncLeave/${leave_type_id}`);
    alert(`${res.data.message} (Added ${res.data.addedRows} records)`);
    
    // Optional: re-fetch updated data
    // await fetchLeaves();

  } catch (err) {
    console.error("Sync error:", err);
    alert("Error syncing leave: " + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
    fetchLeaves();
  }
};



  if (loading) return <div>Loading Leaves...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  return isEmpty ? (<div data-v-688e4c14="" style={{ backgroundColor: '#e9edf3', height: 'calc(100vh - 80px)' }}> <div data-test="content-block-21328732" data-v-688e4c14="" style={{ padding: 20 }}><div data-v-59266736="" data-v-688e4c14=""><div data-v-59266736="">
    <img data-v-59266736="" data-test="v-img" src={NoResult} alt="" draggable="false" className="no-result" srcSet={NoResult} /></div>
    {/* <button style={{ display: 'block' , margin: 'auto', width: '10%' }}
          onClick={() => {
            setShowAddLeaveForm(true);
            console.log("Add Leaves clicked",showAddLeaveForm);
        }}
          >Add Leaves</button> */}
    {addNewLeaves}
  </div> </div>

    {/* {showAddLeaveForm && <AddLeaveForm closeModal={() => setShowAddLeaveForm(false)}/>} */}
  </div>
  ) : (
    <div style={{ width: "100%", margin: "auto" }}>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Leave Id</th>
            <th>Leave Type</th>
            <th>No of Leaves per year</th>
            <th>Approval Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="leave-rows">
          {leaves.map((leave) => (
            <tr key={leave.leave_type_id}>
              <td>
                {leave.leave_type_id}
              </td>
              <td>
                {leave.leave_type_name}
              </td>
              <td>
                {leave.no_of_leaves_per_year}
              </td>
              <td>
                {leave.approval_type}
              </td>
              <td>
                <span className="iconWrapper">
                  <FaEdit className="editLeave" />
                  <span className="tooltip">Edit</span>
                </span>

                <span className="iconWrapper">
                  <FaSync className="syncLeave"
                    onClick={() => handleSyncLeave(leave.leave_type_id)}
                    style={{ cursor: 'pointer' }} />
                  <span className="tooltip">Sync for all employees</span>
                </span>

                <span className="iconWrapper">
                  <FaTrash className="deleteLeave"
                    onClick={() => handleDelete(leave.leave_type_id)}
                    style={{
                      color: leave.canDelete ? "#dc3545" : "#aaa",
                      cursor: leave.canDelete ? "pointer" : "not-allowed",
                    }} />
                  <span className="tooltip">
                    {leave.canDelete
                      ? "Delete"
                      : "Cannot delete, assigned to employees"}
                  </span>
                </span>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {addNewLeaves}
    </div>
  );

};

export default AdminLeaveDashboard;