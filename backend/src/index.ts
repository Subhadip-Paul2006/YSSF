import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { generalLimiter } from "./middlewares/rate-limiter.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
const PORT = env.PORT;

// Trust proxy for rate limiting behind reverse proxies (Render, Heroku, etc.)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Body size limit
app.use(express.json({ limit: "100kb" }));

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// General rate limiter applied globally on API endpoints
app.use("/api", generalLimiter);

// Central API Router mounting
app.use("/api", apiRouter);

// Health check & root endpoints
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "YSSF API Backend is running" });
});

// Centralized error handling middleware (must be registered last)
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`YSSF Backend running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});
