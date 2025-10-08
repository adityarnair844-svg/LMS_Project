import express from "express";
import {
  getLeaveTypes,
  addLeaves,
  validateDelete
} from "../controllers/leave.js";

const router = express.Router();

router.get('/leaveTypes',getLeaveTypes);
router.post('/addLeaves', addLeaves)
router.get('/validateDelete',validateDelete);

export default router;
