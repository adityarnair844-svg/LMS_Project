import express from "express";
import {
  addEmployee,
  updateEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
} from "../controllers/employee.js";

const router = express.Router();

router.post("/add", addEmployee);
router.put("/:employee_id", updateEmployee);
router.get("/all", getAllEmployees);
router.get("/:employee_id", getEmployeeById);
router.delete("/:employee_id", deleteEmployee);

export default router;
