import slugifyLib from "slugify";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return slugifyLib(input, { lower: true, strict: true, trim: true });
}

export function formatStatus(status: "COMPLETED" | "ONGOING" | "UPCOMING"): string {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "ONGOING":
      return "Ongoing";
    case "UPCOMING":
      return "Upcoming";
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function relativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 30) return formatDate(date);
  if (diffDay >= 1) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  if (diffHr >= 1) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffMin >= 1) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  return "just now";
}
