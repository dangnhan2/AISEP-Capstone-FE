"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

type WatchlistItem = {
  name: string;
  sector: string;
  aiScore: number;
  trend: "up" | "flat" | "down";
  updatedAt: string;
};

const watchlist: WatchlistItem[] = [
  {
    name: "AI Vision Tech",
    sector: "Computer Vision",
    aiScore: 88,
    trend: "up",
    updatedAt: "Cập nhật: 2 giờ trước",
  },
  {
    name: "FinNext Solutions",
    sector: "Fintech",
    aiScore: 85,
    trend: "flat",
    updatedAt: "Cập nhật: 1 ngày trước",
  },
  {
    name: "HealthAI Pro",
    sector: "Healthcare",
    aiScore: 82,
    trend: "down",
    updatedAt: "Cập nhật: 3 ngày trước",
  },
];

function TrendBadge({ trend }: { trend: WatchlistItem["trend"] }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
        <ArrowUpRight className="w-3 h-3" />
        Tăng
      </span>
    );
  }

  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
        <ArrowDownRight className="w-3 h-3" />
        Giảm
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
      Không đổi
    </span>
  );
}

export default function InvestorWatchlistPage() {
  return (
    <InvestorShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Danh sách theo dõi</h1>
            <p className="text-slate-600">Startup bạn quan tâm</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            So sánh
          </Button>
        </div>

        <div className="space-y-4">
          {watchlist.map((item) => (
            <Card
              key={item.name}
              className="border-slate-200 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]"
            >
              <CardContent className="px-6 py-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-600">{item.sector}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-700">
                      <span className="inline-flex items-center gap-1 text-xs md:text-sm">
                        <Badge
                          variant="outline"
                          className="mr-1 border-slate-300 text-slate-700 bg-white px-2 py-0.5 text-[11px] md:text-xs"
                        >
                          AI Score: {item.aiScore}
                        </Badge>
                      </span>
                      <TrendBadge trend={item.trend} />
                      <span className="text-xs text-slate-500 md:text-sm">
                        {item.updatedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    <Button className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium px-4">
                      Gửi đề nghị
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-800 text-sm font-medium px-4"
                    >
                      Chi tiết
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </InvestorShell>
  );
}


