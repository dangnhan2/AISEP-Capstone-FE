"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StartupHeader } from "@/components/startup/startup-header";
import { Button } from "@/components/ui/button";
import {
  Bell,
  FileText,
  LayoutDashboard,
  Sparkles,
  User,
  Users,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/startup" },
  { label: "Hồ sơ", icon: User, href: "/startup/profile" },
  { label: "Tài liệu & IP", icon: FileText, href: "/startup/documents" },
  { label: "Đánh giá AI", icon: Sparkles, href: "/startup/ai-evaluation" },
  { label: "Chuyên gia", icon: UserCheck, href: "/startup/experts" },
  { label: "Nhà đầu tư", icon: Users, href: "/startup/investors" },
  { label: "Thông báo", icon: Bell, href: "/startup/notifications" },
];

type StartupShellProps = {
  children: React.ReactNode;
};

export function StartupShell({ children }: StartupShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/startup") return pathname === "/startup";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StartupHeader />
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-68px)] flex flex-col">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    active
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="mt-auto p-3">
            <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Pro Tip</span>
              </div>
              <p className="text-sm text-slate-600">
                Sử dụng AI để phân tích và cải thiện hồ sơ của bạn
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

