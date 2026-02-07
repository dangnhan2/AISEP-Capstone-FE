"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Sparkles, DollarSign } from "lucide-react";
import { StartupShell } from "@/components/startup/startup-shell";
import { Badge } from "@/components/ui/badge";

type StatCard = {
  label: string;
  value: string | number;
  sublabel: string;
  icon: React.ElementType;
  iconColor: string;
  trend?: string;
  trendColor?: string;
};

type ConsultationItem = {
  name: string;
  role: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending";
  avatarColor: string;
  avatarLetter: string;
};

type AIScore = {
  label: string;
  score: number;
  color: string;
};

const statCards: StatCard[] = [
  { 
    label: "Yêu cầu tư vấn", 
    value: 12, 
    sublabel: "Tổng số yêu cầu",
    icon: Calendar, 
    iconColor: "bg-blue-50 text-blue-600" 
  },
  { 
    label: "Đã chấp nhận", 
    value: 8, 
    sublabel: "+2 tuần này",
    icon: CheckCircle, 
    iconColor: "bg-green-50 text-green-600",
    trend: "+2 tuần này",
    trendColor: "text-green-600"
  },
  { 
    label: "AI Score", 
    value: "85/100", 
    sublabel: "Đánh giá gần nhất",
    icon: Sparkles, 
    iconColor: "bg-purple-50 text-purple-600" 
  },
  { 
    label: "Investors quan tâm", 
    value: 15, 
    sublabel: "+5 tháng này",
    icon: DollarSign, 
    iconColor: "bg-orange-50 text-orange-600",
    trend: "+5 tháng này",
    trendColor: "text-orange-600"
  },
];

const consultations: ConsultationItem[] = [
  { 
    name: "Nguyễn Văn A", 
    role: "Product Strategy", 
    date: "2026-02-06", 
    time: "14:00",
    status: "Confirmed",
    avatarColor: "bg-blue-500",
    avatarLetter: "N"
  },
  { 
    name: "Trần Thị B", 
    role: "Marketing & Growth", 
    date: "2026-02-08", 
    time: "10:00",
    status: "Confirmed",
    avatarColor: "bg-purple-500",
    avatarLetter: "T"
  },
  { 
    name: "Lê Văn C", 
    role: "Fundraising", 
    date: "2026-02-10", 
    time: "16:00",
    status: "Pending",
    avatarColor: "bg-green-500",
    avatarLetter: "L"
  },
];

const aiScores: AIScore[] = [
  { label: "Market Potential", score: 90, color: "bg-pink-500" },
  { label: "Team Strength", score: 85, color: "bg-purple-500" },
  { label: "Product Innovation", score: 88, color: "bg-pink-600" },
  { label: "Business Model", score: 78, color: "bg-purple-600" },
];

export default function StartupDashboardPage() {
  return (
    <StartupShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Tổng quan hoạt động của startup</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.label} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.iconColor}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{card.value}</p>
                  {card.trend && (
                    <p className={`text-sm ${card.trendColor}`}>{card.trend}</p>
                  )}
                  {!card.trend && (
                    <p className="text-sm text-slate-500">{card.sublabel}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Consultations */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Cuộc tư vấn sắp diễn ra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultations.map((consultation, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0 border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${consultation.avatarColor} text-white flex items-center justify-center text-lg font-semibold`}>
                    {consultation.avatarLetter}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{consultation.name}</p>
                    <p className="text-sm text-slate-500">{consultation.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-900">{consultation.date} • {consultation.time}</p>
                  </div>
                  <Badge 
                    variant={consultation.status === "Confirmed" ? "default" : "secondary"}
                    className={consultation.status === "Confirmed" 
                      ? "bg-green-100 text-green-700 hover:bg-green-100" 
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                    }
                  >
                    {consultation.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Evaluation Results */}
        <Card className="border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg font-semibold text-slate-900">Kết quả đánh giá AI gần nhất</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Score and Description */}
              <div className="flex flex-col">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                  85/100
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Your startup shows strong potential in AI/ML market with solid technical foundation and clear product-market fit. Team expertise is impressive.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>2026-02-04</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⏰</span>
                    <span>10:30 AM</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Metrics */}
              <div className="space-y-4">
                {aiScores.map((score) => (
                  <div key={score.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{score.label}</span>
                      <span className="text-sm font-bold text-slate-900">{score.score}/100</span>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${score.color}`} 
                        style={{ width: `${score.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StartupShell>
  );
}

