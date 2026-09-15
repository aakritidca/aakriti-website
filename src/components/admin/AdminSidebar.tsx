"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Images,
  Inbox,
  Wrench,
  Building,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/company", label: "Company Info", icon: Building },
  { href: "/admin/users", label: "Users", icon: Users, restrictedFromEditor: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, restrictedFromEditor: true },
];

export function AdminSidebar({ role, unreadMessages = 0 }: { role: string; unreadMessages?: number }) {
  const pathname = usePathname();

  return (
    <aside className="bg-teal-950 text-teal-100 w-60 shrink-0 flex flex-col justify-between min-h-screen">
      <div className="px-5 py-7">
        <div className="font-serif text-white text-lg mb-10 px-2">Aakriti CMS</div>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            if (item.restrictedFromEditor && role === "EDITOR") return null;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-teal-100/70 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={16} />
                {item.label}
                {item.href === "/admin/messages" && unreadMessages > 0 && (
                  <span className="ml-auto bg-teal-600 text-white text-[11px] font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadMessages > 99 ? "99+" : unreadMessages}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="px-5 py-6 border-t border-white/10">
        <div className="flex items-center gap-2 px-2 mb-3">
          <Images size={13} className="text-teal-100/40" />
          <span className="text-[12px] text-teal-100/60">Role: {role.replace("_", " ")}</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] text-teal-100/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
