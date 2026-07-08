import express from "express";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Dashboard
 *  description: Endpoints for Dashboard statistics
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics for graphs (Admin)
 *     tags: [Dashboard]
 *     security:
 *         - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics for graphs
 *       401:
 *         description: Unauthorized 
 *       403:
 *         description: Forbidden 
 */



router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;
