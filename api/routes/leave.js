import express from "express";
import {
  getLeaveTypes,
  addLeaves,
  validateDelete,
  syncLeaveForEmployees,
  getLeaveDetailsById,
  deleteLeaves,
  updateLeaves,
  applyLeave,
  fetchSavedLeaves,
  deleteLeaveApplication,
  submitLeaveApplication,
  getAppliedLeaves,
  getLeaveSummary,
  getPendingApprovalCount,
  getPendingApprovals,
  updateLeaveStatus,
  getPendingSubmissionsCount,
  calendar,
  applyOptionalLeave,
  removeOptionalLeave,
  getAppliedOptionalLeaves,
  getLeavesByStatus,
  getLeaveHistoryForManager
} from "../controllers/leave.js";
import { getLeaveBalance } from "../controllers/leave.js";

const router = express.Router();

router.get('/leaveTypes',getLeaveTypes);
router.post('/addLeaves', addLeaves)
router.get('/validateDelete/:leave_type_id',validateDelete);
router.post("/syncLeave/:leave_type_id", syncLeaveForEmployees);
router.get("/getLeaveDetailsById/:employee_id", getLeaveDetailsById);
router.post("/applyLeave", applyLeave);
router.get("/:employee_id/saved", fetchSavedLeaves);
router.delete("/deleteApplication/:leave_application_id", deleteLeaveApplication);
router.post("/submitApplication",submitLeaveApplication);
router.get("/getAppliedLeaves/:employee_id/:leave_type_id", getAppliedLeaves);
router.delete("/:leave_type_id", deleteLeaves);
router.put("/updateLeaves", updateLeaves);
router.get("/summary/:employee_id", getLeaveSummary);
router.get("/pendingApprovalsCount/:manager_id", getPendingApprovalCount)
router.get("/pendingApprovals/:manager_id", getPendingApprovals);
router.post("/updateStatus", updateLeaveStatus);
router.get("/pendingSubmissions/:employee_id", getPendingSubmissionsCount);
router.get("/calendar/:employee_id",calendar);
router.post("/applyOptional",applyOptionalLeave);
router.post("/removeOptional", removeOptionalLeave);
router.get("/appliedOptional/:employee_id", getAppliedOptionalLeaves);
router.get("/getLeaveBalance/:employee_id/:leave_type_id", getLeaveBalance);
router.get("/getLeavesByStatus/:employee_id/:status",getLeavesByStatus);
router.get("/history/:manager_id", getLeaveHistoryForManager);
export default router;
