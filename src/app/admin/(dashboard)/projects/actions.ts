"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function togglePublish(projectId: string) {
  await requireAdminSession();
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Project not found");

  await prisma.project.update({
    where: { id: projectId },
    data: { published: !project.published },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function deleteProject(projectId: string) {
  const session = await requireAdminSession();
  if (session.user.role === "EDITOR") {
    // Editors can manage content but let's still allow project deletion per spec
    // (spec restricts Users/Settings only). Keeping this check explicit for clarity.
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { images: true },
  });
  if (!project) throw new Error("Project not found");

  // Best-effort cleanup of blob storage; don't block deletion if this fails
  const urlsToDelete = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...project.images.map((img) => img.imageUrl),
  ];
  await Promise.allSettled(urlsToDelete.map((url) => del(url).catch(() => null)));

  await prisma.project.delete({ where: { id: projectId } });

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
}
