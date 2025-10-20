import { useState, useEffect } from "react";

const LeaveTable = ({ leave, appliedLeaves }) => {

  const availableLeaves = Math.max((leave.balanced_leaves - appliedLeaves), 0);

  const formatLeaves = (value) => {
    if (value === null || value === undefined || value === "") return "0";
    const num = Number(String(value).trim());
    if (Number.isNaN(num)) return "0";
    return Number.isInteger(num) ? num.toString() : parseFloat(num.toString()).toString();
  };

  return (
    <table className="leave-table">
      <thead>
        <tr>
          <td colSpan="2" className="centered">
            <div className="value">{formatLeaves(availableLeaves)}</div>
            <div className="label">Currently Available</div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="centered">
            <div className="value">{formatLeaves(leave.used_leaves)}</div>
            <div className="label">Taken</div>
          </td>
          <td className="centered">
            <div className="value">{formatLeaves(appliedLeaves)}</div>
            <div className="label">Applied</div>
          </td>
        </tr>
        <tr>
          <td colSpan="2" className="centered">
            <div className="value">{formatLeaves(leave.no_of_leaves_per_year)}</div>
            <div className="label">Opening Balance</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};


export default LeaveTable;
