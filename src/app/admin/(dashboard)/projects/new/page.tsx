import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../ProjectForm";

export const metadata = { title: "New Project" };
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="p-8 md:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-stone-900">New Project</h1>
      </div>
      <div className="bg-white border border-line p-8">
        <ProjectForm categories={categories} />
      </div>
    </div>
  );
}
