import express from "express";
import {
  getLeaveTypes,
  addLeaves,
  validateDelete,
  syncLeaveForEmployees,
  getLeaveDetailsById,
  deleteLeaves,
  updateLeaves
} from "../controllers/leave.js";

const router = express.Router();

router.get('/leaveTypes',getLeaveTypes);
router.post('/addLeaves', addLeaves)
router.get('/validateDelete/:leave_type_id',validateDelete);
router.post("/syncLeave/:leave_type_id", syncLeaveForEmployees);
router.get("/getLeaveDetailsById/:employee_id", getLeaveDetailsById);
router.delete("/:leave_type_id", deleteLeaves);
router.put("/updateLeaves", updateLeaves);

export default router;
