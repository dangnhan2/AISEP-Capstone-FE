"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdvisorHeader } from "@/components/advisor/advisor-header";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  FileText,
  Star,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/advisor" },
  { label: "Hồ sơ", icon: User, href: "/advisor/profile" },
  { label: "Yêu cầu tư vấn", icon: MessageSquare, href: "/advisor/requests" },
  { label: "Lịch tư vấn", icon: Calendar, href: "/advisor/schedule" },
  { label: "Báo cáo", icon: FileText, href: "/advisor/reports" },
  { label: "Đánh giá", icon: Star, href: "/advisor/feedback" },
];

type AdvisorShellProps = {
  children: React.ReactNode;
};

export function AdvisorShell({ children }: AdvisorShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/advisor") return pathname === "/advisor";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <aside className="w-64 bg-[#1e3a5f] h-screen flex flex-col">
        <div className="p-6 pb-4">
          <h1 className="text-white text-xl font-semibold tracking-wide">AISEP</h1>
        </div>
        <nav className="px-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors relative",
                  active
                    ? "bg-[#2a4a6f] text-white"
                    : "text-white hover:bg-[#253d5a]"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4a9eff] rounded-l-md" />
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdvisorHeader />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

