import express from "express";
import {getUserDashboardData, getSingleRC} from "../../Controller/Dashboard/DashboardController";
import { verifyToken } from "../../Utils/JWT/JWT";

const router = express.Router();

// Route to get dashboard data for a particular user
router.get("/get-user-dashboard-data:id", verifyToken, getUserDashboardData);

// Route to get single rc
router.get("/get-single-rc", verifyToken, getSingleRC);

// Route to get bulk rc
// router.get("/get-bulk-rc", userLogin);


export default router;
