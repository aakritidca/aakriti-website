"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav({
  links,
  transparent,
}: {
  links: { href: string; label: string }[];
  transparent: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className={transparent ? "text-white" : "text-stone-900"}
      >
        <Menu size={26} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-paper flex flex-col">
          <div className="flex items-center justify-between px-6 py-6 border-b border-line">
            <span className="font-serif text-lg">AAKRITI</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={26} />
            </button>
          </div>
          <div className="flex flex-col px-6 py-8 gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-serif text-3xl text-stone-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 border border-stone-900 text-center px-5 py-3 text-sm"
            >
              Get in touch
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
