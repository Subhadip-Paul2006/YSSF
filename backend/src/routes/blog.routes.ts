import { Router } from "express";
import * as blogController from "../controllers/blog.controller.js";

export const blogRouter = Router();

blogRouter.get("/", blogController.getPosts);
blogRouter.get("/:slug", blogController.getPost);
