import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.middleware.js";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";

/* Routes */

import authRoutes from "./routes/auth.route.js";
import parcelRoutes from "./routes/parcel.route.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import analyticsRoutes from "./routes/anyalitics.routes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

//global rate limiter
app.use(globalLimiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Welcome to the Courier Management API" });
});

// Routes

//http://localhost:5000/api/auth/login
app.use("/api/auth", authRoutes);

//http://localhost:5000/api/
app.use("/api/parcels", parcelRoutes);

//http://localhost:5000/api/dashboard/stats
app.use("/api/dashboard", dashboardRoutes);

//http://localhost:5000/api/analytics
app.use("/api/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
