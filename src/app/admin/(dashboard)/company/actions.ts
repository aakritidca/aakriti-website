"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCompanyContent(data: {
  companyName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  about: string;
  mission: string;
  vision: string;
  values: string;
  yearsExperience: number;
  projectsCompleted: number;
  address: string;
  phone: string;
  email: string;
  instagramHandle: string;
  businessHours: string;
  mapEmbedUrl: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.companyContent.upsert({
    where: { id: "main" },
    create: { id: "main", ...data, mapEmbedUrl: data.mapEmbedUrl || null },
    update: { ...data, mapEmbedUrl: data.mapEmbedUrl || null },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/projects");
  revalidatePath("/admin/company");

  return { success: true };
}
