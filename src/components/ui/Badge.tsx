import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "error" | "neutral" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  error: "bg-error-bg text-error",
  neutral: "bg-stone-100 text-stone-700",
  outline: "border border-stone-300 text-stone-700",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] font-medium px-2.5 py-1 tracking-wide",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "COMPLETED" | "ONGOING" | "UPCOMING" }) {
  if (status === "COMPLETED") return <Badge variant="success">Completed</Badge>;
  if (status === "ONGOING") return <Badge variant="warning">Ongoing</Badge>;
  return <Badge variant="outline">Upcoming</Badge>;
}

export function PublishBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge variant="success">Published</Badge>
  ) : (
    <Badge variant="warning">Draft</Badge>
  );
}
