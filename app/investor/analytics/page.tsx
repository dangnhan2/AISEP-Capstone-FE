"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

type HotSector = {
  name: string;
  startupCount: number;
  changePercent: string;
};

const hotSectors: HotSector[] = [
  { name: "AI & Machine Learning", startupCount: 128, changePercent: "+45%" },
  { name: "Fintech", startupCount: 95, changePercent: "+32%" },
  { name: "Healthcare Tech", startupCount: 67, changePercent: "+28%" },
  { name: "E-commerce", startupCount: 54, changePercent: "+18%" },
];

export default function InvestorAnalyticsPage() {
  return (
    <InvestorShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Phân tích &amp; Xu hướng</h1>
          <p className="text-slate-600">
            Insights từ AI về thị trường startup
          </p>
        </div>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Lĩnh vực đang hot</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 p-0">
            {hotSectors.map((sector) => (
              <div
                key={sector.name}
                className="flex items-center justify-between px-6 py-5"
              >
                <div>
                  <p className="font-medium text-slate-900">{sector.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {sector.startupCount} startup
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-500">
                  {sector.changePercent}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-[0_20px_40px_-24px_rgba(79,70,229,0.6)]">
          <CardContent className="py-6 px-5 md:px-8 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Badge
                variant="outline"
                className="border-transparent bg-white/10 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Gợi ý từ AI
              </Badge>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-4 w-4 rounded-full border border-white/60 flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>
                  3 startup mới trong lĩnh vực AI phù hợp với portfolio của bạn
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-4 w-4 rounded-full border border-white/60 flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>
                  2 startup trong watchlist có cập nhật quan trọng cần xem xét
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </InvestorShell>
  );
}


