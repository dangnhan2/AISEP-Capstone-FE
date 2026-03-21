"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import {
  FileText, Star, Download, CheckCircle2,
  Target, Lightbulb, ListChecks, Paperclip, ArrowRight,
  BadgeCheck, Calendar
} from "lucide-react";

// ─── Mock Report Data ──────────────────────────────────────────────────────────

const MOCK_REPORT = {
  requestNo: "REQ-0004",
  advisor: {
    name: "Nguyễn Minh Quân",
    title: "Head of Product · TechGlobal",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY2B_40T_b8ifCFhZYE9RUfdodTMIq4hkMeAvPfCxdek8AhcikuKD11XDhYpXmtyvdSlnne2UWZDbdEO4TMXf17yrSsltdyX2-bBHPjbzbTxFQNPTgQkflvmeFd6QdGRvx0WBDDS0vnBvv-defpdnEB2zPF8-sAiLMhhfWCHe6M2UpyMAwTRdjcu8xSEmKOJ3aGlWMMK40SM6ThVvCpVFz_jvRfcX6dDBi4rDUGiVvfrUIHpezyewWd_4dYD9EbKusdQxomMZQhk",
    isVerified: true,
  },
  topic: "Chiến lược tăng trưởng người dùng Q2/2024",
  sessionDate: "15 Tháng 3, 2024 · 14:00 – 15:00 CH",
  submittedAt: "15 Tháng 3, 2024 · 17:30 CH",
  duration: "60 phút",
  format: "Zoom",
  summary: "Buổi tư vấn tập trung vào phân tích hiện trạng tăng trưởng người dùng của startup và xây dựng chiến lược scale MAU từ 10K lên 100K trong 2 quý tới. Chúng tôi đã xem xét funnel hiện tại, xác định các điểm nghẽn chính và đề xuất các kênh tăng trưởng ưu tiên.",
  problems: [
    "CAC (Customer Acquisition Cost) đang ở mức cao do phụ thuộc nhiều vào paid ads, chưa có chiến lược organic growth bền vững.",
    "Churn rate ở tháng thứ 2 cao bất thường (25%), cho thấy vấn đề về onboarding và giá trị sản phẩm chưa được truyền đạt đúng.",
    "Thiếu product-led growth loop — người dùng hiện tại chưa được khai thác như kênh referral tiềm năng.",
  ],
  recommendations: [
    "Xây dựng content marketing strategy tập trung vào SEO và thought leadership để giảm phụ thuộc vào paid channels.",
    "Thiết kế lại onboarding flow theo mô hình Jobs-to-be-Done — dẫn người dùng đến 'Aha moment' trong 3 ngày đầu tiên.",
    "Implement referral program với cơ chế viral loop: 1 người dùng hài lòng → mời được ít nhất 1.5 người dùng mới.",
    "Tập trung vào phân khúc SMB (<50 nhân viên) là ICP có conversion rate và LTV tốt nhất.",
  ],
  actionItems: [
    { task: "Audit onboarding flow hiện tại, xác định drop-off points", deadline: "Tuần 1", priority: "Cao" },
    { task: "Phỏng vấn 10 churned users để hiểu lý do rời bỏ", deadline: "Tuần 1–2", priority: "Cao" },
    { task: "Thiết kế referral program MVP và A/B test", deadline: "Tuần 2–3", priority: "Trung bình" },
    { task: "Lập kế hoạch nội dung content 3 tháng cho SEO", deadline: "Tuần 2", priority: "Trung bình" },
    { task: "Setup tracking dashboard cho North Star Metric (MAU)", deadline: "Tuần 1", priority: "Cao" },
  ],
  deliverables: [
    { name: "Growth Strategy Framework Q2 2024.pdf", size: "2.4 MB" },
    { name: "Onboarding Redesign Wireframes.figma", size: "5.1 MB" },
    { name: "Referral Program Template.xlsx", size: "0.8 MB" },
  ],
  conclusion: "Startup có nền tảng sản phẩm tốt và đang ở giai đoạn phù hợp để scale. Điều quan trọng nhất hiện tại là sửa chữa 'leaky bucket' (giảm churn) trước khi đổ thêm tiền vào acquisition. Với chiến lược đúng, mục tiêu 100K MAU trong 2 quý là hoàn toàn khả thi.",
  nextSteps: "Lên lịch check-in 2 tuần/lần trong 6 tuần tới để theo dõi tiến độ và điều chỉnh chiến lược nếu cần.",
  feedbackSubmitted: false,
};

const PRIORITY_COLORS: Record<string, string> = {
  "Cao": "text-red-600 bg-red-50 border-red-100",
  "Trung bình": "text-amber-600 bg-amber-50 border-amber-100",
  "Thấp": "text-green-600 bg-green-50 border-green-100",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ConsultingReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <StartupShell>
      <div className="max-w-[900px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">

        {/* Report Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-7 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#eec54e]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/3 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Báo cáo hoàn thành
                  </span>
                  <span className="text-[11px] text-white/40">{MOCK_REPORT.requestNo}</span>
                </div>
                <h1 className="text-[22px] font-bold leading-tight mb-2">{MOCK_REPORT.topic}</h1>
                <div className="flex items-center gap-4 text-[12px] text-white/60">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{MOCK_REPORT.sessionDate}</span>
                  <span>{MOCK_REPORT.duration}</span>
                  <span>{MOCK_REPORT.format}</span>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[12px] font-semibold text-white transition-all flex-shrink-0"
              >
                {downloaded ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Download className="w-4 h-4" />}
                {downloaded ? "Đã tải" : "Tải xuống"}
              </button>
            </div>

            {/* Advisor */}
            <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-3">
              <div className="relative">
                <img src={MOCK_REPORT.advisor.avatar} alt={MOCK_REPORT.advisor.name} className="w-10 h-10 rounded-xl object-cover border-2 border-white/20" />
                {MOCK_REPORT.advisor.isVerified && (
                  <BadgeCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-amber-400 bg-slate-900 rounded-full" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-bold leading-none">Viết bởi {MOCK_REPORT.advisor.name}</p>
                <p className="text-[11px] text-white/50 mt-0.5">{MOCK_REPORT.advisor.title}</p>
              </div>
              <div className="ml-auto text-[11px] text-white/40">Gửi lúc {MOCK_REPORT.submittedAt}</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Tóm tắt phiên tư vấn</h2>
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed">{MOCK_REPORT.summary}</p>
        </div>

        {/* Problems Diagnosed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <Target className="w-4 h-4 text-red-500" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Vấn đề được chẩn đoán</h2>
          </div>
          <div className="space-y-3">
            {MOCK_REPORT.problems.map((p, i) => (
              <div key={i} className="flex gap-3 p-4 bg-red-50/40 border border-red-50 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <p className="text-[13px] text-slate-700 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Khuyến nghị chiến lược</h2>
          </div>
          <div className="space-y-3">
            {MOCK_REPORT.recommendations.map((r, i) => (
              <div key={i} className="flex gap-3 p-4 bg-amber-50/40 border border-amber-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-slate-700 leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <ListChecks className="w-4 h-4 text-indigo-500" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Các bước hành động</h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nhiệm vụ</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thời hạn</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ưu tiên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_REPORT.actionItems.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-[13px] text-slate-700">{item.task}</td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-500 whitespace-nowrap">{item.deadline}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${PRIORITY_COLORS[item.priority] ?? ""}`}>
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deliverables */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
              <Paperclip className="w-4 h-4 text-slate-500" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Tài liệu đính kèm</h2>
          </div>
          <div className="space-y-2">
            {MOCK_REPORT.deliverables.map((file, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-[13px] font-medium text-slate-700">{file.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">{file.size}</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7">
          <h2 className="text-[15px] font-bold text-slate-900 mb-3">Kết luận từ cố vấn</h2>
          <p className="text-[14px] text-slate-600 leading-relaxed mb-4 italic">"{MOCK_REPORT.conclusion}"</p>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-[12px] font-bold text-amber-700 mb-1">Bước tiếp theo</p>
            <p className="text-[13px] text-amber-700">{MOCK_REPORT.nextSteps}</p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="flex items-center justify-between px-6 py-5 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <button
            onClick={() => router.push(`/startup/mentorship-requests/${id}`)}
            className="text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Quay lại chi tiết yêu cầu
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-[13px] font-semibold hover:bg-slate-50 transition-all"
            >
              <Download className="w-4 h-4" />
              Tải báo cáo
            </button>
            {!MOCK_REPORT.feedbackSubmitted && (
              <button
                onClick={() => router.push(`/startup/mentorship-requests/${id}/feedback`)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] text-white rounded-xl text-[13px] font-semibold hover:bg-slate-700 transition-all shadow-sm"
              >
                <Star className="w-4 h-4" />
                Gửi đánh giá
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </StartupShell>
  );
}
