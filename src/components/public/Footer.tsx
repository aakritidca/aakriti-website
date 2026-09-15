import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";

export function Footer({
  companyName = "Aakriti Designs & Constructions",
  address = "Near HP petrol bunk, Sirsi road, Banavasi",
  phone = "+91 9019373002",
  email = "aakritidca@gmail.com",
  instagramHandle = "aakriti_design_construction_",
}: {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  instagramHandle?: string;
}) {
  return (
    <footer className="bg-teal-950 text-teal-100 border-t border-teal-900">
      <div className="px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-serif text-xl text-white mb-4 inline-block border-b border-gold-500 pb-1.5">AAKRITI</div>
          <p className="text-[14.5px] text-teal-100/70 max-w-sm mb-6 mt-4">
            {companyName} — architecture and construction across Sirsi and
            Banavasi. Designing today, building tomorrow.
          </p>
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[14px] text-teal-100/80 hover:text-white"
          >
            <InstagramIcon size={16} /> @{instagramHandle}
          </a>
        </div>
        <div>
          <div className="text-[13px] text-gold-400 mb-4 tracking-wide">NAVIGATE</div>
          <div className="flex flex-col gap-3 text-[14.5px]">
            <Link href="/projects" className="hover:text-white">Projects</Link>
            <Link href="/services" className="hover:text-white">Services</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <div className="text-[13px] text-gold-400 mb-4 tracking-wide">CONTACT</div>
          <div className="flex flex-col gap-3 text-[14px] text-teal-100/80">
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-start gap-2.5 hover:text-white">
              <Phone size={15} className="mt-0.5 shrink-0" /> {phone}
            </a>
            <a href={`mailto:${email}`} className="flex items-start gap-2.5 hover:text-white">
              <Mail size={15} className="mt-0.5 shrink-0" /> {email}
            </a>
            <span className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0" /> {address}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 md:px-16 py-6 text-[13px] text-teal-100/60">
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </div>
    </footer>
  );
}
