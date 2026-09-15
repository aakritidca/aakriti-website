import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center px-6 py-32 md:py-48">
        <div className="font-serif text-[80px] md:text-[120px] text-stone-200 leading-none mb-4">
          404
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3">
          Page not found
        </h1>
        <p className="text-stone-600 mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex gap-3">
          <Button href="/" variant="dark">Back to home</Button>
          <Link href="/projects" className="inline-flex items-center px-6 py-3 text-sm border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors">
            View Projects
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
