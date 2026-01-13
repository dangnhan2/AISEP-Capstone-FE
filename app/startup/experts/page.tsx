"use client";

import { StartupShell } from "@/components/startup/startup-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type Expert = {
  name: string;
  initial: string;
  field: string;
  rating: number;
  sessions: number;
};

type Consultation = {
  expertName: string;
  time: string;
  status: "confirmed" | "pending";
};

const experts: Expert[] = [
  {
    name: "Nguyễn Văn A",
    initial: "N",
    field: "AI & Technology",
    rating: 4.8,
    sessions: 50,
  },
  {
    name: "Trần Thị B",
    initial: "T",
    field: "Business Strategy",
    rating: 4.9,
    sessions: 75,
  },
  {
    name: "Lê Văn C",
    initial: "L",
    field: "Legal & IP",
    rating: 4.7,
    sessions: 40,
  },
];

const consultations: Consultation[] = [
  {
    expertName: "Nguyễn Văn A",
    time: "20/12/2024 lúc 14:00",
    status: "confirmed",
  },
  {
    expertName: "Trần Thị B",
    time: "18/12/2024 lúc 10:00",
    status: "pending",
  },
];

export default function StartupInvestorsPage() {
  return (
    <StartupShell>
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Chuyên gia Tư vấn</h1>
            <p className="text-slate-600">Tìm kiếm và kết nối với chuyên gia</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Tìm chuyên gia
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <Card key={expert.name} className="border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-2xl font-semibold">
                    {expert.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{expert.name}</p>
                    <p className="text-sm text-slate-600">{expert.field}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {expert.rating}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{expert.sessions} buổi</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Gửi yêu cầu tư vấn
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Lịch tư vấn của tôi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultations.map((item) => (
              <div
                key={item.expertName + item.time}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.expertName}</p>
                  <p className="text-sm text-slate-600">{item.time}</p>
                </div>
                <span
                  className={
                    item.status === "confirmed"
                      ? "inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                      : "inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
                  }
                >
                  {item.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </StartupShell>
  );
}


