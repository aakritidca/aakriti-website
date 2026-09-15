import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getFeaturedProjects(limit = 4) {
  return prisma.project.findMany({
    where: { published: true, featured: true },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getPublishedProjects({
  category,
  location,
  status,
  search,
  page = 1,
  pageSize = 9,
}: {
  category?: string;
  location?: string;
  status?: "COMPLETED" | "ONGOING" | "UPCOMING";
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: Prisma.ProjectWhereInput = {
    published: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.project.count({ where }),
  ]);

  return { projects, total, pageCount: Math.ceil(total / pageSize) };
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getRelatedProjects(categoryId: string, excludeId: string, limit = 3) {
  return prisma.project.findMany({
    where: { categoryId, published: true, id: { not: excludeId } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getAllLocations() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { location: true },
    distinct: ["location"],
  });
  return projects.map((p) => p.location);
}
