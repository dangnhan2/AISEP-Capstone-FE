"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, User, ChevronDown, Bell } from "lucide-react";

type AdvisorHeaderProps = {
  userName?: string;
  notificationCount?: number;
  className?: string;
};

export function AdvisorHeader({
  userName = "Sarah Johnson",
  notificationCount = 1,
  className,
}: AdvisorHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-white border-b",
        className
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Input
          type="search"
          placeholder="Search offers, startups, or deals..."
          className="pr-10 border-slate-300 text-slate-700 placeholder:text-slate-400"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full w-10 text-slate-400 hover:text-slate-600"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Right side: Notifications, Profile, User Name */}
      <div className="flex items-center gap-6">
        {/* Notification Badge */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-slate-900"
          >
            <Bell className="w-5 h-5" />
          </Button>
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-xs"
            >
              {notificationCount}
            </Badge>
          )}
        </div>

        {/* Profile Icon with Label */}
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#4ECDC4] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs text-slate-600">Profile</span>
        </div>

        {/* User Name with Dropdown */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <span className="text-sm text-slate-600 font-medium">{userName}</span>
          <ChevronDown className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    </header>
  );
}

