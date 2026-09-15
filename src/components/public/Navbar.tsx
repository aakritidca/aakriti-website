import Link from "next/link";
import { MobileNav } from "./MobileNav";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  return (
    <header
      className={
        transparent
          ? "absolute top-0 left-0 right-0 z-20"
          : "relative border-b border-line bg-paper"
      }
    >
      <nav className="flex items-center justify-between px-6 md:px-16 py-6 md:py-7">
        <Link
          href="/"
          className={
            "font-serif text-lg md:text-xl tracking-tight " +
            (transparent ? "text-white" : "text-stone-900")
          }
        >
          AAKRITI{" "}
          <span className={transparent ? "text-cream" : "text-teal-600"}>·</span>{" "}
          <span className="hidden sm:inline">DESIGNS &amp; CONSTRUCTIONS</span>
        </Link>
        <div className="hidden md:flex items-center gap-11">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "text-[14.5px] transition-colors " +
                (transparent
                  ? "text-white/90 hover:text-white"
                  : "text-stone-700 hover:text-stone-900")
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={
              "border px-5 py-2.5 text-sm transition-colors " +
              (transparent
                ? "border-white/60 text-white hover:bg-white/10"
                : "border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white")
            }
          >
            Get in touch
          </Link>
        </div>
        <MobileNav transparent={transparent} links={links} />
      </nav>
    </header>
  );
}
