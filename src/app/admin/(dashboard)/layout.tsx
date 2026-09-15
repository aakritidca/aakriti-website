import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const unreadMessages = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="flex min-h-screen bg-stone-100 font-sans">
      <AdminSidebar role={session.user.role} unreadMessages={unreadMessages} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
