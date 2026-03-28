"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, Clock, CheckCircle2, AlertCircle,
  Flag, Search, Video, Monitor, Users
} from "lucide-react";
import { AdvisorShell } from "@/components/advisor/advisor-shell";
import type { IConsultingSession, ConsultingSessionStatus } from "@/types/advisor-consulting";
import { getMockSessions } from "@/services/advisor/advisor-consulting.mock";
import { cn } from "@/lib/utils";
import { IssueReportModal, type IssueReportContext } from "@/components/shared/issue-report-modal";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TabKey = "upcoming" | "completed";

const STATUS_CFG: Record<ConsultingSessionStatus, { label: string; dot: string; badge: string }> = {
  PENDING_CONFIRMATION: { label: "Chờ xác nhận", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  SCHEDULED: { label: "Đã xác nhận", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  COMPLETED: { label: "Hoàn thành", dot: "bg-slate-400", badge: "bg-slate-50 text-slate-600 border-slate-200" },
  CANCELLED: { label: "Đã huỷ", dot: "bg-red-400", badge: "bg-red-50 text-red-600 border-red-200" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isSameWeek(d: Date, ref: Date) {
  const s = new Date(ref);
  const day = s.getDay();
  const diff = day === 0 ? 6 : day - 1;
  s.setDate(s.getDate() - diff);
  s.setHours(0, 0, 0, 0);
  const e = new Date(s);
  e.setDate(e.getDate() + 7);
  return d >= s && d < e;
}

export default function AdvisorSchedulePage() {
  const [sessions, setSessions] = useState<IConsultingSession[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [issueContext, setIssueContext] = useState<IssueReportContext | null>(null);

  useEffect(() => {
    setSessions(getMockSessions());
  }, []);

  const openIssue = (session: IConsultingSession) => {
    setIssueContext({
      entityType: "CONSULTING_SESSION",
      entityId: session.id,
      entityTitle: `Buổi tư vấn · ${session.objective}`,
      otherPartyName: session.startup.displayName,
    });
  };

  const upcoming = sessions.filter(s => s.status === "PENDING_CONFIRMATION" || s.status === "SCHEDULED");
  const completed = sessions.filter(s => s.status === "COMPLETED" || s.status === "CANCELLED");
  const displayed = activeTab === "upcoming" ? upcoming : completed;

  const now = new Date();
  const thisWeek = upcoming.filter(s => isSameWeek(new Date(s.scheduledStartAt), now)).length;

  const stats = [
    { label: "Sắp tới", value: upcoming.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-100" },
    { label: "Tuần này", value: thisWeek, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-100" },
    { label: "Đã hoàn thành", value: completed.length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-100" },
  ];

  return (
    <AdvisorShell>
      <div className="max-w-[1000px] mx-auto space-y-6 animate-in fade-in duration-400">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 leading-tight">Lịch tư vấn</h1>
          <p className="text-[13px] text-slate-500 mt-1">Theo dõi các buổi tư vấn sắp tới và đã hoàn thành.</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-4 py-3.5 flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center ring-1 shrink-0", s.bg, s.ring)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
              <div>
                <p className="text-[20px] font-bold text-slate-900 leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-1">
          {(["upcoming", "completed"] as TabKey[]).map(key => {
            const label = key === "upcoming" ? "Sắp tới" : "Đã hoàn thành";
            const count = key === "upcoming" ? upcoming.length : completed.length;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5",
                  activeTab === key
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                {label}
                <span className={cn(
                  "text-[10px] rounded-full px-1.5 py-0.5 font-bold leading-none",
                  activeTab === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-100 hover:bg-slate-50/80">
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Startup</TableHead>
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thời gian</TableHead>
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nội dung / Chủ đề</TableHead>
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</TableHead>
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 border-b-0">
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-[14px] font-bold text-slate-900">Không có lịch hẹn</p>
                    <p className="text-[13px] text-slate-500 mt-1">Chưa có phiên tư vấn nào ở trạng thái này.</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((session) => {
                  const cfg = STATUS_CFG[session.status];
                  return (
                    <TableRow key={session.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-[12px] font-bold shadow-sm")}>
                            {session.startup.displayName.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-[14px] font-semibold text-slate-900">{session.startup.displayName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <p className="text-[13px] font-semibold text-slate-700">{formatDate(session.scheduledStartAt)}</p>
                        <p className="text-[11px] text-slate-400">{formatTime(session.scheduledStartAt)} - {formatTime(session.scheduledEndAt)}</p>
                      </TableCell>
                      <TableCell className="px-6 py-4 max-w-[250px]">
                        <p className="text-[13px] font-semibold text-slate-800 truncate">{session.objective}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mt-1">
                          {session.meetingMode === "Google Meet" ? <Video className="w-3.5 h-3.5 text-emerald-500" /> : session.meetingMode === "Microsoft Teams" ? <Monitor className="w-3.5 h-3.5 text-violet-500" /> : <Users className="w-3.5 h-3.5 text-slate-400" />}
                          {session.meetingMode}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap", cfg.badge)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {(session.status === "SCHEDULED" || session.status === "PENDING_CONFIRMATION") && (
                            <button
                              onClick={() => toast.success("Đang mở link họp: " + session.meetingUrl)}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-semibold hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
                            >
                              Tham gia họp
                            </button>
                          )}
                          <Link
                            href={`/advisor/requests/${session.requestId}`}
                            title="Xem chi tiết yêu cầu"
                            className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Search className="w-4 h-4" />
                          </Link>
                          {session.status === "COMPLETED" && (
                            <button
                              onClick={() => openIssue(session)}
                              title="Báo cáo sự cố"
                              className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Flag className="w-4 h-4" />
                            </button>
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
