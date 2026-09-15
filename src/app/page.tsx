import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getCompanyContent, getPublishedServices } from "@/lib/data/content";
import { ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [content, featuredProjects, services] = await Promise.all([
    getCompanyContent(),
    getFeaturedProjects(4),
    getPublishedServices(),
  ]);

  const heroLines = content.heroHeadline.split("\n");

  return (
    <>
      <Navbar transparent />

      {/* HERO */}
      <section className="relative h-[92vh] min-h-[640px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=80"
          alt="Aakriti Designs & Constructions — recent project"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <div className="relative z-10 w-full px-6 md:px-16 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <h1 className="font-serif text-white text-[40px] leading-[1.05] md:text-[72px] md:leading-[1.02] max-w-2xl">
            {heroLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <div className="max-w-sm">
            <p className="text-stone-300 text-[15px] mb-6">{content.heroSubtext}</p>
            <div className="flex gap-3.5">
              <Button href="/projects" variant="primary">
                View Projects
              </Button>
              <Button href="/contact" variant="ghost">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 px-6 md:px-16 py-20 md:py-32 items-center">
        <div>
          <div className="text-[13px] text-teal-600 font-medium mb-5 tracking-wide">
            WHO WE ARE
          </div>
          <h2 className="font-serif text-[28px] md:text-[38px] leading-tight mb-7 text-stone-900">
            Building plans, drawings, and full construction — under one roof.
          </h2>
          <div className="text-stone-700 text-[15.5px] space-y-4 max-w-[52ch]">
            <p>{content.about || `${content.companyName} is an architecture and construction practice based in Banavasi, working across Sirsi and the surrounding region. We handle a project from its first sketch through to handover: building plans, architectural drawings, 3D elevation, interiors, and site supervision.`}</p>
            <p>
              Every project is led directly by our principal architect and
              engineer, keeping design intent and site execution tightly
              connected from day one.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-10 max-w-md">
            <Stat value={`${content.projectsCompleted}+`} label="Projects delivered" />
            <Stat value={`${content.yearsExperience}+`} label="Years practicing" />
            <Stat value={`${services.length}`} label="Service disciplines" />
            <Stat value="100%" label="Owner-supervised sites" />
          </div>
        </div>
        <div className="relative h-[420px] md:h-[540px]">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80"
            alt="Construction site supervised by Aakriti"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="px-6 md:px-16 pb-24 md:pb-36">
          <div className="flex items-end justify-between mb-12 md:mb-14">
            <h2 className="font-serif text-[28px] md:text-[36px] text-stone-900">
              Selected projects
            </h2>
            <Link
              href="/projects"
              className="hidden sm:flex items-center gap-1.5 text-[14.5px] text-stone-700 border-b border-stone-500 pb-0.5 hover:text-stone-900 hover:border-stone-900"
            >
              View all projects <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {featuredProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                size={i === 0 ? "lg" : "md"}
              />
            ))}
          </div>
          <Link
            href="/projects"
            className="sm:hidden mt-8 flex items-center gap-1.5 text-[14.5px] text-stone-700 border-b border-stone-500 pb-0.5 w-fit"
          >
            View all projects <ArrowRight size={15} />
          </Link>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-6 md:px-16 py-24 md:py-32 bg-sand-100">
          <div className="max-w-2xl mb-14">
            <div className="text-[13px] text-teal-600 font-medium mb-4 tracking-wide">
              WHAT WE DO
            </div>
            <h2 className="font-serif text-[28px] md:text-[36px] text-stone-900">
              Our services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
            {services.slice(0, 6).map((service) => (
              <div key={service.id} className="bg-sand-100 p-8">
                <h3 className="font-serif text-xl text-stone-900 mb-2.5">
                  {service.title}
                </h3>
                <p className="text-[14px] text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Button href="/services" variant="outline">
              View all services
            </Button>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-28 md:py-40 px-6 text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1800&q=80"
          alt="Skyline"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-teal-950/80" />
        <div className="relative z-10">
          <h2 className="font-serif text-white text-[30px] md:text-[42px] mb-8 max-w-2xl mx-auto">
            Let&apos;s create something extraordinary together.
          </h2>
          <Button href="/contact" variant="primary" size="lg">
            Contact Us
          </Button>
        </div>
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-[32px] text-stone-900 leading-none mb-1.5">
        {value}
      </div>
      <div className="text-[13px] text-stone-500">{label}</div>
    </div>
  );
}
