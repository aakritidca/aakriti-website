import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  pageCount,
  basePath,
  searchParams,
}: {
  currentPage: number;
  pageCount: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  function pageHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-16">
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={
          "w-9 h-9 flex items-center justify-center border border-line " +
          (currentPage === 1 ? "opacity-40 pointer-events-none" : "hover:border-stone-500")
        }
      >
        <ChevronLeft size={16} />
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          className={
            "w-9 h-9 flex items-center justify-center text-[13.5px] border " +
            (page === currentPage
              ? "bg-stone-900 text-white border-stone-900"
              : "border-line text-stone-700 hover:border-stone-500")
          }
        >
          {page}
        </Link>
      ))}
      <Link
        href={pageHref(Math.min(pageCount, currentPage + 1))}
        aria-disabled={currentPage === pageCount}
        className={
          "w-9 h-9 flex items-center justify-center border border-line " +
          (currentPage === pageCount ? "opacity-40 pointer-events-none" : "hover:border-stone-500")
        }
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
