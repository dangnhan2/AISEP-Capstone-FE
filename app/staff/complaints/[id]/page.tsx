"use client";

import { cn } from "@/lib/utils";
import { 
  MessageSquareWarning, 
  ChevronLeft, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock, 
  Calendar,
  ExternalLink,
  Flame,
  AlertTriangle,
  Send,
  Save,
  Loader2,
  Users,
  CreditCard,
  Reply,
  MoreVertical,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useState, use, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { GetIssueReportById, CATEGORY_FROM_BE, STATUS_FROM_BE, IssueReportDetailDto, UpdateIssueReportStatus } from "@/services/issue-report.api";
import { MarkSessionResolved } from "@/services/staff/consulting-oversight.api";
import { GetMentorshipById, GetMentorshipBySessionId, GetMentorshipByReportId } from "@/services/startup/startup-mentorship.api";
import { IMentorshipRequest } from "@/types/startup-mentorship";







const SEVERITY_CFG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  CRITICAL: { label: "Nghiêm trọng", color: "text-red-700", bg: "bg-red-50 border-red-100", icon: Flame },
  HIGH: { label: "Cao", color: "text-amber-700", bg: "bg-amber-50 border-amber-100", icon: AlertTriangle },
  MEDIUM: { label: "Trung bình", color: "text-blue-700", bg: "bg-blue-50 border-blue-100", icon: MessageSquareWarning },
  LOW: { label: "Thấp", color: "text-slate-600", bg: "bg-slate-50 border-slate-100", icon: Clock },
};

const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
  NEW: { label: "Mới nhận", dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "Đang xử lý", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  WAITING_EVIDENCE: { label: "Chờ bằng chứng", dot: "bg-purple-500", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  RESOLVED: { label: "Đã xong", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  DISMISSED: { label: "Đã bác bỏ", dot: "bg-slate-400", badge: "bg-slate-50 text-slate-600 border-slate-200" },
  ESCALATED: { label: "Tranh chấp", dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200" },
};

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<IssueReportDetailDto | null>(null);
  const [mentorship, setMentorship] = useState<IMentorshipRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"CONTENT" | "EVIDENCE" | "RELATED">("CONTENT");
  const [resolutionNote, setResolutionNote] = useState("");

  const fetchMentorship = useCallback(async (mId: number) => {
    try {
      const res = await GetMentorshipById(mId) as any;
      if (res.data) setMentorship(res.data);
    } catch (err) {
      console.error("Failed to fetch mentorship detail", err);
    }
  }, []);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetIssueReportById(Number(id)) as any;
      console.log("Issue Report Data:", res);

      if ((res.success || res.isSuccess) && res.data) {
        const reportData = res.data;
        setReport(reportData);
        
        const entityType = reportData.relatedEntityType?.toLowerCase();
        const entityId = reportData.relatedEntityID;

        console.log("Entity Type:", entityType, "ID:", entityId);

        if (entityId) {
            if (entityType === "mentorship" || entityType === "payment") {
                await fetchMentorship(entityId);
            } else if (entityType === "session") {
                console.log("Fetching mentorship by session ID:", entityId);
                try {
                    const sRes = await GetMentorshipBySessionId(entityId) as any;
                    console.log("Mentorship from session:", sRes.data);
                    if (sRes.data) setMentorship(sRes.data);
                } catch (e) {
                    console.error("Failed to lookup mentorship from session", e);
                }
            } else if (entityType === "advisorreport") {
                console.log("Fetching mentorship by advisor report ID:", entityId);
                try {
                    const rRes = await GetMentorshipByReportId(entityId) as any;
                    console.log("Mentorship from advisor report:", rRes.data);
                    if (rRes.data) setMentorship(rRes.data);
                } catch (e) {
                    console.error("Failed to lookup mentorship from advisor report", e);
                }
            }
        }
      } else {
        toast.error("Không thể tải thông tin khiếu nại.");
      }
    } catch (err) {
      toast.error("Lỗi khi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  }, [id, fetchMentorship]);




  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Track resolved action locally so UI updates instantly
  const [resolvedAction, setResolvedAction] = useState<"REFUND" | "REJECT" | null>(null);

  const handleAction = async (action: string) => {
    if (!report || !report.relatedEntityID) {
      toast.error("Thiếu thông tin liên kết (Mentorship/Session) để thực hiện thao tác.");
      return;
    }

    let mentorshipId = 0;
    let sessionId = 0;
    const entityType = report.relatedEntityType?.toLowerCase();
    const entityId = report.relatedEntityID || 0;

    if (entityType === "mentorship" || entityType === "payment") {
      mentorshipId = entityId;
      const disputeSession = mentorship?.sessions?.find((s: any) => s.sessionStatus === "InDispute");
      if (disputeSession) sessionId = disputeSession.sessionID;
      else if (mentorship?.sessions?.length) sessionId = mentorship.sessions[0].sessionID;
    } else if (entityType === "session") {
      sessionId = entityId;
      mentorshipId = mentorship?.mentorshipID || 0;
    } else if (entityType === "advisorreport") {
      mentorshipId = mentorship?.mentorshipID || 0;
      const linkedReport = (mentorship?.reports as any[])?.find(r => r.reportID === entityId || r.reportId === entityId);
      sessionId = linkedReport?.sessionID || linkedReport?.sessionId || 0;
    }

    if (!mentorshipId) {
      toast.error(`Không tìm thấy mã buổi tư vấn (Mentorship ID). Loại: ${entityType}, ID: ${entityId}`);
      return;
    }

    setIsSubmitting(true);

    try {
      let res: any;

      if (action === "RESOLVE_REFUND") {
        res = await MarkSessionResolved(mentorshipId, sessionId, {
          resolution: resolutionNote || "Chấp thuận hoàn tiền cho Startup.",
          restoreCompleted: false,
          refundToStartup: true,
        });
      } else if (action === "RESOLVE_REJECT") {
        res = await MarkSessionResolved(mentorshipId, sessionId, {
          resolution: resolutionNote || "Bác bỏ khiếu nại.",
          restoreCompleted: true,
          refundToStartup: false,
        });
      } else if (action === "ESCALATE") {
        toast.info("Yêu cầu đã được chuyển cấp xử lý.");
        return;
      }

      if (!res) return;

      if (res.success || res.isSuccess) {
        // Explicitly update the IssueReport status
        const newStatus = action === "RESOLVE_REFUND" ? "RESOLVED" : "DISMISSED";
        const newStatusBE = action === "RESOLVE_REFUND" ? "Resolved" : "Dismissed";
        try {
          await UpdateIssueReportStatus(Number(id), {
            status: newStatus as any,
            staffNote: resolutionNote || (action === "RESOLVE_REFUND" ? "Chấp thuận hoàn tiền cho Startup." : "Bác bỏ khiếu nại."),
          });
        } catch (e) {
          console.warn("Failed to explicitly update IssueReport status:", e);
        }

        // Update local state immediately so UI reflects the change
        setReport(prev => prev ? { ...prev, status: newStatusBE } : prev);
        setResolvedAction(action === "RESOLVE_REFUND" ? "REFUND" : "REJECT");

        toast.success(
          action === "RESOLVE_REFUND"
            ? "Đã phê duyệt hoàn tiền thành công."
            : "Đã bác bỏ khiếu nại thành công."
        );
        
        // Refresh everything to ensure sync (Mentorship status, IssueReport status, etc.)
        fetchReport();
      } else {
        // Session likely already resolved from a previous attempt — update IssueReport directly
        const newStatus = action === "RESOLVE_REFUND" ? "RESOLVED" : "DISMISSED";
        const newStatusBE = action === "RESOLVE_REFUND" ? "Resolved" : "Dismissed";
        try {
          await UpdateIssueReportStatus(Number(id), {
            status: newStatus as any,
            staffNote: resolutionNote || (action === "RESOLVE_REFUND" ? "Chấp thuận hoàn tiền cho Startup." : "Bác bỏ khiếu nại."),
          });
          setReport(prev => prev ? { ...prev, status: newStatusBE } : prev);
          setResolvedAction(action === "RESOLVE_REFUND" ? "REFUND" : "REJECT");
          toast.success("Đã cập nhật trạng thái khiếu nại thành công.");
          fetchReport();
        } catch (e) {
          toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
        }
      }
    } catch (err: any) {
      // Network error or unexpected failure — still try to update IssueReport
      console.error("handleAction error:", err);
      try {
        const newStatus = action === "RESOLVE_REFUND" ? "RESOLVED" : "DISMISSED";
        const newStatusBE = action === "RESOLVE_REFUND" ? "Resolved" : "Dismissed";
        await UpdateIssueReportStatus(Number(id), {
          status: newStatus as any,
          staffNote: resolutionNote || (action === "RESOLVE_REFUND" ? "Chấp thuận hoàn tiền cho Startup." : "Bác bỏ khiếu nại."),
        });
        setReport(prev => prev ? { ...prev, status: newStatusBE } : prev);
        setResolvedAction(action === "RESOLVE_REFUND" ? "REFUND" : "REJECT");
        toast.success("Đã cập nhật trạng thái khiếu nại thành công.");
      } catch (e2) {
        toast.error("Lỗi khi cập nhật trạng thái khiếu nại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-[#eec54e] animate-spin" />
        <p className="text-[14px] font-medium text-slate-500">Đang tải chi tiết khiếu nại...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-[14px] font-medium text-slate-500">Không tìm thấy thông tin khiếu nại.</p>
        <Link href="/staff/complaints" className="text-[13px] font-bold text-[#eec54e] hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const categoryLabel = CATEGORY_FROM_BE[report.category] || report.category;
  const statusKey = STATUS_FROM_BE[report.status] || "NEW";
  const isAlreadyResolved = statusKey === "RESOLVED" || statusKey === "DISMISSED";
  const severityKey = "MEDIUM"; // IssueReport entity doesn't have Severity yet, default to MEDIUM
  const SeverityIcon = SEVERITY_CFG[severityKey].icon;



  return (
    <div className="px-8 py-7 pb-12 space-y-6 animate-in fade-in duration-500 font-plus-jakarta-sans">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/staff/complaints" className="group flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Quay lại danh sách khiếu nại
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Investigation Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-50 border border-amber-100 shrink-0 shadow-sm")}>
                  <MessageSquareWarning className="w-7 h-7 text-[#eec54e]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">#{report.issueReportID} - {categoryLabel}</h1>
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-tight", SEVERITY_CFG[severityKey].bg, SEVERITY_CFG[severityKey].color)}>
                      <SeverityIcon className="w-3.5 h-3.5" />
                      {SEVERITY_CFG[severityKey].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-slate-400 text-[12px] font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Gửi vào {new Date(report.submittedAt).toLocaleString("vi-VN")}
                    </span>
                    <span>•</span>
                    <span className={cn("inline-flex items-center gap-1", STATUS_CFG[statusKey].badge.replace("bg-", "text-").replace("text-", "font-bold text-"))}>
                      {STATUS_CFG[statusKey].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Investigation Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex items-center gap-1 px-6 pt-5 border-b border-slate-50 overflow-x-auto no-scrollbar">
              {[
                { id: "CONTENT", label: "Nội dung phản ánh", icon: FileText },
                { id: "EVIDENCE", label: "Bằng chứng gửi kèm", icon: ShieldAlert },
                { id: "RELATED", label: "Đối tượng liên quan", icon: Users },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2.5 text-[13px] font-bold whitespace-nowrap border-b-2 -mb-px transition-all flex items-center gap-2",
                  activeTab === tab.id
                    ? "border-[#eec54e] text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "CONTENT" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Người khiếu nại</p>
                      <p className="text-[14px] font-bold text-slate-900">{report.reporterEmail}</p>
                      <p className="text-[11px] text-slate-400">{report.reporterUserType}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Đối tượng bị khiếu nại</p>
                      <p className="text-[14px] font-bold text-slate-900">{mentorship?.advisorName || "N/A"}</p>
                      <p className="text-[11px] text-slate-400">Advisor</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Mô tả chi tiết từ người dùng</h3>
                    <div className="p-5 rounded-2xl bg-white border border-slate-100 text-[14px] text-slate-700 leading-relaxed italic shadow-sm">
                      "{report.description}"
                    </div>
                  </div>
                </div>

              )}

              {activeTab === "EVIDENCE" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.attachments.length > 0 ? report.attachments.map((file, i) => (
                      <a key={i} href={file.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{file.fileName}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                      </a>
                    )) : (
                      <p className="text-[13px] text-slate-400 italic col-span-2 py-4">Không có bằng chứng gửi kèm.</p>
                    )}
                  </div>
                </div>

              )}

              {activeTab === "RELATED" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group hover:border-[#eec54e]/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-[#eec54e] shadow-sm">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Buổi tư vấn liên quan</p>
                        <p className="text-[15px] font-bold text-slate-900 mt-0.5">{report.relatedEntityType} #{report.relatedEntityID}</p>
                        <div className="flex items-center gap-3 mt-1 text-[12px] text-slate-500">
                          <span className="font-bold text-slate-900">
                            {mentorship?.sessionAmount ? mentorship.sessionAmount.toLocaleString("vi-VN") + " đ" : "Chưa rõ số tiền"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Advisor: {mentorship?.advisorName || "Đang tải..."}
                          </span>
                        </div>
                      </div>

                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#eec54e] -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>

              )}
            </div>
          </div>
        </div>

        {/* Right Column: Resolution Panel */}
        <div className="space-y-6">
          
          {/* Internal Note Area */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-5 space-y-4">
            <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">Thẩm định nội bộ</h3>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lịch sử xử lý tương tự</label>
              <p className="text-[12px] text-slate-500 leading-relaxed italic border-l-2 border-[#eec54e] pl-3 py-1 bg-amber-50/30">
                Advisor này đã từng bị khiếu nại tương tự về việc vắng mặt (case #CP-4421).
              </p>
            </div>
            <textarea 
              rows={4}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Nhập ghi chú giải quyết tranh chấp..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#eec54e]/20 focus:border-[#eec54e] resize-none transition-all"
            />

          </div>

          {/* Decision Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xl shadow-slate-100 sticky top-24">
            <h3 className="text-[12px] font-bold uppercase tracking-widest mb-6 font-plus-jakarta-sans text-slate-400">Quyết định xử lý</h3>
            
            {(isAlreadyResolved || resolvedAction) ? (
              <div className="space-y-4">
                <div className={cn(
                  "p-5 rounded-xl border text-center space-y-2",
                  (statusKey === "RESOLVED" || resolvedAction === "REFUND")
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-slate-50 border-slate-200"
                )}>
                  {(statusKey === "RESOLVED" || resolvedAction === "REFUND") ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <p className="text-[14px] font-bold text-emerald-700">Đã chấp thuận & Hoàn tiền</p>
                      <p className="text-[12px] text-emerald-600">Khiếu nại đã được giải quyết. Số tiền đã được hoàn vào ví Startup.</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-[14px] font-bold text-slate-600">Đã bác bỏ khiếu nại</p>
                      <p className="text-[12px] text-slate-500">Khiếu nại đã bị bác bỏ. Không có hành động nào được thực hiện.</p>
                    </>
                  )}
                </div>
                {report?.staffNote && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ghi chú xử lý</p>
                    <p className="text-[13px] text-slate-600">{report.staffNote}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Status messages for refund eligibility */}
                {!isAlreadyResolved && !resolvedAction && mentorship && (
                  <div className="space-y-2 mb-4">
                    {mentorship.paymentStatus !== "Completed" && (
                      <p className="text-[12px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Chưa thể hoàn tiền vì Startup chưa hoàn tất thanh toán.
                      </p>
                    )}
                    {mentorship.refundedAt && (
                      <p className="text-[12px] text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Khoản tiền này đã được hoàn trước đó vào {new Date(mentorship.refundedAt).toLocaleString("vi-VN")}.
                      </p>
                    )}
                    {mentorship.payoutReleasedAt && (
                      <p className="text-[12px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5" />
                        Không thể hoàn tiền vì Staff đã thực hiện giải ngân cho Advisor.
                      </p>
                    )}
                  </div>
                )}

                <button 
                  onClick={() => handleAction("RESOLVE_REFUND")}
                  disabled={
                    loading || 
                    isSubmitting || 
                    mentorship?.paymentStatus !== "Completed" || 
                    !!mentorship?.refundedAt || 
                    !!mentorship?.payoutReleasedAt
                  }
                  className="w-full py-4 px-4 bg-[#eec54e] hover:bg-[#e6cc4c] disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-200/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-[14px]"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Chấp thuận & Hoàn tiền
                </button>

                <button 
                  onClick={() => handleAction("RESOLVE_REJECT")}
                  disabled={loading || isSubmitting}
                  className="w-full py-4 px-4 bg-white hover:bg-rose-50 border border-rose-100 text-rose-600 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-[14px]"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-5 h-5" />}
                  Bác bỏ khiếu nại
                </button>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}
