"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Video,
  Clock,
  Calendar,
  Building2,
  User,
  MessageSquare,
  FileText,
  Loader2,
  ShieldAlert,
  Gavel,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import axios from "@/services/interceptor";
import { MarkSessionDispute } from "@/services/staff/consulting-oversight.api";
import type { IMentorshipRequest } from "@/types/startup-mentorship";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function MentorshipMonitoringPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: mentorshipId } = use(params);
  const [mentorship, setMentorship] = useState<IMentorshipRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dispute state
  const [disputingSessionId, setDisputingSessionId] = useState<number | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = (await axios.get(
          `/api/mentorships/${mentorshipId}`
        )) as any;
        console.log("[StaffMonitoring] API Res:", res);
        
        if ((res.success || res.isSuccess) && res.data) {
          setMentorship(res.data);
        } else {
          setError(res.message || "Không tìm thấy dữ liệu phiên tư vấn trên hệ thống.");
        }
      } catch (err: any) {
        console.error("[StaffMonitoring] API Error:", err);
        const status = err?.response?.status;
        if (status === 404) setError("Phiên tư vấn không tồn tại (404).");
        else if (status === 403) setError("Bạn không có quyền truy cập phiên tư vấn này (403).");
        else setError(`Lỗi kết nối server (${status || "Unknown"}).`);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [mentorshipId]);

  const handleOpenDispute = async () => {
    if (!disputingSessionId || !disputeReason.trim()) {
      toast.error("Vui lòng nhập lý do tranh chấp.");
      return;
    }

    setIsSubmittingDispute(true);
    try {
      const res = (await MarkSessionDispute(Number(mentorshipId), disputingSessionId, {
        reason: disputeReason.trim(),
      })) as any;

      if (res.success || res.isSuccess) {
        toast.success("Đã mở tranh chấp cho buổi tư vấn này.");
        
        // Update local state
        if (mentorship) {
          setMentorship({
            ...mentorship,
            status: "InDispute",
            sessions: mentorship.sessions.map(s => 
              s.sessionID === disputingSessionId ? { ...s, status: "InDispute" } : s
            )
          });
        }
        
        setDisputingSessionId(null);
        setDisputeReason("");
      } else {
        toast.error(res.message || "Không thể mở tranh chấp.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể mở tranh chấp.");
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span className="ml-3 text-[13px] text-slate-500">
          Đang tải thông tin phiên tư vấn...
        </span>
      </div>
    );
  }

  if (error || !mentorship) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <ShieldAlert className="h-10 w-10 text-red-400" />
        <p className="text-[14px] text-red-500">{error || "Không tìm thấy dữ liệu."}</p>
        <Link
          href="/staff/consulting-ops"
          className="text-[13px] font-bold text-[#eec54e] hover:underline"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const mStatus = mentorship.status || (mentorship as any).mentorshipStatus || (mentorship as any).MentorshipStatus;
  const statusCfg = getStatusConfig(mStatus);

  return (
    <div className="px-8 py-7 pb-12 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link
          href="/staff/consulting-ops"
          className="group flex items-center gap-2 text-[13px] font-bold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Quay lại Vận hành tư vấn
        </Link>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[11px] font-bold",
            statusCfg.badge
          )}
        >
          {statusCfg.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg">
                <Video className="h-7 w-7 text-[#eec54e]" />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-[20px] font-bold tracking-tight text-slate-900">
                  Phiên tư vấn #{mentorship.mentorshipID}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-500">
                  <span className="font-medium text-slate-900">{mentorship.startupName}</span>
                  <span>↔</span>
                  <span className="font-medium text-slate-900">{mentorship.advisorName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Context Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-slate-400">
              Mục tiêu & Thử thách
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1">MÔ TẢ THỬ THÁCH</p>
                <p className="text-[14px] leading-relaxed text-slate-700">{mentorship.challengeDescription}</p>
              </div>
              {mentorship.specificQuestions && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 mb-1">CÂU HỎI CỤ THỂ</p>
                  <p className="text-[14px] leading-relaxed text-slate-700">{mentorship.specificQuestions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sessions Timeline */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[12px] font-bold uppercase tracking-widest text-slate-400">
              Lịch trình buổi họp
            </h3>
            <div className="space-y-4">
              {mentorship.sessions?.length > 0 ? (
                mentorship.sessions.map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100">
                        <Calendar className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-900">
                          {new Date(session.scheduledStartAt).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-[12px] text-slate-500">
                            {new Date(session.scheduledStartAt).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} ({session.durationMinutes} phút)
                          </span>
                        </div>
                      </div>
                    </div>
                    {(() => {
                      const status = session.status || session.sessionStatus || (session as any).SessionStatus;
                      const sessionCfg = getSessionStatusConfig(status);
                      return (
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "rounded-lg px-2.5 py-1 text-[11px] font-bold",
                            sessionCfg.badge
                          )}>
                            {sessionCfg.label}
                          </span>
                          
                          {status !== "InDispute" && status !== "Cancelled" && (
                            <button
                              onClick={() => setDisputingSessionId(session.sessionID)}
                              className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50"
                            >
                              Mở tranh chấp
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-slate-400 italic">Chưa có lịch hẹn được xác nhận.</p>
              )}
            </div>
          </div>

          {/* Reports & Deliverables */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-slate-400">
              Báo cáo & Kết quả
            </h3>
            <div className="space-y-4">
              {mentorship.reports?.length > 0 ? (
                mentorship.reports.map((report, idx) => (
                  <Link
                    key={idx}
                    href={`/staff/consulting-ops/${report.reportID}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-all hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-[#eec54e]" />
                      <div>
                        <p className="text-[14px] font-bold text-slate-900">Báo cáo #{report.reportID}</p>
                        <p className="text-[11px] text-slate-400">Nộp lúc {new Date(report.createdAt).toLocaleString("vi-VN")}</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-300" />
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                  <FileText className="h-6 w-6 text-slate-200 mb-2" />
                  <p className="text-[12px] text-slate-400">Chưa có báo cáo nào được nộp.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-slate-400">Thông tin thanh toán</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate-500">Tổng cộng</span>
                <span className="text-[15px] font-bold text-slate-900">
                  {mentorship.sessionAmount?.toLocaleString()}đ
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate-500">Trạng thái</span>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Đã thanh toán
                </span>
              </div>
              <div className="pt-2 border-t border-slate-50">
                <p className="text-[11px] text-slate-400">Thanh toán được ghi nhận lúc:</p>
                <p className="text-[12px] font-medium text-slate-700 mt-1">
                  {mentorship.paidAt ? new Date(mentorship.paidAt).toLocaleString("vi-VN") : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-slate-400">Đối tác tham gia</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-900">{mentorship.startupName}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Startup</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                  {mentorship.advisorPhotoURL ? (
                    <img src={mentorship.advisorPhotoURL} alt="Advisor" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-900">{mentorship.advisorName}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Advisor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dispute Info if any */}
          {mentorship.status === "InDispute" && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-red-700 mb-3">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="text-[14px] font-bold">Tranh chấp đang mở</h3>
              </div>
              <p className="text-[13px] text-red-600 mb-4 leading-relaxed">
                Phiên tư vấn này đang được đánh dấu tranh chấp. Vui lòng kiểm tra các khiếu nại liên quan.
              </p>
              <Link
                href="/staff/issue-reports"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-[13px] font-bold text-white transition-all hover:bg-red-700"
              >
                <Gavel className="h-4 w-4" />
                Xem tranh chấp
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Dispute Reason Modal */}
      {disputingSessionId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md animate-in zoom-in-95 duration-200 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-slate-900">Mở tranh chấp cho Session #{disputingSessionId}</h3>
              <button 
                onClick={() => setDisputingSessionId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-[13px] text-slate-500 mb-4">
              Vui lòng nhập lý do mở tranh chấp. Session này sẽ được chuyển sang trạng thái <b>Tranh chấp</b> và hiển thị trong danh sách giám sát tranh chấp.
            </p>
            
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Nhập lý do chi tiết..."
              className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-[13px] outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10 transition-all"
            />
            
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setDisputingSessionId(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleOpenDispute}
                disabled={isSubmittingDispute || !disputeReason.trim()}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmittingDispute ? "Đang xử lý..." : "Xác nhận mở"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusConfig(status: string) {
  switch (status) {
    case "InProgress":
      return { label: "Đang diễn ra", badge: "bg-amber-50 text-amber-700 border-amber-200" };
    case "Completed":
      return { label: "Hoàn tất", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "Scheduled":
      return { label: "Đã lên lịch", badge: "bg-blue-50 text-blue-700 border-blue-200" };
    case "InDispute":
      return { label: "Tranh chấp", badge: "bg-red-50 text-red-700 border-red-200" };
    case "Resolved":
      return { label: "Đã giải quyết", badge: "bg-slate-50 text-slate-700 border-slate-200" };
    default:
      return { label: status, badge: "bg-slate-50 text-slate-400 border-slate-100" };
  }
}

function getSessionStatusConfig(status: string) {
  switch (status) {
    case "Scheduled": 
      return { label: "Đã lên lịch", badge: "bg-blue-50 text-blue-600 border-blue-100" };
    case "Conducted": 
      return { label: "Đã tư vấn", badge: "bg-indigo-50 text-indigo-600 border-indigo-100" };
    case "Completed": 
      return { label: "Hoàn tất", badge: "bg-emerald-50 text-emerald-600 border-emerald-100" };
    case "InDispute": 
      return { label: "Tranh chấp", badge: "bg-red-50 text-red-600 border-red-100" };
    case "Resolved": 
      return { label: "Đã giải quyết", badge: "bg-slate-50 text-slate-600 border-slate-100" };
    case "Cancelled": 
      return { label: "Đã hủy", badge: "bg-slate-50 text-slate-500 border-slate-100" };
    default: 
      return { label: status || "N/A", badge: "bg-slate-50 text-slate-500" };
  }
}
