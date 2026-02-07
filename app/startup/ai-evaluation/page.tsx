"use client";

import { StartupShell } from "@/components/startup/startup-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Clock, Eye } from "lucide-react";

type EvaluationItem = {
  score: string;
  date: string;
  time: string;
  description: string;
  progress: number;
  note?: string;
};

const evaluations: EvaluationItem[] = [
  {
    score: "85/100",
    date: "2026-02-04",
    time: "10:30",
    description: "Strong potential in AI/ML market with solid technical foundation and clear product-market fit. Team expertise is impressive with successful track record.",
    progress: 85,
  },
  {
    score: "78/100",
    date: "2026-01-20",
    time: "14:15",
    description: "Good foundation but needs improvement in go-to-market strategy. Product is promising but requires more user validation.",
    progress: 78,
    note: "Sản phẩm đầy hứa hẹn nhưng đội hỏi nhiều sự xác nhận của người dùng hơn.",
  },
];

export default function StartupAIEvaluationPage() {
  return (
    <StartupShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Evaluation</h1>
            <p className="text-slate-600">Đánh giá AI về tiềm năng startup của bạn</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Evaluation
          </Button>
        </div>

        <div className="space-y-6">
          {evaluations.map((evaluation, index) => (
            <Card key={index} className="border-slate-200 overflow-hidden">
              <CardContent className="p-0">
                {/* Progress Bar */}
                <div className="relative h-2 bg-slate-100">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${evaluation.progress}%` }}
                  ></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        {evaluation.score}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{evaluation.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{evaluation.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                      <Eye className="w-4 h-4 mr-2" />
                      View Detail
                    </Button>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    {evaluation.description}
                  </p>

                  {evaluation.note && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-slate-700">{evaluation.note}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StartupShell>
  );
}


