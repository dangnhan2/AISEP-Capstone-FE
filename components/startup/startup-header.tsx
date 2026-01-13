"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Star } from "lucide-react";

type StartupHeaderProps = {
  userName?: string;
  roleLabel?: string;
  avatarLabel?: string;
  onLogout?: () => void;
  className?: string;
};

export function StartupHeader({
  userName = "dëwr",
  roleLabel = "Startup",
  avatarLabel = "D",
  onLogout,
  className,
}: StartupHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-white border-b",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-lg font-semibold">StartupHub</div>
          <div className="text-xs text-slate-500">Dashboard</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-base font-medium">{userName}</span>
        <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
          {roleLabel}
        </span>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-sm font-semibold">
          {avatarLabel}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:text-slate-900"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}

