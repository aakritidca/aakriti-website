"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
});

export interface ServiceFormState {
  success: boolean;
  fieldErrors?: Record<string, string>;
}

export async function saveService(
  serviceId: string | null,
  data: { title: string; description: string; image: string }
): Promise<ServiceFormState> {
  const session = await auth();
  if (!session?.user) return { success: false };

  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  if (serviceId) {
    await prisma.service.update({
      where: { id: serviceId },
      data: { ...parsed.data, image: parsed.data.image || null },
    });
  } else {
    const count = await prisma.service.count();
    await prisma.service.create({
      data: { ...parsed.data, image: parsed.data.image || null, sortOrder: count },
    });
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");

  return { success: true };
}

export async function deleteService(serviceId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.service.delete({ where: { id: serviceId } });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function toggleServicePublish(serviceId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new Error("Not found");

  await prisma.service.update({
    where: { id: serviceId },
    data: { published: !service.published },
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}
