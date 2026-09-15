import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 border border-dashed border-line bg-white">
      <div className="w-12 h-12 flex items-center justify-center bg-stone-100 text-stone-500 mb-5">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-medium text-stone-900 mb-1.5">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
