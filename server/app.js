import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import apartmentRoutes from "./routes/apartments.js";
import reviewRoutes from "./routes/reviews.js";
import uploadRoutes from "./routes/uploads.js";

const app = express();

// Middleware runs before your routes.
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true })); // allow the frontend origin
app.use(express.json()); // parse JSON request bodies

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Feature routers
app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/uploads", uploadRoutes);

// 404 for anything else under /api
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;
