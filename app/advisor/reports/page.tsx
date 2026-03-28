"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search, Inbox, FileText, ChevronRight,
  AlertCircle, Edit3, Flag, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvisorShell } from "@/components/advisor/advisor-shell";
import type { IConsultationReport, ConsultationReportStatus } from "@/types/advisor-report";
import type { IConsultingSession } from "@/types/advisor-consulting";
import { getAdvisorReports } from "@/services/advisor/advisor-report.api";
import { getMockSessions } from "@/services/advisor/advisor-consulting.mock";
import { IssueReportModal, type IssueReportContext } from "@/components/shared/issue-report-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TabKey = "all" | "pending" | ConsultationReportStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ báo cáo" },
  { key: "DRAFT", label: "Bản nháp" },
  { key: "SUBMITTED", label: "Đang chờ duyệt" },
  { key: "NEEDS_REVISION", label: "Cần chỉnh sửa" },
  { key: "FINALIZED", label: "Đã hoàn tất" },
];

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Bản nháp",
  SUBMITTED: "Đang chờ duyệt",
  UNDER_REVIEW: "Đang thẩm định",
  NEEDS_REVISION: "Cần chỉnh sửa",
  FINALIZED: "Đã hoàn tất",
  DELETED: "Đã xóa",
  pending: "Cần viết báo cáo",
};

const STATUS_CFG: Record<string, { dot: string; badge: string }> = {
  DRAFT: { dot: "bg-slate-400", badge: "bg-slate-50 text-slate-600 border-slate-200" },
  SUBMITTED: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  UNDER_REVIEW: { dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  NEEDS_REVISION: { dot: "bg-red-400", badge: "bg-red-50 text-red-600 border-red-200" },
  FINALIZED: { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  DELETED: { dot: "bg-gray-400", badge: "bg-gray-50 text-gray-500 border-gray-200" },
  pending: { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700 border-amber-200 uppercase tracking-widest" }
};

function formatDate(iso?: string) {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric", 
    hour: "2-digit", minute: "2-digit"
  });
}

function getAvatarColor(name: string): string {
  const AVATAR_COLORS = [
    "from-violet-500 to-violet-600", "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600", "from-rose-500 to-rose-600",
    "from-amber-500 to-amber-600", "from-cyan-500 to-cyan-600",
    "from-pink-500 to-pink-600", "from-indigo-500 to-indigo-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function AdvisorReportsPage() {
  const [reports, setReports] = useState<IConsultationReport[]>([]);
  const [pendingSessions, setPendingSessions] = useState<IConsultingSession[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [issueContext, setIssueContext] = useState<IssueReportContext | null>(null);

  const openIssue = (report: IConsultationReport) => {
    setIssueContext({
      entityType: "CONSULTING_REPORT",
      entityId: report.id,
      entityTitle: `Báo cáo · ${report.title}`,
      otherPartyName: report.startup.displayName,
    });
  };

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [repData, sesData] = await Promise.all([
          getAdvisorReports(),
          getMockSessions("COMPLETED")
        ]);
        const existingSessionIds = new Set(repData.map(r => r.sessionId));
        const pending = sesData.filter(s => !existingSessionIds.has(s.id));
        setReports(repData);
        setPendingSessions(pending);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const displayedItems = useMemo(() => {
    let combined: any[] = [];
    
    if (activeTab === "all" || activeTab === "pending") {
      combined = [...combined, ...pendingSessions.map(s => ({ ...s, type: 'session' }))];
    }
    
    if (activeTab !== "pending") {
      let filteredReports = reports;
      if (activeTab !== "all") {
        filteredReports = filteredReports.filter(r => r.status === activeTab);
      }
      combined = [...combined, ...filteredReports.map(r => ({ ...r, type: 'report' }))];
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      combined = combined.filter(item => {
        if (item.type === 'session') {
          return item.objective.toLowerCase().includes(q) || item.startup.displayName.toLowerCase().includes(q);
        } else {
          return item.title.toLowerCase().includes(q) || item.startup.displayName.toLowerCase().includes(q);
        }
      });
    }

    return combined;
  }, [reports, pendingSessions, activeTab, search]);

  return (
    <AdvisorShell>
      <div className="max-w-[1000px] mx-auto space-y-6 animate-in fade-in duration-400">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-bold text-slate-900 leading-tight">Báo cáo tư vấn</h1>
            <p className="text-[13px] text-slate-500 mt-1 font-medium">Lưu trữ và duyệt báo cáo kết quả tư vấn.</p>
          </div>
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text"
              placeholder="Tìm theo tiêu đề, startup..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#eec54e]/20 focus:border-[#eec54e] transition-all bg-white placeholder:text-slate-400 font-medium shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-1">
          {TABS.map(tab => {
            let count = 0;
            if (tab.key === "all") count = reports.length + pendingSessions.length;
            else if (tab.key === "pending") count = pendingSessions.length;
            else count = reports.filter(r => r.status === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5",
                  activeTab === tab.key
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-black leading-none",
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Table wrapper */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-100 hover:bg-slate-50/80">
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Startup</TableHead>
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tiêu đề / Phiên hướng dẫn</TableHead>
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Đánh giá chung</TableHead>
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</TableHead>
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 border-b-0">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="inline-flex w-8 h-8 border-4 border-slate-200 border-t-[#0f172a] rounded-full animate-spin"></div>
                  </TableCell>
                </TableRow>
              ) : displayedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-[14px] font-bold text-slate-900">Không có dữ liệu</p>
                    <p className="text-[13px] text-slate-500 mt-1">Chưa có báo cáo nào ở trạng thái này.</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayedItems.map((item, idx) => {
                  const isSession = item.type === "session";
                  const avatarGradient = getAvatarColor(item.startup.displayName);
                  const statusKey = isSession ? "pending" : item.status;
                  const cfg = STATUS_CFG[statusKey];

                  return (
                    <TableRow key={isSession ? `s-${item.id}` : `r-${item.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[12px] font-bold shadow-sm", avatarGradient)}>
                            {item.startup.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-slate-900 leading-none">{item.startup.displayName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <p className="text-[13px] font-semibold text-slate-800 line-clamp-1">{isSession ? item.objective : item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isSession ? `Hoàn thành ${formatDate(item.completedAt)}` : `Cập nhật ${formatDate(item.lastEditedAt)}`}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {isSession || !item.rating ? (
                           <span className="text-[11px] text-slate-400 italic">--</span>
                        ) : (
                          <div className="flex items-center justify-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={cn("w-3.5 h-3.5", s <= item.rating.overall ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap", cfg.badge)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                          {STATUS_LABEL[statusKey]}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {isSession ? (
                            <Link
                              href={`/advisor/reports/create?sessionId=${item.id}`}
                              className="px-3 py-1.5 bg-[#0f172a] text-white rounded-lg text-[11px] font-bold shadow-sm hover:bg-[#1e293b] transition-all flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Viết báo cáo
                            </Link>
                          ) : (
                            <>
                              <Link
                                href={`/advisor/reports/${item.id}`}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-[#eec54e] hover:text-white transition-all whitespace-nowrap"
                              >
                                <FileText className="w-3.5 h-3.5" /> Mở chi tiết
                              </Link>
                              {(item.status === "FINALIZED" || item.status === "SUBMITTED") && (
                                <button
                                  onClick={() => openIssue(item)}
                                  title="Báo cáo sự cố"
                                  className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Flag className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <IssueReportModal
        isOpen={!!issueContext}
        onClose={() => setIssueContext(null)}
        context={issueContext ?? undefined}
      />
    </AdvisorShell>
  );
}
