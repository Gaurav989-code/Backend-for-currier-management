import express from "express";
import { addUser, login } from "../controllers/auth.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and admin management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: admin login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: validation error
 *       401:
 *         description: Invalid credentials
 */

router.post("/login", authLimiter, login);

/**
 * @swagger
 * /api/auth/add-user:
 *   post:
 *     summary: admin add user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: User added successfully
 *       400:
 *         description: validation error
 *       401:
 *         description: Not authorized, no token
 */

router.post("/add-user", protect, adminOnly, addUser);


export default router;