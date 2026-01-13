"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Sparkles, TrendingUp, FileText, UserCheck } from "lucide-react";
import { StartupShell } from "@/components/startup/startup-shell";

type StatCard = {
  label: string;
  value: string;
  icon: React.ElementType;
  accent: string;
};

type ActivityItem = {
  icon: React.ElementType;
  color: string;
  text: string;
  time: string;
};

const statCards: StatCard[] = [
  { label: "AI Score", value: "85/100", icon: Sparkles, accent: "bg-blue-50 text-blue-600" },
  { label: "Tài liệu", value: "12", icon: FileText, accent: "bg-purple-50 text-purple-600" },
  { label: "Buổi tư vấn", value: "5", icon: ShieldCheck, accent: "bg-green-50 text-green-600" },
  { label: "Nhà đầu tư quan tâm", value: "8", icon: TrendingUp, accent: "bg-pink-50 text-pink-600" },
];

const activities: ActivityItem[] = [
  { icon: Sparkles, color: "text-blue-600 bg-blue-50", text: "Báo cáo AI mới đã sẵn sàng", time: "2 giờ trước" },
  { icon: ShieldCheck, color: "text-green-600 bg-green-50", text: "Tài liệu đã được xác thực trên blockchain", time: "5 giờ trước" },
  { icon: TrendingUp, color: "text-purple-600 bg-purple-50", text: "Nhà đầu tư XYZ đã gửi lời đề nghị", time: "1 ngày trước" },
  { icon: UserCheck, color: "text-emerald-600 bg-emerald-50", text: "Buổi tư vấn đã hoàn thành", time: "2 ngày trước" },
];

export default function StartupDashboardPage() {
  return (
    <StartupShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tổng quan</h1>
          <p className="text-slate-600 mt-1">Theo dõi hoạt động và tiến độ của startup</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.label} className="border-slate-200">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.accent}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{card.label}</p>
                  <p className="text-2xl font-semibold">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <div key={activity.text} className="flex items-start gap-3 py-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{activity.text}</p>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </StartupShell>
  );
}

