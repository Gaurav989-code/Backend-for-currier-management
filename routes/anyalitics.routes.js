import express from "express";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";
import {
  getDeliveryPerformance,
  getRevenueAnalytics,
  getParcelGrowth,
  getTopCities,
  getAnalyticsSummary,
} from "../controllers/anylitic.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Analytics
 *  description: Analytics Endpoints for analytics
 */

/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Get analytics summary (Admin)
 *     tags: [Analytics]
 *     security:
 *         - BearerAuth: []
 *     responses:
 *       200:
 *         description: summary of totals and status distribution
 *       401:
 *         description: Unauthorized 
 *       403:
 *         description: Forbidden 
 */
router.get("/summary", protect, adminOnly, getAnalyticsSummary);

/**
 * @swagger
 * /api/analytics/revenue:
 *   get:
 *     summary: Get revenue analytics  (Admin)
 *     tags: [Analytics]
 *     security:
 *         - BearerAuth: []
 *     responses:
 *       200:
 *         description: revenue data for past 12 months
 *       401:
 *         description: Unauthorized 
 *       403:
 *         description: Forbidden 
 */
router.get("/revenue", protect, adminOnly, getRevenueAnalytics);

/**
 * @swagger
 * /api/analytics/parcels:
 *   get:
 *     summary: Parcel growth analytics  (Admin)
 *     tags: [Analytics]
 *     security:
 *         - BearerAuth: []
 *     responses:
 *       200:
 *         description: parcel growth  data for past 12 months
 *       401:
 *         description: Unauthorized 
 *       403:
 *         description: Forbidden 
 */
router.get("/parcels", protect, adminOnly, getParcelGrowth);

/**
 * @swagger
 * /api/analytics/top-cities:
 *   get:
 *     summary: Get top-cities analytics  (Admin)
 *     tags: [Analytics]
 *     security:
 *         - BearerAuth: []
 *     responses:
 *       200:
 *         description: Top-cities data for past 12 months
 *       401:
 *         description: Unauthorized 
 *       403:
 *         description: Forbidden 
 */
router.get("/top-cities", protect, adminOnly, getTopCities);

/**
 * @swagger
 * /api/analytics/delivery-performance:
 *   get:
 *     summary: Get delivery-performance analytics  (Admin)
 *     tags: [Analytics]
 *     security:
 *         - BearerAuth: []
 *     responses:
 *       200:
 *         description: delivery-performance data for past 12 months
 *       401:
 *         description: Unauthorized 
 *       403:
 *         description: Forbidden 
 */
router.get("/delivery-performance", protect, adminOnly, getDeliveryPerformance);

export default router;
