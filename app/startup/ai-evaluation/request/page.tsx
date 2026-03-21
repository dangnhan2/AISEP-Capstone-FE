"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import {
  Sparkles, CheckCircle2, XCircle, Layout, BookOpen,
  ShieldCheck, Loader2, Clock, Users, Briefcase, ArrowLeft,
  AlertTriangle, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockReadiness, mockProfile } from "../mock-data";

/* ─── Submission states ────────────────────────────────────── */

type SubmitState = "idle" | "validating" | "submitting" | "queued" | "failed";

const SUBMIT_LABELS: Record<SubmitState, string> = {
  idle: "Gửi yêu cầu đánh giá AI",
  validating: "Đang xác thực...",
  submitting: "Đang gửi yêu cầu...",
  queued: "Yêu cầu đã được chấp nhận!",
  failed: "Gửi thất bại — Thử lại",
};

/* ─── Page ─────────────────────────────────────────────────── */

export default function RequestAIEvaluationPage() {
  const router = useRouter();
  const { profile, documents } = mockReadiness;
  const allReady = profile.ready && documents.ready;

  // Only show Pitch Deck and Business Plan from Documents & IP
  const aiEligibleDocs = documents.eligibleDocs.filter(d => d.type === "PITCH_DECK" || d.type === "BUSINESS_PLAN");

  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(
    new Set(aiEligibleDocs.filter(d => d.recommended).map(d => d.id))
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [confirmed, setConfirmed] = useState(false);

  const selectedPitchDeck = aiEligibleDocs.find(d => selectedDocs.has(d.id) && d.type === "PITCH_DECK");
  const selectedBPlan = aiEligibleDocs.find(d => selectedDocs.has(d.id) && d.type === "BUSINESS_PLAN");
  const canSubmit = allReady && confirmed && selectedPitchDeck && submitState === "idle";

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitState("validating");
    await new Promise(r => setTimeout(r, 1200));
    setSubmitState("submitting");
    await new Promise(r => setTimeout(r, 1500));
    setSubmitState("queued");
    // After 2s, redirect to home
    setTimeout(() => router.push("/startup/ai-evaluation"), 2000);
  };

  return (
    <StartupShell>
      <div className="max-w-[1100px] mx-auto pb-20 animate-in fade-in duration-500">

        {/* Back */}
        <button
          onClick={() => router.push("/startup/ai-evaluation")}
          className="flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#eec54e]/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#eec54e]" />
            </div>
            <h1 className="text-[22px] font-bold text-slate-900">Yêu cầu đánh giá AI</h1>
          </div>
          <p className="text-[13px] text-slate-400">
            Xem lại các điều kiện và xác nhận gửi yêu cầu. Quá trình xử lý diễn ra bất đồng bộ.
          </p>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left (2/3) ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Readiness Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <p className="text-[14px] font-bold text-slate-800 mb-4">Kiểm tra điều kiện</p>

              <div className="space-y-3">
                {/* Profile */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                  {profile.ready
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700">Hồ sơ Startup</p>
                    <p className="text-[11px] text-slate-400">{profile.completionPercent}% hoàn thành — {profile.items.filter(i => i.ready).length}/{profile.items.length} mục đạt yêu cầu</p>
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold", profile.ready ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>
                    {profile.ready ? "Đạt" : "Chưa đạt"}
                  </span>
                </div>

                {/* Documents */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                  {documents.ready
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700">Tài liệu kinh doanh</p>
                    <p className="text-[11px] text-slate-400">{aiEligibleDocs.length} tài liệu Pitch Deck / Business Plan</p>
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold", documents.ready ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>
                    {documents.ready ? "Đạt" : "Chưa đạt"}
                  </span>
                </div>

                {/* Auth */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700">Xác thực & quyền truy cập</p>
                    <p className="text-[11px] text-slate-400">Tài khoản Startup Owner đã xác thực</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600">Đạt</span>
                </div>
              </div>
            </div>

            {/* Eligible Documents — selectable */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <p className="text-[14px] font-bold text-slate-800 mb-1">Tài liệu đầu vào cho AI</p>
              <p className="text-[12px] text-slate-400 mb-4">Chọn tài liệu từ mục Tài liệu & IP. Chỉ hỗ trợ Pitch Deck và Business Plan.</p>

              <div className="space-y-2.5">
                {aiEligibleDocs.map(doc => {
                  const selected = selectedDocs.has(doc.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left",
                        selected ? "border-[#eec54e] bg-[#fdf8e6]" : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className={cn("w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        selected ? "border-[#eec54e] bg-[#eec54e]" : "border-slate-300")}>
                        {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      {doc.type === "PITCH_DECK" ? <Layout className="w-4 h-4 text-blue-400 flex-shrink-0" /> : <BookOpen className="w-4 h-4 text-violet-400 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-700 truncate">{doc.name}</p>
                        <p className="text-[11px] text-slate-400">Cập nhật: {doc.updatedAt}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold flex-shrink-0">
                        {doc.type === "PITCH_DECK" ? "Pitch Deck" : "Business Plan"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evaluation Scope */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <p className="text-[14px] font-bold text-slate-800 mb-4">Phạm vi đánh giá</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Users className="w-4 h-4 text-blue-400" />, label: "Đội ngũ sáng lập", desc: "Kinh nghiệm, cam kết, đa dạng kỹ năng" },
                  { icon: <Briefcase className="w-4 h-4 text-violet-400" />, label: "Thị trường & Cạnh tranh", desc: "Quy mô, tốc độ tăng trưởng, timing" },
                  { icon: <Layout className="w-4 h-4 text-emerald-400" />, label: "Sản phẩm & Giải pháp", desc: "MVP, feedback, kiến trúc kỹ thuật" },
                  { icon: <Sparkles className="w-4 h-4 text-amber-400" />, label: "Traction & Tài chính", desc: "Doanh thu, tăng trưởng, unit economics" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-700">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right (1/3) ────────────────────────────────── */}
          <div className="space-y-5">

            {/* Profile Snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[13px] font-bold text-slate-800 mb-3">Snapshot hồ sơ</p>
              <div className="space-y-2.5">
                {[
                  { label: "Tên startup", value: mockProfile.name },
                  { label: "Giai đoạn", value: mockProfile.stage },
                  { label: "Ngành", value: mockProfile.industry },
                  { label: "Năm thành lập", value: String(mockProfile.foundedYear) },
                  { label: "Quy mô đội ngũ", value: `${mockProfile.teamSize} thành viên` },
                  { label: "Cập nhật gần nhất", value: mockProfile.lastUpdated },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-400">{row.label}</span>
                    <span className="text-[12px] font-semibold text-slate-700">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 sticky top-24">
              <p className="text-[13px] font-bold text-slate-800 mb-3">Xác nhận & Gửi</p>

              {/* Confirmation checkbox */}
              <label className="flex items-start gap-2.5 mb-4 cursor-pointer group">
                <div className={cn("w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                  confirmed ? "border-[#eec54e] bg-[#eec54e]" : "border-slate-300 group-hover:border-slate-400")}>
                  {confirmed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <input type="checkbox" className="sr-only" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
                <span className="text-[12px] text-slate-500 leading-relaxed">
                  Tôi xác nhận dữ liệu đã sẵn sàng và hiểu rằng kết quả AI chỉ mang tính hỗ trợ quyết định, không phải lời khuyên đầu tư.
                </span>
              </label>

              {/* Async notice */}
              <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50/50 rounded-xl mb-4">
                <Clock className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-blue-600 leading-relaxed">
                  Quá trình xử lý có thể mất vài phút. Bạn sẽ nhận được thông báo khi hoàn tất.
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit && submitState === "idle"}
                className={cn(
                  "w-full flex items-center justify-center gap-2 h-11 rounded-xl text-[13px] font-bold transition-all",
                  submitState === "queued"
                    ? "bg-emerald-500 text-white"
                    : submitState === "failed"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : canSubmit
                    ? "bg-[#0f172a] text-white hover:bg-slate-700"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                {(submitState === "validating" || submitState === "submitting") && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitState === "queued" && <CheckCircle2 className="w-4 h-4" />}
                {submitState === "idle" && <Send className="w-4 h-4" />}
                {submitState === "failed" && <AlertTriangle className="w-4 h-4" />}
                {SUBMIT_LABELS[submitState]}
              </button>

              {!allReady && submitState === "idle" && (
                <div className="flex items-start gap-2 mt-3 px-3 py-2 bg-amber-50 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-amber-700">Vui lòng hoàn thiện hồ sơ và tải lên tài liệu trước khi gửi yêu cầu.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </StartupShell>
  );
}
