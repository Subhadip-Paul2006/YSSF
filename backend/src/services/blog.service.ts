import { prisma } from "../utils/prisma.js";
import { NotFoundError } from "../utils/errors.js";

export async function getAllBlogPosts(filters: { category?: string; search?: string }) {
  const { category, search } = filters;
  const where: Record<string, any> = { published: true };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ];
  }

  return await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) {
    throw new NotFoundError("Blog post not found");
  }

  return post;
}
