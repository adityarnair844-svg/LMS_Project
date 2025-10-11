import { useState, useEffect } from "react";

const LeaveTable = ({ leave }) => {

    const formatLeaves = (value) => {
        if (value === null || value === undefined || value === "") return "0";

        const num = Number(value); // convert from string or number
        if (Number.isNaN(num)) return "0";

        // If it's an integer like 2.00 → show "2"
        if (Number.isInteger(num)) return num.toString();

        // Otherwise, show as trimmed decimal (no trailing zeros)
        return parseFloat(num.toString()).toString();
    };


    return (
        <table className="leave-table">
            <thead>
                <tr>
                    <td colSpan="2" className="centered">
                        <div className="value">{formatLeaves(leave.balanced_leaves)}</div>
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
                        <div className="value">0</div>
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