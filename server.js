import http from "http";
import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT} located at http://localhost:${PORT}`,
    );
  });
};

startServer().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1); // Exit the process with failure
});
