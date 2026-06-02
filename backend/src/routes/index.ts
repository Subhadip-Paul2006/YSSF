import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { verifyRouter } from "./verify.routes.js";
import { campaignRouter } from "./campaign.routes.js";
import { eventRouter } from "./event.routes.js";
import { donationRouter } from "./donation.routes.js";
import { contactRouter } from "./contact.routes.js";
import { blogRouter } from "./blog.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/verify", verifyRouter);
apiRouter.use("/campaigns", campaignRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/donations", donationRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/blog", blogRouter);
apiRouter.use("/dashboard", dashboardRouter);
