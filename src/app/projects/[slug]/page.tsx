import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectGallery } from "@/components/public/ProjectGallery";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import {
  getProjectBySlug,
  getRelatedProjects,
} from "@/lib/data/projects";
import { getCompanyContent } from "@/lib/data/content";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.slice(0, 160),
      images: project.coverImage ? [{ url: project.coverImage }] : [],
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [related, content] = await Promise.all([
    getRelatedProjects(project.categoryId, project.id),
    getCompanyContent(),
  ]);

  const stats = [
    { label: "Location", value: project.location },
    { label: "Category", value: project.category.name },
    { label: "Status", value: <StatusBadge status={project.status} /> },
    { label: "Year", value: String(project.year) },
    ...(project.builtUpArea ? [{ label: "Built-up Area", value: project.builtUpArea }] : []),
    ...(project.floors ? [{ label: "Floors", value: project.floors }] : []),
    ...(project.duration ? [{ label: "Duration", value: project.duration }] : []),
  ];

  return (
    <>
      <Navbar transparent />

      {/* HERO */}
      <section className="relative h-[78vh] min-h-[540px]">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-14 left-6 right-6 md:left-16 md:right-16 text-white">
          <div className="text-[13px] text-stone-300 mb-3">
            <Link href="/projects" className="hover:text-white">Projects</Link>
            {" / "}
            {project.category.name}
          </div>
          <h1 className="font-serif text-[38px] md:text-[54px]">{project.title}</h1>
        </div>
      </section>

      {/* BODY */}
      <section className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-14 md:gap-20 px-6 md:px-16 py-16 md:py-20">
        <div>
          <h2 className="font-serif text-2xl text-stone-900 mb-5">About this project</h2>
          <div className="text-stone-700 text-[15.5px] leading-relaxed space-y-4 max-w-[62ch] whitespace-pre-line">
            {project.description}
          </div>

          {project.additionalInfo && (
            <>
              <h2 className="font-serif text-2xl text-stone-900 mt-12 mb-5">
                Additional information
              </h2>
              <div className="text-stone-700 text-[15.5px] leading-relaxed space-y-4 max-w-[62ch] whitespace-pre-line">
                {project.additionalInfo}
              </div>
            </>
          )}
        </div>

        <div className="border border-line p-8 h-fit">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex justify-between items-center py-3.5 border-b border-line last:border-b-0 text-sm"
            >
              <span className="text-stone-500">{stat.label}</span>
              <span className="text-stone-900 font-medium text-right">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA BANNER */}
      <section className="mx-6 md:mx-16 mb-16 md:mb-20 bg-teal-900 text-white px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="font-serif text-xl mb-1">Interested in a similar project?</div>
          <p className="text-teal-100/80 text-sm">
            Get in touch to discuss your requirements with our team.
          </p>
        </div>
        <Button href="/contact" variant="primary" className="bg-cream text-teal-900 hover:bg-white shrink-0">
          Contact Us
        </Button>
      </section>

      {/* GALLERY */}
      {project.images.length > 0 && (
        <section className="px-6 md:px-16 pb-24 md:pb-32">
          <h2 className="font-serif text-2xl text-stone-900 mb-8">Project gallery</h2>
          <ProjectGallery
            images={project.images.map((img) => ({
              id: img.id,
              imageUrl: img.imageUrl,
              altText: img.altText,
            }))}
          />
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="px-6 md:px-16 pb-24 md:pb-32 border-t border-line pt-16">
          <h2 className="font-serif text-2xl text-stone-900 mb-10">Related projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} size="sm" />
            ))}
          </div>
        </section>
      )}

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
