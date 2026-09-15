import { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectFilters } from "@/components/public/ProjectFilters";
import { ProjectListCard } from "@/components/public/ProjectCard";
import { Pagination } from "@/components/public/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedProjects, getAllCategories } from "@/lib/data/projects";
import { getCompanyContent } from "@/lib/data/content";
import { FolderSearch } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse completed and ongoing construction and architecture projects by Aakriti Designs & Constructions across Sirsi and Banavasi.",
};

export const revalidate = 60;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const [{ projects, pageCount }, categories, content] = await Promise.all([
    getPublishedProjects({
      category: params.category,
      status: params.status as "COMPLETED" | "ONGOING" | "UPCOMING" | undefined,
      search: params.q,
      page,
    }),
    getAllCategories(),
    getCompanyContent(),
  ]);

  return (
    <>
      <Navbar />
      <section className="px-6 md:px-16 py-16 md:py-20 border-b border-line">
        <h1 className="font-serif text-[36px] md:text-[46px] text-stone-900 mb-3">
          Projects
        </h1>
        <p className="text-stone-600 text-[15px] max-w-[60ch]">
          A record of buildings we have designed, engineered, and constructed
          — residential homes, commercial spaces, and renovations across the
          region.
        </p>
      </section>

      <ProjectFilters categories={categories} />

      <section className="px-6 md:px-16 py-14">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title="No projects match your filters"
            description="Try a different category, status, or search term."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {projects.map((project) => (
              <ProjectListCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          pageCount={pageCount}
          basePath="/projects"
          searchParams={params}
        />
      </section>

      <Footer
        companyName={content.companyName}
        address={content.address}
        phone={content.phone}
        email={content.email}
        instagramHandle={content.instagramHandle}
      />
    </>
  );
}
