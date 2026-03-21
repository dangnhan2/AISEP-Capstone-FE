"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import {
  Sparkles, ArrowLeft, FileText, History, RefreshCw, BarChart3,
  ShieldCheck, CheckCircle2, AlertTriangle, XCircle, TrendingUp,
  ChevronDown, ChevronUp, Zap, Info, Users, Globe, Layout, Banknote,
  Clock, Tag, Cpu, BookOpen, Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockReports } from "../mock-data";
import { SubMetric, Recommendation } from "../types";

/* ─── Score Bar ────────────────────────────────────────────── */

function ScoreBar({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  const color = score >= 75 ? "bg-emerald-400" : score >= 50 ? "bg-amber-400" : "bg-red-400";
  const textColor = score >= 75 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-semibold text-slate-700">{label}</span>
          <span className={cn("text-[13px] font-black", textColor)}>{score}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Expandable Section ───────────────────────────────────── */

function ExpandableSection({ title, icon, iconColor, children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; iconColor: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", iconColor)}>{icon}</div>
          <span className="text-[14px] font-bold text-slate-800">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 pt-0">{children}</div>}
    </div>
  );
}

/* ─── Sub-metrics Table ────────────────────────────────────── */

function SubMetricsList({ metrics }: { metrics: SubMetric[] }) {
  if (metrics.length === 0) return <p className="text-[12px] text-slate-400 italic">Không có dữ liệu chi tiết.</p>;
  return (
    <div className="space-y-3">
      {metrics.map((m, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0 w-20">
            <span className={cn("text-[14px] font-black",
              m.score / m.maxScore >= 0.75 ? "text-emerald-600" : m.score / m.maxScore >= 0.5 ? "text-amber-600" : "text-red-500"
            )}>{m.score}</span>
            <span className="text-[11px] text-slate-400">/{m.maxScore}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-slate-700">{m.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{m.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Priority badge ───────────────────────────────────────── */

const PRIORITY_CFG = {
  HIGH:   { label: "Cao",      color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100" },
  MEDIUM: { label: "Trung bình", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  LOW:    { label: "Thấp",     color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
};

/* ─── Page ─────────────────────────────────────────────────── */

export default function AIDetailedReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const report = mockReports.find(r => r.evaluationId === id);

  if (!report || report.status !== "COMPLETED") {
    notFound();
  }

  return (
    <StartupShell>
      <div className="max-w-[1100px] mx-auto pb-20 animate-in fade-in duration-500">

        {/* Back */}
        <button
          onClick={() => router.push("/startup/ai-evaluation")}
          className="no-print flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Đánh giá AI
        </button>

        {/* ── Report Header ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono font-semibold text-slate-400">{report.evaluationId.toUpperCase()}</span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Hoàn thành
                </span>
                {report.isCurrent && (
                  <span className="px-2 py-0.5 bg-[#eec54e]/20 text-[#b8940a] rounded-full text-[10px] font-bold">Mới nhất</span>
                )}
              </div>
              <h1 className="text-[20px] font-bold text-slate-900 mb-1">{report.snapshotLabel}</h1>
              <p className="text-[12px] text-slate-400">
                Đánh giá ngày {report.calculatedAt} · Tạo báo cáo {report.generatedAt}
              </p>
            </div>

            {/* Overall score */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className={cn(
                "w-20 h-20 rounded-2xl flex flex-col items-center justify-center",
                report.overallScore >= 75 ? "bg-emerald-50" : report.overallScore >= 50 ? "bg-amber-50" : "bg-red-50"
              )}>
                <span className={cn("text-[28px] font-black leading-none",
                  report.overallScore >= 75 ? "text-emerald-600" : report.overallScore >= 50 ? "text-amber-600" : "text-red-500"
                )}>{report.overallScore}</span>
                <span className="text-[10px] text-slate-400 font-semibold">/100</span>
              </div>
            </div>
          </div>

          {/* Disclaimer chip */}
          <div className="mt-4 flex items-start gap-2 px-3 py-2 bg-blue-50/50 rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-blue-600 leading-relaxed">
              Báo cáo này được tạo bởi AI và chỉ mang tính hỗ trợ quyết định. Không phải lời khuyên đầu tư.
            </p>
          </div>
        </div>

        {/* ── 2-column layout ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main (2/3) ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Executive Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#eec54e]" />
                <p className="text-[14px] font-bold text-slate-800">Tổng quan đánh giá</p>
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">{report.executiveSummary}</p>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-4 h-4 text-[#eec54e]" />
                <p className="text-[14px] font-bold text-slate-800">Điểm tổng quan</p>
              </div>

              {/* Document scores */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="px-4 py-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Layout className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] text-blue-500 font-semibold">Pitch Deck</span>
                  </div>
                  <span className="text-[22px] font-black text-blue-700">{report.pitchDeckScore}</span>
                </div>
                <div className="px-4 py-3 bg-violet-50/50 rounded-xl border border-violet-100">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[11px] text-violet-500 font-semibold">Business Plan</span>
                  </div>
                  <span className="text-[22px] font-black text-violet-700">{report.businessPlanScore}</span>
                </div>
              </div>

              {/* Category bars */}
              <div className="space-y-4">
                <ScoreBar icon={<Users className="w-4 h-4 text-blue-400" />} label="Đội ngũ" score={report.teamScore} />
                <ScoreBar icon={<Globe className="w-4 h-4 text-emerald-400" />} label="Thị trường" score={report.marketScore} />
                <ScoreBar icon={<Layout className="w-4 h-4 text-violet-400" />} label="Sản phẩm" score={report.productScore} />
                <ScoreBar icon={<Zap className="w-4 h-4 text-amber-400" />} label="Traction" score={report.tractionScore} />
                <ScoreBar icon={<Banknote className="w-4 h-4 text-slate-400" />} label="Tài chính" score={report.financialScore} />
              </div>
            </div>

            {/* Warnings */}
            {report.warningMessages.length > 0 && (
              <div className="px-5 py-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] font-bold text-amber-800 mb-1">Cảnh báo</p>
                    <ul className="space-y-1">
                      {report.warningMessages.map((msg, i) => (
                        <li key={i} className="text-[12px] text-amber-700">• {msg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Breakdown Sections */}
            <ExpandableSection
              title="Đội ngũ — Chi tiết"
              icon={<Users className="w-4 h-4 text-blue-500" />}
              iconColor="bg-blue-50"
              defaultOpen
            >
              <SubMetricsList metrics={report.subMetrics.team} />
            </ExpandableSection>

            <ExpandableSection
              title="Thị trường — Chi tiết"
              icon={<Globe className="w-4 h-4 text-emerald-500" />}
              iconColor="bg-emerald-50"
            >
              <SubMetricsList metrics={report.subMetrics.market} />
            </ExpandableSection>

            <ExpandableSection
              title="Sản phẩm — Chi tiết"
              icon={<Layout className="w-4 h-4 text-violet-500" />}
              iconColor="bg-violet-50"
            >
              <SubMetricsList metrics={report.subMetrics.product} />
            </ExpandableSection>

            <ExpandableSection
              title="Traction — Chi tiết"
              icon={<Zap className="w-4 h-4 text-amber-500" />}
              iconColor="bg-amber-50"
            >
              <SubMetricsList metrics={report.subMetrics.traction} />
            </ExpandableSection>

            <ExpandableSection
              title="Tài chính — Chi tiết"
              icon={<Banknote className="w-4 h-4 text-slate-500" />}
              iconColor="bg-slate-100"
            >
              <SubMetricsList metrics={report.subMetrics.financial} />
            </ExpandableSection>

            {/* Key Strengths */}
            <ExpandableSection
              title="Điểm mạnh"
              icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
              iconColor="bg-emerald-50"
              defaultOpen
            >
              <div className="space-y-2.5">
                {report.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[12px] text-slate-600 leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </ExpandableSection>

            {/* Risks / Concerns */}
            <ExpandableSection
              title="Rủi ro & Mối quan ngại"
              icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
              iconColor="bg-amber-50"
              defaultOpen
            >
              <div className="space-y-4">
                {report.risks.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-red-500 uppercase tracking-wide mb-2">Rủi ro</p>
                    <div className="space-y-2">
                      {report.risks.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-[12px] text-slate-600 leading-relaxed">{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {report.concerns.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wide mb-2">Mối quan ngại</p>
                    <div className="space-y-2">
                      {report.concerns.map((c, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-[12px] text-slate-600 leading-relaxed">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ExpandableSection>

            {/* Gaps / Missing Info */}
            {report.gaps.length > 0 && (
              <ExpandableSection
                title="Thiếu hụt & Thông tin cần bổ sung"
                icon={<Info className="w-4 h-4 text-blue-500" />}
                iconColor="bg-blue-50"
              >
                <div className="space-y-2">
                  {report.gaps.map((g, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      <p className="text-[12px] text-slate-600 leading-relaxed">{g}</p>
                    </div>
                  ))}
                </div>
              </ExpandableSection>
            )}

            {/* Recommendations */}
            {report.recommendations.length > 0 && (
              <ExpandableSection
                title="Khuyến nghị cải thiện"
                icon={<Sparkles className="w-4 h-4 text-[#eec54e]" />}
                iconColor="bg-[#eec54e]/10"
                defaultOpen
              >
                <p className="text-[11px] text-slate-400 mb-4 italic">Các khuyến nghị dưới đây được tạo bởi AI và mang tính hỗ trợ.</p>
                <div className="space-y-3">
                  {report.recommendations.map((rec, i) => {
                    const pcfg = PRIORITY_CFG[rec.priority];
                    return (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", pcfg.color, pcfg.bg, pcfg.border)}>
                            {pcfg.label}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">{rec.category}</span>
                        </div>
                        <p className="text-[13px] font-semibold text-slate-700 mb-2">{rec.text}</p>
                        <div className="flex items-start gap-1.5">
                          <Zap className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-[11px] text-slate-500">{rec.impact}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ExpandableSection>
            )}
          </div>

          {/* ── Sidebar (1/3) ──────────────────────────── */}
          <div className="space-y-5">

            {/* Metadata */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 sticky top-24">
              <p className="text-[13px] font-bold text-slate-800 mb-4">Thông tin báo cáo</p>
              <div className="space-y-3">
                {[
                  { icon: <Clock className="w-3.5 h-3.5 text-slate-400" />, label: "Ngày đánh giá", value: report.calculatedAt },
                  { icon: <FileText className="w-3.5 h-3.5 text-slate-400" />, label: "Ngày tạo báo cáo", value: report.generatedAt },
                  { icon: <Cpu className="w-3.5 h-3.5 text-slate-400" />, label: "Model version", value: report.modelVersion },
                  { icon: <Tag className="w-3.5 h-3.5 text-slate-400" />, label: "Prompt version", value: report.promptVersion },
                  { icon: <Info className="w-3.5 h-3.5 text-slate-400" />, label: "Config version", value: report.configVersion },
                  { icon: <BookOpen className="w-3.5 h-3.5 text-slate-400" />, label: "Report ID", value: report.evaluationId },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-0.5">{row.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-400">{row.label}</p>
                      <p className="text-[12px] font-semibold text-slate-700 truncate">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="no-print mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center gap-2 h-9 px-4 rounded-xl bg-[#0f172a] text-white text-[12px] font-semibold hover:bg-slate-700 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xuất PDF
                </button>
                <button
                  onClick={() => router.push("/startup/ai-evaluation/score")}
                  className="w-full flex items-center gap-2 h-9 px-4 rounded-xl bg-slate-50 text-slate-700 text-[12px] font-semibold hover:bg-slate-100 transition-all"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Quay lại điểm tiềm năng
                </button>
                <button
                  onClick={() => router.push("/startup/ai-evaluation/history")}
                  className="w-full flex items-center gap-2 h-9 px-4 rounded-xl bg-slate-50 text-slate-700 text-[12px] font-semibold hover:bg-slate-100 transition-all"
                >
                  <History className="w-3.5 h-3.5" />
                  Lịch sử đánh giá
                </button>
                <button
                  onClick={() => router.push("/startup/ai-evaluation/request")}
                  className="w-full flex items-center gap-2 h-9 px-4 rounded-xl bg-slate-50 text-slate-700 text-[12px] font-semibold hover:bg-slate-100 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Đánh giá mới
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Báo cáo này được tạo ra chỉ nhằm mục đích hỗ trợ quyết định và chuẩn bị. Đây không phải lời khuyên đầu tư và không thay thế cho đánh giá chính thức từ chuyên gia.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </StartupShell>
  );
}
