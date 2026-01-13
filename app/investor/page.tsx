"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp } from "lucide-react";

type StatCard = {
  label: string;
  value: string;
};

type SuggestedStartup = {
  name: string;
  sector: string;
  stage: string;
  score: number;
};

type ActivityItem = {
  text: string;
  time: string;
};

const statCards: StatCard[] = [
  { label: "Startup theo dõi", value: "24" },
  { label: "Đề nghị đã gửi", value: "8" },
  { label: "Đang đàm phán", value: "3" },
  { label: "Đã đầu tư", value: "5" },
];

const suggestedStartups: SuggestedStartup[] = [
  { name: "AI Vision Tech", sector: "Computer Vision", stage: "Seed", score: 88 },
  { name: "FinNext Solutions", sector: "Fintech", stage: "Series A", score: 85 },
  { name: "HealthAI Pro", sector: "Healthcare", stage: "Seed", score: 82 },
];

const activities: ActivityItem[] = [
  {
    text: "Startup 'Tech ABC' đã cập nhật pitch deck",
    time: "1 giờ trước",
  },
];

export default function InvestorOverviewPage() {
  return (
    <InvestorShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tổng quan</h1>
          <p className="text-slate-600 mt-1">
            Theo dõi hoạt động đầu tư của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.label} className="border-slate-200">
              <CardContent className="p-5">
                <p className="text-sm text-slate-600">{card.label}</p>
                <p className="text-3xl font-semibold mt-1">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="border-slate-200 xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Startup được AI gợi ý</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Dựa trên lịch sử đầu tư và sở thích của bạn
                </p>
              </div>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Xem tất cả
              </button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestedStartups.map((startup) => (
                <div
                  key={startup.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {startup.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {startup.sector}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-700 font-semibold"
                    >
                      {startup.score}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-200 text-slate-700 bg-white"
                  >
                    {startup.stage}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.map((activity, index) => (
                <div key={activity.text} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <p className="text-sm text-slate-900">{activity.text}</p>
                  </div>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                  {index < activities.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-dashed border-slate-200 bg-white/60">
          <CardContent className="py-5 flex items-center gap-4 text-sm text-slate-600">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-slate-900">
                Tối ưu hoá danh mục đầu tư với AI
              </p>
              <p>
                Nhận gợi ý phân bổ vốn và xu hướng ngành dựa trên dữ liệu thị
                trường thời gian thực.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InvestorShell>
  );
}


