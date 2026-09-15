import { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";
import { getCompanyContent, getPublishedServiceCount } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Aakriti Designs & Constructions — an architecture and construction practice based in Banavasi, serving Sirsi and the surrounding region.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [content, serviceCount] = await Promise.all([
    getCompanyContent(),
    getPublishedServiceCount(),
  ]);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative h-[56vh] min-h-[380px]">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80"
          alt="Aakriti Designs & Constructions team on site"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-end px-6 md:px-16 pb-14">
          <h1 className="font-serif text-white text-[36px] md:text-[54px]">
            Our story
          </h1>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="px-6 md:px-16 py-20 md:py-28 max-w-3xl">
        <div className="text-[13px] text-teal-600 font-medium mb-5 tracking-wide">
          WHO WE ARE
        </div>
        <div className="font-serif text-[24px] md:text-[30px] leading-snug text-stone-900 space-y-6 whitespace-pre-line">
          {content.about ||
            `${content.companyName} is an architecture and construction practice based in Banavasi, serving Sirsi and the surrounding region.\n\nWe believe design and construction shouldn't be handled by separate, disconnected teams — so we keep both under one roof, led directly by our principal architect and engineer.`}
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border-y border-line">
        <ValueBlock
          title="Mission"
          text={
            content.mission ||
            "To deliver architecture and construction that families and businesses can trust — on time, on budget, and built to last."
          }
        />
        <ValueBlock
          title="Vision"
          text={
            content.vision ||
            "To be the region's most trusted name in residential and commercial construction, known for craftsmanship as much as reliability."
          }
        />
        <ValueBlock
          title="Values"
          text={
            content.values ||
            "Transparency in estimation. Accountability on site. Design that respects both budget and ambition."
          }
        />
      </section>

      {/* EXPERIENCE STRIP */}
      <section className="px-6 md:px-16 py-20 md:py-28 grid grid-cols-2 md:grid-cols-4 gap-10">
        <Stat value={`${content.yearsExperience}+`} label="Years practicing" />
        <Stat value={`${content.projectsCompleted}+`} label="Projects delivered" />
        <Stat value={`${serviceCount}`} label="Service disciplines" />
        <Stat value="100%" label="Owner-supervised sites" />
      </section>

      {/* PHOTO + TEAM NOTE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-line">
        <div className="relative h-[380px] md:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1000&q=80"
            alt="Site supervision"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="p-10 md:p-16 flex flex-col justify-center bg-sand-100">
          <div className="text-[13px] text-teal-600 font-medium mb-4 tracking-wide">
            LEADERSHIP
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">
            Veerendra Patil
          </h2>
          <p className="text-stone-600 text-sm mb-1">Engineer · Architect</p>
          <p className="text-stone-700 text-[15px] leading-relaxed mt-4 max-w-md">
            Every Aakriti project is personally overseen from concept to
            handover, ensuring what&apos;s drawn on paper is exactly what gets
            built on site.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-16 py-24 md:py-32 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-8">
          Have a project in mind?
        </h2>
        <Button href="/contact">Contact Us</Button>
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

function ValueBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-paper p-10">
      <h3 className="font-serif text-xl text-stone-900 mb-4">{title}</h3>
      <p className="text-stone-600 text-[14.5px] leading-relaxed">{text}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-[36px] text-stone-900 leading-none mb-2">
        {value}
      </div>
      <div className="text-[13px] text-stone-500">{label}</div>
    </div>
  );
}
