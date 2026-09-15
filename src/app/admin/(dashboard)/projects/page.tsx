import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PublishBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { relativeTime } from "@/lib/utils";
import { Plus, FolderPlus } from "lucide-react";
import { ProjectRowActions } from "./ProjectRowActions";

export const metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const where =
    status === "published"
      ? { published: true }
      : status === "draft"
      ? { published: false }
      : {};

  const projects = await prisma.project.findMany({
    where,
    include: { category: true, _count: { select: { images: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-stone-900">Projects</h1>
        <Button href="/admin/projects/new" variant="dark">
          <Plus size={15} /> New Project
        </Button>
      </div>

      <div className="flex gap-2 mb-5">
        <FilterTab href="/admin/projects" active={!status} label="All" />
        <FilterTab href="/admin/projects?status=published" active={status === "published"} label="Published" />
        <FilterTab href="/admin/projects?status=draft" active={status === "draft"} label="Drafts" />
      </div>

      <div className="bg-white border border-line">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderPlus}
            title="No projects found"
            description="Create your first project to see it appear here and on the public website."
            action={<Button href="/admin/projects/new" variant="dark"><Plus size={15}/> New Project</Button>}
          />
        ) : (
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-[12px] text-stone-500 border-b border-line">
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Images</th>
                <th className="px-6 py-3 font-medium">Updated</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-line last:border-b-0 hover:bg-stone-50">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-8 bg-stone-100 shrink-0 overflow-hidden">
                        {project.coverImage && (
                          <Image src={project.coverImage} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-stone-900">{project.title}</div>
                        <div className="text-[12px] text-stone-500">{project.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-stone-600">{project.category.name}</td>
                  <td className="px-6 py-3.5 flex flex-col gap-1.5 items-start">
                    <PublishBadge published={project.published} />
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-3.5 text-stone-600">{project._count.images}</td>
                  <td className="px-6 py-3.5 text-stone-500">{relativeTime(project.updatedAt)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <ProjectRowActions projectId={project.id} published={project.published} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={
        "px-4 py-2 text-[13.5px] border " +
        (active
          ? "bg-stone-900 text-white border-stone-900"
          : "bg-white border-line text-stone-600 hover:border-stone-400")
      }
    >
      {label}
    </Link>
  );
}
