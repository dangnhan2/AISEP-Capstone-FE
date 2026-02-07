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
  { label: "Dashboard", icon: LayoutDashboard, href: "/startup" },
  { label: "Document & IP", icon: FileText, href: "/startup/documents" },
  { label: "AI Evaluation", icon: Sparkles, href: "/startup/ai-evaluation" },
  { label: "Advisor", icon: UserCheck, href: "/startup/experts" },
  { label: "Investor", icon: Users, href: "/startup/investors" },
  { label: "Consultation Schedule", icon: Bell, href: "/startup/notifications" },
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-64 bg-white min-h-screen flex flex-col fixed left-0 top-0 bottom-0 border-r">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900 text-lg font-bold">StartupHub</h1>
            <p className="text-xs text-slate-500">Dashboard</p>
          </div>
        </div>
        
        <nav className="px-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-slate-700 hover:bg-slate-100",
                  active && "bg-blue-600 text-white hover:bg-blue-600"
                )}
              >
                <Link href={item.href}>
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="px-3 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-sm text-blue-900">Pro Tip</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sử dụng AI để phân tích và cải thiện hồ sơ của bạn
            </p>
          </div>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        <StartupHeader />
        <main className="flex-1 p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

