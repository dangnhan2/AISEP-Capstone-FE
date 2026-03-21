"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { StartupShell } from "@/components/startup/startup-shell";
import {
  Sparkles, CheckCircle2, XCircle, FileText, ChevronRight,
  ArrowRight, Clock, AlertTriangle, RefreshCw, BarChart3,
  History, FileSearch, Info, ShieldCheck, Loader2, Layout, BookOpen,
  Brain, Target, FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockReports, mockReadiness } from "./mock-data";
import { AIEvaluationStatus } from "./types";

/* ─── Status config ────────────────────────────────────────── */

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  NOT_REQUESTED: { label: "Chưa đánh giá", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", icon: <Info className="w-3.5 h-3.5" /> },
  QUEUED:        { label: "Đang chờ", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: <Clock className="w-3.5 h-3.5" /> },
  VALIDATING:    { label: "Đang xác thực", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  ANALYZING:     { label: "Đang phân tích", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  SCORING:       { label: "Đang chấm điểm", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  GENERATING_REPORT: { label: "Đang tạo báo cáo", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  COMPLETED:     { label: "Hoàn thành", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  FAILED:        { label: "Thất bại", color: "text-red-600", bg: "bg-red-50", border: "border-red-100", icon: <XCircle className="w-3.5 h-3.5" /> },
  INSUFFICIENT_DATA: { label: "Thiếu dữ liệu", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

/* ─── Score Ring ────────────────────────────────────────────── */

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const pct = score / 100;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
        className="transition-all duration-1000" />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        className="rotate-[90deg] origin-center text-[20px] font-black fill-slate-900">{score}</text>
    </svg>
  );
}

/* ─── Onboarding (first-time, no evaluation) ───────────────── */

function OnboardingView({ allReady }: { allReady: boolean }) {
  const router = useRouter();
  const { profile, documents } = mockReadiness;

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-8 md:p-10 overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#eec54e]/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#eec54e]/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#eec54e]/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#eec54e]" />
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-white leading-tight">Đánh giá AI cho Startup</h1>
              <p className="text-[13px] text-slate-400">Khám phá tiềm năng startup của bạn qua lăng kính AI</p>
            </div>
          </div>

          <p className="text-[14px] text-slate-300 leading-relaxed mb-6">
            Hệ thống AI sẽ phân tích hồ sơ startup và tài liệu kinh doanh của bạn để đưa ra
            <span className="text-[#eec54e] font-semibold"> điểm tiềm năng</span>,
            <span className="text-emerald-400 font-semibold"> phân tích điểm mạnh/yếu</span>, và
            <span className="text-blue-400 font-semibold"> khuyến nghị cải thiện</span> — giúp bạn sẵn sàng hơn cho việc gọi vốn.
          </p>

          {allReady ? (
            <button
              onClick={() => router.push("/startup/ai-evaluation/request")}
              className="flex items-center gap-2 h-11 px-6 rounded-xl bg-[#eec54e] text-slate-900 text-[14px] font-bold hover:bg-[#e6b800] transition-all shadow-lg shadow-[#eec54e]/20"
            >
              <Sparkles className="w-4.5 h-4.5" />
              Bắt đầu đánh giá AI
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/startup/startup-profile")}
                className="flex items-center gap-2 h-11 px-6 rounded-xl bg-amber-500/20 text-amber-300 text-[14px] font-bold hover:bg-amber-500/30 transition-all border border-amber-500/30"
              >
                <AlertTriangle className="w-4 h-4" />
                Hoàn thiện yêu cầu trước
              </button>
            </div>
          )}
        </div>
      </div>

      {/* How it works — 3 steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { step: 1, icon: <FileText className="w-5 h-5 text-blue-500" />, iconBg: "bg-blue-50", title: "Chuẩn bị hồ sơ", desc: "Hoàn thiện thông tin startup và tải lên Pitch Deck, Business Plan." },
          { step: 2, icon: <Brain className="w-5 h-5 text-purple-500" />, iconBg: "bg-purple-50", title: "AI phân tích", desc: "Hệ thống AI phân tích dữ liệu và tài liệu, đánh giá trên 5 lĩnh vực chính." },
          { step: 3, icon: <Target className="w-5 h-5 text-emerald-500" />, iconBg: "bg-emerald-50", title: "Nhận kết quả", desc: "Xem điểm tiềm năng, phân tích chi tiết, và khuyến nghị cải thiện cụ thể." },
        ].map(s => (
          <div key={s.step} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#eec54e] text-slate-900 text-[12px] font-black flex items-center justify-center flex-shrink-0">{s.step}</div>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.iconBg)}>{s.icon}</div>
            </div>
            <p className="text-[14px] font-bold text-slate-800 mb-1">{s.title}</p>
            <p className="text-[12px] text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Readiness Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", profile.ready ? "bg-emerald-50" : "bg-amber-50")}>
                {profile.ready ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
              </div>
              <p className="text-[13px] font-bold text-slate-800">Hồ sơ Startup</p>
            </div>
            <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold", profile.ready ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
              {profile.completionPercent}%
            </span>
          </div>
          <div className="space-y-2.5">
            {profile.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                {item.ready
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-[12px] text-slate-600">{item.label}</p>
                  {item.detail && <p className="text-[11px] text-slate-400">{item.detail}</p>}
                </div>
              </div>
            ))}
          </div>
          {!profile.ready && (
            <Link href="/startup/startup-profile" className="flex items-center gap-1 mt-4 text-[12px] font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Hoàn thiện hồ sơ <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", documents.ready ? "bg-emerald-50" : "bg-amber-50")}>
                {documents.ready ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
              </div>
              <p className="text-[13px] font-bold text-slate-800">Tài liệu kinh doanh</p>
            </div>
            <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold", documents.ready ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
              {documents.eligibleDocs.filter(d => d.recommended).length} phù hợp
            </span>
          </div>
          <div className="space-y-2.5">
            {documents.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                {item.ready
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />}
                <p className="text-[12px] text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            {documents.eligibleDocs.filter(d => d.recommended).map(doc => (
              <div key={doc.id} className="flex items-center gap-2">
                {doc.type === "PITCH_DECK" ? <Layout className="w-3 h-3 text-blue-400" /> : <BookOpen className="w-3 h-3 text-violet-400" />}
                <p className="text-[11px] text-slate-500 truncate">{doc.name}</p>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-semibold flex-shrink-0">Khuyến nghị</span>
              </div>
            ))}
          </div>
          {!documents.ready && (
            <Link href="/startup/documents" className="flex items-center gap-1 mt-4 text-[12px] font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Quản lý tài liệu <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* What AI evaluates */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileSearch className="w-4 h-4 text-blue-500" />
          <p className="text-[14px] font-bold text-slate-800">AI sẽ đánh giá những gì?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Dữ liệu hồ sơ startup (đội ngũ, thị trường, sản phẩm)",
            "Tài liệu kinh doanh (Pitch Deck, Business Plan)",
            "Chỉ số traction và tài chính hiện có",
            "Kết quả: điểm số, tóm tắt, rủi ro, gaps, và khuyến nghị cụ thể",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#eec54e] mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-slate-600">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Đánh giá AI chỉ mang tính chất hỗ trợ quyết định và chuẩn bị. Đây không phải lời khuyên đầu tư và không thay thế cho đánh giá chính thức từ chuyên gia.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard (has evaluation results) ───────────────────── */

function DashboardView({ latestCompleted }: { latestCompleted: NonNullable<typeof mockReports[0]> }) {
  const router = useRouter();
  const { profile, documents } = mockReadiness;
  const status: AIEvaluationStatus = "COMPLETED";
  const statusCfg = STATUS_CFG[status];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#eec54e]/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#eec54e]" />
            </div>
            <h1 className="text-[22px] font-bold text-slate-900 leading-none">Đánh giá AI</h1>
            <span className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border", statusCfg.color, statusCfg.bg, statusCfg.border)}>
              {statusCfg.icon}
              {statusCfg.label}
            </span>
          </div>
          <p className="text-[13px] text-slate-400">
            AI đánh giá startup dựa trên dữ liệu hồ sơ và tài liệu kinh doanh đã tải lên.
          </p>
          <p className="text-[12px] text-slate-400 mt-1">
            Lần đánh giá gần nhất: <span className="font-semibold text-slate-500">{latestCompleted.calculatedAt}</span>
          </p>
        </div>
        <button
          onClick={() => router.push("/startup/ai-evaluation/request")}
          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#0f172a] text-white text-[13px] font-semibold hover:bg-slate-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Đánh giá mới
        </button>
      </div>

      {/* Readiness Cards (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Readiness */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", profile.ready ? "bg-emerald-50" : "bg-amber-50")}>
              {profile.ready ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">Hồ sơ Startup</p>
              <p className="text-[11px] text-slate-400">{profile.completionPercent}% hoàn thành</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {profile.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                {item.ready ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-[12px] text-slate-600">{item.label}</p>
                  {item.detail && <p className="text-[11px] text-slate-400">{item.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Readiness */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", documents.ready ? "bg-emerald-50" : "bg-amber-50")}>
              {documents.ready ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">Tài liệu kinh doanh</p>
              <p className="text-[11px] text-slate-400">{documents.eligibleDocs.filter(d => d.recommended).length} tài liệu phù hợp</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {documents.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                {item.ready ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />}
                <p className="text-[12px] text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            {documents.eligibleDocs.filter(d => d.recommended).map(doc => (
              <div key={doc.id} className="flex items-center gap-2">
                {doc.type === "PITCH_DECK" ? <Layout className="w-3 h-3 text-blue-400" /> : <BookOpen className="w-3 h-3 text-violet-400" />}
                <p className="text-[11px] text-slate-500 truncate">{doc.name}</p>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-semibold flex-shrink-0">Khuyến nghị</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Scope */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileSearch className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[13px] font-bold text-slate-800">Phạm vi đánh giá</p>
          </div>
          <div className="space-y-2.5">
            {["Dữ liệu hồ sơ startup", "Tài liệu kinh doanh đủ điều kiện", "Dữ liệu mới nhất được hỗ trợ", "Điểm số, tóm tắt, rủi ro, gaps, khuyến nghị"].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-slate-300 mt-1 flex-shrink-0" />
                <p className="text-[12px] text-slate-600">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-start gap-2 px-3 py-2 bg-blue-50/50 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-blue-600 leading-relaxed">
                Chỉ mang tính hỗ trợ quyết định, không thay thế lời khuyên đầu tư.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Result Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-4 h-4 text-[#eec54e]" />
          <p className="text-[14px] font-bold text-slate-800">Kết quả đánh giá gần nhất</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <ScoreRing score={latestCompleted.overallScore} size={100} />
            <p className="text-[11px] text-slate-400 font-semibold">Startup Potential Score</p>
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">{latestCompleted.executiveSummary}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Team", score: latestCompleted.teamScore },
                { label: "Market", score: latestCompleted.marketScore },
                { label: "Product", score: latestCompleted.productScore },
                { label: "Traction", score: latestCompleted.tractionScore },
                { label: "Financial", score: latestCompleted.financialScore },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-400">{m.label}</span>
                  <span className={cn("text-[12px] font-bold", m.score >= 75 ? "text-emerald-600" : m.score >= 50 ? "text-amber-600" : "text-red-500")}>{m.score}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => router.push("/startup/ai-evaluation/score")} className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#eec54e] text-slate-900 text-[12px] font-bold hover:bg-[#e6b800] transition-all">
                <BarChart3 className="w-3.5 h-3.5" />Xem điểm tiềm năng
              </button>
              <button onClick={() => router.push(`/startup/ai-evaluation/${latestCompleted.evaluationId}`)} className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-slate-100 text-slate-700 text-[12px] font-semibold hover:bg-slate-200 transition-all">
                <FileText className="w-3.5 h-3.5" />Xem báo cáo chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => router.push("/startup/ai-evaluation/history")} className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 text-left hover:border-amber-200 hover:shadow-[0_2px_8px_rgba(238,197,78,0.12)] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-amber-50 transition-colors"><History className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" /></div>
              <div>
                <p className="text-[14px] font-bold text-slate-800">Lịch sử đánh giá</p>
                <p className="text-[12px] text-slate-400">{mockReports.length} lượt đánh giá</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors" />
          </div>
        </button>
        <button onClick={() => router.push(`/startup/ai-evaluation/${latestCompleted.evaluationId}`)} className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 text-left hover:border-amber-200 hover:shadow-[0_2px_8px_rgba(238,197,78,0.12)] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-amber-50 transition-colors"><FileText className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" /></div>
              <div>
                <p className="text-[14px] font-bold text-slate-800">Báo cáo chi tiết mới nhất</p>
                <p className="text-[12px] text-slate-400">{latestCompleted.snapshotLabel}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors" />
          </div>
        </button>
      </div>

      {/* Disclaimer */}
      <div className="px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Báo cáo đánh giá AI được tạo ra chỉ nhằm mục đích hỗ trợ quyết định và chuẩn bị. Đây không phải lời khuyên đầu tư và không thay thế cho đánh giá chính thức từ chuyên gia.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function AIEvaluationHomePage() {
  const searchParams = useSearchParams();
  const latestCompleted = mockReports.find(r => r.status === "COMPLETED" && r.isCurrent);
  const { profile, documents } = mockReadiness;
  const allReady = profile.ready && documents.ready;

  // ?demo=new to preview onboarding state
  const forceNew = searchParams.get("demo") === "new";
  const hasResult = !forceNew && !!latestCompleted;

  return (
    <StartupShell>
      <div className="max-w-[1100px] mx-auto pb-20 animate-in fade-in duration-500">
        {hasResult && latestCompleted
          ? <DashboardView latestCompleted={latestCompleted} />
          : <OnboardingView allReady={allReady} />
        }
      </div>
    </StartupShell>
  );
}
