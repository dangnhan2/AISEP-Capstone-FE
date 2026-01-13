"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LayoutDashboard,
  LineChart,
  Search,
  Star,
  User,
  HandCoins,
} from "lucide-react";

import { InvestorHeader } from "@/components/investor/investor-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/investor" },
  { label: "Hồ sơ", icon: User, href: "/investor/profile" },
  { label: "Khám phá startup", icon: Search, href: "/investor/startups" },
  { label: "Danh sách theo dõi", icon: Star, href: "/investor/watchlist" },
  { label: "Đề nghị của tôi", icon: HandCoins, href: "/investor/offers" },
  { label: "Phân tích & xu hướng", icon: LineChart, href: "/investor/analytics" },
];

type InvestorShellProps = {
  children: React.ReactNode;
};

export function InvestorShell({ children }: InvestorShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/investor") return pathname === "/investor";
    return pathname.startsWith(href);
    };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <InvestorHeader />
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
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
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
            <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-emerald-50 to-slate-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <LineChart className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium">Insight</span>
              </div>
              <p className="text-sm text-slate-600">
                Theo dõi điểm tiềm năng và xu hướng của các startup bạn quan tâm.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}


