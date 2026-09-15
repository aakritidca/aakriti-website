import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PublishBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { relativeTime } from "@/lib/utils";
import { Plus, Building2, CheckCircle2, FileEdit, Images, FolderPlus } from "lucide-react";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [total, published, drafts, imageCount, recentProjects] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.project.count({ where: { published: false } }),
    prisma.projectImage.count(),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { category: true },
    }),
  ]);

  const kpis = [
    { label: "Total Projects", value: total, icon: Building2 },
    { label: "Published", value: published, icon: CheckCircle2 },
    { label: "Drafts", value: drafts, icon: FileEdit },
    { label: "Uploaded Images", value: imageCount, icon: Images },
  ];

  return (
    <div className="p-8 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-stone-900">Dashboard</h1>
        <Button href="/admin/projects/new" variant="dark">
          <Plus size={15} /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-line p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12.5px] text-stone-500">{kpi.label}</span>
              <kpi.icon size={16} className="text-stone-400" />
            </div>
            <div className="text-2xl font-semibold text-stone-900">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-line">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-[15px] font-medium text-stone-900">Recent projects</h2>
          <Link href="/admin/projects" className="text-[13.5px] text-stone-500 hover:text-stone-900">
            View all
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <EmptyState
            icon={FolderPlus}
            title="No projects yet"
            description="Create your first project to see it appear on the public website."
            action={<Button href="/admin/projects/new" variant="dark"><Plus size={15}/> New Project</Button>}
          />
        ) : (
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-[12px] text-stone-500 border-b border-line">
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Updated</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id} className="border-b border-line last:border-b-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-8 bg-stone-100 shrink-0 overflow-hidden">
                        {project.coverImage && (
                          <Image src={project.coverImage} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-stone-900">{project.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-stone-600">{project.category.name}</td>
                  <td className="px-6 py-3">
                    <PublishBadge published={project.published} />
                  </td>
                  <td className="px-6 py-3 text-stone-500">{relativeTime(project.updatedAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-teal-700 hover:text-teal-900">
                      Edit
                    </Link>
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
