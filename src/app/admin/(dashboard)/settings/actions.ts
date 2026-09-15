"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function requireNonEditor() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role === "EDITOR") throw new Error("Forbidden");
  return session;
}

export async function createCategory(name: string) {
  await requireNonEditor();
  if (!name.trim()) throw new Error("Category name is required");

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new Error("A category with this name already exists");

  const count = await prisma.category.count();
  await prisma.category.create({ data: { name: name.trim(), slug, sortOrder: count } });

  revalidatePath("/admin/settings");
  revalidatePath("/projects");
}

export async function deleteCategory(categoryId: string) {
  await requireNonEditor();

  const projectCount = await prisma.project.count({ where: { categoryId } });
  if (projectCount > 0) {
    throw new Error(
      `Cannot delete — ${projectCount} project(s) still use this category. Reassign them first.`
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/settings");
  revalidatePath("/projects");
}
