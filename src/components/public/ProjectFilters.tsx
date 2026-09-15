"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

export function ProjectFilters({
  categories,
}: {
  categories: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const activeCategory = searchParams.get("category") ?? "";
  const activeStatus = searchParams.get("status") ?? "";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/projects?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: search || null });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 md:px-16 py-7 border-b border-line">
      <FilterChip
        active={activeCategory === ""}
        onClick={() => updateParams({ category: null })}
      >
        All
      </FilterChip>
      {categories.map((cat) => (
        <FilterChip
          key={cat.slug}
          active={activeCategory === cat.slug}
          onClick={() => updateParams({ category: cat.slug })}
        >
          {cat.name}
        </FilterChip>
      ))}

      <select
        value={activeStatus}
        onChange={(e) => updateParams({ status: e.target.value || null })}
        className="border border-line px-3.5 py-2 text-[13.5px] text-stone-700 bg-white ml-1"
      >
        <option value="">All Status</option>
        <option value="COMPLETED">Completed</option>
        <option value="ONGOING">Ongoing</option>
        <option value="UPCOMING">Upcoming</option>
      </select>

      <form onSubmit={handleSearchSubmit} className="ml-auto flex items-center gap-2 border border-line px-3.5 py-2 min-w-[220px]">
        <Search size={15} className="text-stone-500 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="text-[13.5px] outline-none bg-transparent w-full text-stone-700 placeholder:text-stone-500"
        />
      </form>

      {isPending && <span className="text-xs text-stone-500">Updating…</span>}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "border px-4.5 py-2 text-[13.5px] transition-colors " +
        (active
          ? "bg-stone-900 text-white border-stone-900"
          : "border-line text-stone-700 hover:border-stone-500")
      }
    >
      {children}
    </button>
  );
}
