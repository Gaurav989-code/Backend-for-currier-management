import express from "express";
import {
  addCheckPoints,
  createParcel,
  getAllParcels,
  getParcelByTrackingId,
  calculateCostCalculator,
} from "../controllers/parcel.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Parcels
 *     description: Endpoints for managing parcels
 */

/**
 * @swagger
 * /api/parcels:
 *   post:
 *     summary: Create a new parcel (Admin)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderName:
 *                 type: string
 *                 example: "John Doe"
 *               senderPhone:
 *                 type: string
 *                 example: "9689839562"
 *               senderAddress:
 *                 type: string
 *                 example: "123 Main St, New York"
 *               receiverName:
 *                 type: string
 *                 example: "Jane Smith"
 *               receiverPhone:
 *                 type: string
 *                 example: "9689839562"
 *               receiverAddress:
 *                 type: string
 *                 example: "456 Oak Ave, Los Angeles"
 *               shipmentType:
 *                 type: string
 *                 enum: [national, international]
 *                 example: "national"
 *               originCity:
 *                 type: string
 *                 example: "New York"
 *               destinationCity:
 *                 type: string
 *                 example: "Los Angeles"
 *               deliveryType:
 *                 type: string
 *                 enum: [sameDay, overnight, standard]
 *                 example: "standard"
 *               parcelCategory:
 *                 type: string
 *                 enum: [documents, fragile, food, cosmetics, books, electronics, clothing, small_packages, large_packages]
 *                 example: "electronics"
 *               weight:
 *                 type: number
 *                 example: 2.5
 *     responses:
 *       201:
 *         description: Parcel created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 */

router.post("/", protect, adminOnly, createParcel);

/**
 * @swagger
 * /api/parcels/track/{trackingId}:
 *   get:
 *     summary: get a parcel by tracking Id (public)
 *     tags: [Parcels]
 *     parameters:
 *       - in: path
 *         name: trackingId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parcel details with checkpoints
 *       404:
 *         description: parcel not found
 */

router.get("/track/:trackingId", getParcelByTrackingId);

/**
 * @swagger
 * /api/parcels/{id}/checkpoint:
 *   post:
 *     summary: add a new check point to parcel (admin)
 *     tags: [Parcels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 example: "Main Warehouse, New York"
 *               title:
 *                 type: string
 *                 example: "Package Received"
 *               description:
 *                 type: string
 *                 example: "The package has arrived at the local hub."
 *               status:
 *                 type: string
 *                 enum: [arrived, in_transit, out_for_delivery, delivered]
 *                 example: "arrived"
 *     responses:
 *       201:
 *         description: checkpoint added successfully
 *       400:
 *         description: validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: forbidden
 *       404:
 *         description: parcel not found
 */

router.post("/:id/checkpoint", protect, adminOnly, addCheckPoints);

/**
 * @swagger
 * /api/parcels:
 *   get:
 *     summary: Get all parcels (Admin)
 *     tags: [Parcels]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [arrived, in_transit, out_for_delivery, delivered]
 *         description: Filter parcels by their current delivery status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by parcel ID, sender name, or tracking number
 *     responses:
 *       200:
 *         description: List of parcels with pagination and optional filtering
 *       401:
 *         description: Unauthorized access due to missing or invalid credentials
 *       403:
 *         description: Forbidden access due to insufficient administrative permissions
 */

router.get("/", protect, adminOnly, getAllParcels);

/**
 * @swagger
 * /api/parcels/calculate-cost:
 *   post:
 *     summary: Calculate cost of a parcel (public)
 *     tags: [Parcels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originCity:
 *                 type: string
 *                 example: "New York"
 *               destinationCity:
 *                 type: string
 *                 example: "Los Angeles"
 *               shipmentType:
 *                 type: string
 *                 enum: [national, international]
 *                 example: "national"
 *               parcelCategory:
 *                 type: string
 *                 enum: [documents, fragile, food, cosmetics, books, electronics, clothing, small_packages, large_packages]
 *                 example: "documents, fragile, food, cosmetics, books, electronics, clothing, small_packages, large_packages"
 *               weight:
 *                 type: number
 *                 example: 2.5
 *               deliveryType:
 *                 type: string
 *                 enum: [sameDay, overnight, standard]
 *                 example: "standard"
 *     responses:
 *       200:
 *         description: Cost calculated successfully
 *       400:
 *         description: validation error
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 */

router.post("/calculate-cost", calculateCostCalculator);

export default router;
