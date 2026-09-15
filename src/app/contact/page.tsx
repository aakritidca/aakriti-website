import { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ContactForm } from "./ContactForm";
import { getCompanyContent } from "@/lib/data/content";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Aakriti Designs & Constructions — call, email, or send us a message about your project.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const content = await getCompanyContent();

  return (
    <>
      <Navbar />

      <section className="px-6 md:px-16 py-16 md:py-20 border-b border-line">
        <h1 className="font-serif text-[36px] md:text-[46px] text-stone-900 mb-3">
          Get in touch
        </h1>
        <p className="text-stone-600 text-[15px] max-w-[60ch]">
          Have a project in mind? Reach out to us for inquiries, project
          discussions, or general questions.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-14 px-6 md:px-16 py-16 md:py-20">
        <div>
          <h2 className="font-serif text-2xl text-stone-900 mb-7">
            Contact information
          </h2>
          <div className="space-y-6">
            <ContactRow icon={MapPin} label="Address" value={content.address} />
            <ContactRow icon={Phone} label="Phone" value={content.phone} href={`tel:${content.phone.replace(/\s/g, "")}`} />
            <ContactRow icon={Mail} label="Email" value={content.email} href={`mailto:${content.email}`} />
            <ContactRow icon={Clock} label="Business Hours" value={content.businessHours} />
            <ContactRow
              icon={InstagramIcon}
              label="Instagram"
              value={`@${content.instagramHandle}`}
              href={`https://instagram.com/${content.instagramHandle}`}
            />
          </div>

          {content.mapEmbedUrl ? (
            <div className="mt-10 aspect-video border border-line">
              <iframe
                src={content.mapEmbedUrl}
                className="w-full h-full"
                loading="lazy"
                title="Office location map"
              />
            </div>
          ) : (
            <div className="mt-10 aspect-video border border-line bg-stone-100 flex items-center justify-center text-stone-500 text-sm">
              Map location coming soon
            </div>
          )}
        </div>

        <div>
          <h2 className="font-serif text-2xl text-stone-900 mb-7">
            Send us a message
          </h2>
          <ContactForm />
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

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-4 items-start">
      <div className="w-9 h-9 flex items-center justify-center bg-stone-100 text-teal-700 shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-[12.5px] text-stone-500 mb-0.5">{label}</div>
        <div className="text-[14.5px] text-stone-900">{value}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block hover:opacity-75 transition-opacity">
        {content}
      </a>
    );
  }
  return content;
}
