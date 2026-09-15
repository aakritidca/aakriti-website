import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "./CategoriesManager";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role === "EDITOR") redirect("/admin");

  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="text-xl font-semibold text-stone-900 mb-8">Settings</h1>
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
