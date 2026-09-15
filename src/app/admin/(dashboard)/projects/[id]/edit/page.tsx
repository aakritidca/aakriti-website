import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../../ProjectForm";

export const metadata = { title: "Edit Project" };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!project) notFound();

  const initialData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    location: project.location,
    categoryId: project.categoryId,
    year: project.year,
    status: project.status,
    description: project.description,
    additionalInfo: project.additionalInfo ?? "",
    builtUpArea: project.builtUpArea ?? "",
    floors: project.floors ?? "",
    duration: project.duration ?? "",
    published: project.published,
    images: project.images.map((img) => ({
      id: img.id,
      url: img.imageUrl,
      altText: img.altText,
      isCover: img.imageUrl === project.coverImage,
    })),
  };

  return (
    <div className="p-8 md:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-stone-900">Edit Project</h1>
      </div>
      <div className="bg-white border border-line p-8">
        <ProjectForm categories={categories} initialData={initialData} />
      </div>
    </div>
  );
}
