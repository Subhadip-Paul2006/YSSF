import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.js";
import { campaignsRoutes } from "./routes/campaigns.js";
import { eventsRoutes } from "./routes/events.js";
import { donationsRoutes } from "./routes/donations.js";
import { contactRoutes } from "./routes/contact.js";
import { blogRoutes } from "./routes/blog.js";
import { dashboardRoutes } from "./routes/dashboard.js";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`YSSF Backend running on http://localhost:${PORT}`);
});
