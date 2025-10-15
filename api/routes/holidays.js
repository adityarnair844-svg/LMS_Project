import express from "express";
import { getHolidays, updateHoliday, publishHolidays } from "../controllers/holidays.js";

const router = express.Router();

router.get("/", getHolidays);
router.put("/:id", updateHoliday);
router.post("/publish", publishHolidays);

export default router;
