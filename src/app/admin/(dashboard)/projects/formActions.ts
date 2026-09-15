"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Project name is required"),
  location: z.string().min(1, "Location is required"),
  categoryId: z.string().min(1, "Category is required"),
  year: z.coerce.number().int().min(1990).max(2100),
  status: z.enum(["COMPLETED", "ONGOING", "UPCOMING"]),
  description: z.string().min(1, "Description is required"),
  additionalInfo: z.string().optional(),
  builtUpArea: z.string().optional(),
  floors: z.string().optional(),
  duration: z.string().optional(),
  slug: z.string().optional(),
});

export interface ProjectFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  projectId?: string;
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let candidate = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
}

export async function saveProject(
  projectId: string | null,
  data: Record<string, unknown>,
  images: { url: string; altText: string; isCover: boolean }[],
  publish: boolean
): Promise<ProjectFormState> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  const values = parsed.data;
  const baseSlug = values.slug ? slugify(values.slug) : slugify(values.title);
  const finalSlug = await ensureUniqueSlug(baseSlug, projectId ?? undefined);

  const coverImage = images.find((img) => img.isCover)?.url ?? images[0]?.url ?? null;

  const projectData = {
    title: values.title,
    slug: finalSlug,
    location: values.location,
    categoryId: values.categoryId,
    year: values.year,
    status: values.status,
    description: values.description,
    additionalInfo: values.additionalInfo || null,
    builtUpArea: values.builtUpArea || null,
    floors: values.floors || null,
    duration: values.duration || null,
    coverImage,
    published: publish,
  };

  let savedId: string;

  if (projectId) {
    await prisma.project.update({ where: { id: projectId }, data: projectData });
    // Replace all images (simplest correct approach for reordering + additions/removals)
    await prisma.projectImage.deleteMany({ where: { projectId } });
    if (images.length > 0) {
      await prisma.projectImage.createMany({
        data: images.map((img, index) => ({
          projectId,
          imageUrl: img.url,
          altText: img.altText,
          sortOrder: index,
        })),
      });
    }
    savedId = projectId;
  } else {
    const created = await prisma.project.create({
      data: {
        ...projectData,
        images: {
          create: images.map((img, index) => ({
            imageUrl: img.url,
            altText: img.altText,
            sortOrder: index,
          })),
        },
      },
    });
    savedId = created.id;
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath(`/projects/${finalSlug}`);

  return { success: true, projectId: savedId };
}

export async function saveProjectAndRedirect(
  projectId: string | null,
  data: Record<string, unknown>,
  images: { url: string; altText: string; isCover: boolean }[],
  publish: boolean
) {
  const result = await saveProject(projectId, data, images, publish);
  if (result.success) {
    redirect("/admin/projects");
  }
  return result;
}
