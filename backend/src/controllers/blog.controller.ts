import type { Request, Response, NextFunction } from "express";
import * as blogService from "../services/blog.service.js";

export async function getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search } = req.query;
    const posts = await blogService.getAllBlogPosts({
      category: typeof category === "string" ? category : undefined,
      search: typeof search === "string" ? search : undefined,
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const post = await blogService.getBlogPostBySlug(slug as string);
    res.json(post);
  } catch (error) {
    next(error);
  }
}
