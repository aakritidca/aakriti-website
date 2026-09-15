"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
});

export interface UserFormState {
  success: boolean;
  fieldErrors?: Record<string, string>;
  error?: string;
}

async function requireNonEditor() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role === "EDITOR") throw new Error("Forbidden");
  return session;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<UserFormState> {
  await requireNonEditor();

  const parsed = userSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) {
    return { success: false, fieldErrors: { email: "A user with this email already exists." } };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      role: parsed.data.role,
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await requireNonEditor();
  if (session.user.id === userId) {
    throw new Error("You cannot delete your own account.");
  }
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
