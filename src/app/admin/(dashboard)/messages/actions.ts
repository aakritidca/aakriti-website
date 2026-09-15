"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function revalidateMessages() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function setMessageRead(messageId: string, read: boolean) {
  await requireAdminSession();
  await prisma.contactMessage.update({ where: { id: messageId }, data: { read } });
  revalidateMessages();
}

export async function markAllRead() {
  await requireAdminSession();
  await prisma.contactMessage.updateMany({ where: { read: false }, data: { read: true } });
  revalidateMessages();
}

export async function deleteMessage(messageId: string) {
  await requireAdminSession();
  await prisma.contactMessage.delete({ where: { id: messageId } });
  revalidateMessages();
}
