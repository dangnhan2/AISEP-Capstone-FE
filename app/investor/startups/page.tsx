"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MessageCircle, Search } from "lucide-react";

type StartupItem = {
  name: string;
  description: string;
  sector: string;
  stage: string;
  score: number;
};

const startups: StartupItem[] = [
  {
    name: "AI Vision Tech",
    description: "Giải pháp AI cho nhận diện hình ảnh và video",
    sector: "Computer Vision",
    stage: "Seed",
    score: 88,
  },
  {
    name: "FinNext Solutions",
    description: "Nền tảng thanh toán và quản lý tài chính thông minh",
    sector: "Fintech",
    stage: "Series A",
    score: 85,
  },
];

export default function InvestorStartupsPage() {
  return (
    <InvestorShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Khám phá Startup</h1>
          <p className="text-slate-600">
            Tìm kiếm và phân tích startup tiềm năng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4">
          <div className="col-span-1">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm kiếm startup..."
                className="h-11 pl-9"
              />
            </div>
          </div>

          <div>
            <select className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option>Tất cả lĩnh vực</option>
              <option>AI & Machine Learning</option>
              <option>Fintech</option>
              <option>HealthTech</option>
              <option>ClimateTech</option>
            </select>
          </div>

          <div>
            <select className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option>Tất cả giai đoạn</option>
              <option>Pre-seed</option>
              <option>Seed</option>
              <option>Series A</option>
              <option>Series B+</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {startups.map((startup) => (
            <Card
              key={startup.name}
              className="overflow-hidden border-slate-200 shadow-[0_20px_40px_-24px_rgba(79,70,229,0.45)]"
            >
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 px-6 pt-5 pb-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">
                        {startup.name}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                        Đã xác thực
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {startup.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-0"
                      >
                        {startup.sector}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-fuchsia-50 text-fuchsia-700 border-0"
                      >
                        {startup.stage}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-4">
                    <div className="flex items-center gap-2 md:flex-col md:items-end">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 text-white shadow-lg">
                        <div className="text-center leading-tight">
                          <div className="text-xl font-semibold">
                            {startup.score}
                          </div>
                          <div className="text-[10px] uppercase tracking-wide">
                            AI Score
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-slate-200"
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-slate-200"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-5">
                  <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white font-medium shadow-md hover:from-blue-600 hover:to-fuchsia-600">
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </InvestorShell>
  );
}


