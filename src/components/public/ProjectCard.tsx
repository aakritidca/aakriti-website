import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";

export interface ProjectCardData {
  slug: string;
  title: string;
  location: string;
  year: number;
  status: "COMPLETED" | "ONGOING" | "UPCOMING";
  coverImage: string | null;
  category: { name: string };
  description: string;
}

export function ProjectCard({
  project,
  size = "md",
}: {
  project: ProjectCardData;
  size?: "sm" | "md" | "lg";
}) {
  const heightClass =
    size === "lg" ? "h-[440px]" : size === "sm" ? "h-[220px]" : "h-[300px]";

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-stone-100 ${heightClass}`}>
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
            No image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/10 to-transparent">
          <div className="text-[12px] tracking-wide text-stone-300 mb-1.5 uppercase">
            {project.category.name} — {project.location} · {project.year}
          </div>
          <h3 className="font-serif text-white text-xl md:text-2xl">{project.title}</h3>
        </div>
      </div>
    </Link>
  );
}

export function ProjectListCard({ project }: { project: ProjectCardData }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block bg-paper">
      <div className="relative h-64 overflow-hidden bg-stone-100">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-[12px] text-stone-500 mb-1.5">
          <span>{project.category.name}</span>
          <span>·</span>
          <span>{project.location}</span>
          <span>·</span>
          <span>{project.year}</span>
        </div>
        <h3 className="font-serif text-lg text-stone-900 mb-2.5">{project.title}</h3>
        <p className="text-[13.5px] text-stone-500 line-clamp-2 mb-3">
          {project.description}
        </p>
        <StatusBadge status={project.status} />
      </div>
    </Link>
  );
}
