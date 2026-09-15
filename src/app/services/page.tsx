import { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedServices, getCompanyContent } from "@/lib/data/content";
import { Hammer } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Building plans, architectural drawings, 3D elevation, interior design, consultancy, and full construction supervision from Aakriti Designs & Constructions.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [services, content] = await Promise.all([
    getPublishedServices(),
    getCompanyContent(),
  ]);

  return (
    <>
      <Navbar />
      <section className="px-6 md:px-16 py-16 md:py-20 border-b border-line">
        <h1 className="font-serif text-[36px] md:text-[46px] text-stone-900 mb-3">
          Our Services
        </h1>
        <p className="text-stone-600 text-[15px] max-w-[60ch]">
          From the first building plan to final site supervision — a complete
          set of capabilities under one roof.
        </p>
      </section>

      {services.length === 0 ? (
        <div className="px-6 md:px-16 py-16">
          <EmptyState
            icon={Hammer}
            title="Services coming soon"
            description="We're updating this page. Please contact us directly to discuss your project."
            action={<Button href="/contact">Contact Us</Button>}
          />
        </div>
      ) : (
        <section className="px-6 md:px-16 py-16 md:py-20">
          <div className="flex flex-col gap-px bg-line border border-line">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 bg-paper p-8 md:p-12"
              >
                <div className="flex items-center">
                  <div>
                    <div className="text-[13px] text-stone-500 mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-stone-900">
                      {service.title}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {service.image && (
                    <div className="relative w-full md:w-56 h-40 shrink-0 bg-stone-100 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="224px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-stone-700 text-[15px] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 md:px-16 pb-24 md:pb-32">
        <div className="bg-teal-900 text-white px-8 py-14 md:py-16 text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            Not sure which service you need?
          </h2>
          <p className="text-teal-100/80 text-[15px] mb-8 max-w-md mx-auto">
            Tell us about your project and we&apos;ll recommend the right
            starting point.
          </p>
          <Button href="/contact" className="bg-cream text-teal-900 hover:bg-white">
            Get in touch
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
