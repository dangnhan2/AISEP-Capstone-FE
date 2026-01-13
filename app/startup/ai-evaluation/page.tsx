"use client";

import { StartupShell } from "@/components/startup/startup-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle2, CircleDot } from "lucide-react";

const strengths = [
  "Team có kinh nghiệm trong lĩnh vực AI",
  "Sản phẩm có tính năng độc đáo",
  "Thị trường tiềm năng lớn",
];

const improvements = [
  "Cần mở rộng mạng lưới khách hàng",
  "Tối ưu hóa chi phí vận hành",
  "Cần chiến lược marketing rõ ràng hơn",
];

export default function StartupAIEvaluationPage() {
  return (
    <StartupShell>
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Đánh giá AI</h1>
            <p className="text-slate-600">
              Phân tích tiềm năng startup bằng trí tuệ nhân tạo
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Yêu cầu đánh giá mới
          </Button>
        </div>

        <Card className="overflow-hidden border-0 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-stretch justify-between rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-8 py-8 text-white">
              <div>
                <p className="text-sm font-medium opacity-80">
                  Startup Potential Score
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold">85</span>
                  <span className="text-2xl font-medium opacity-90">/100</span>
                </div>
                <p className="mt-4 text-sm opacity-90">
                  Đánh giá lần cuối: 15/12/2024
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Điểm mạnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {strengths.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-500" />
                  <p className="text-sm text-slate-800">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Cần cải thiện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {improvements.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CircleDot className="mt-0.5 w-4 h-4 text-amber-500" />
                  <p className="text-sm text-slate-800">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Lịch sử đánh giá</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-slate-800">
            <div>
              <p>15/12/2024</p>
              <p className="text-slate-500">Đánh giá gần nhất</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">85/100</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </StartupShell>
  );
}


