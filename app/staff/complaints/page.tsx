"use client";

import { cn } from "@/lib/utils";
import { 
  MessageSquareWarning, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  AlertTriangle,
  Flame,
  User,
  ExternalLink,
  ShieldCheck,
  History,
  ChevronDown,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { GetIssueReportsList, CATEGORY_FROM_BE, STATUS_FROM_BE, IssueReportDetailDto } from "@/services/issue-report.api";
import { useEffect, useCallback } from "react";
import { Loader2, XCircle } from "lucide-react";


// Remove static COMPLAINTS_DATA


const SEVERITY_CFG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  CRITICAL: { label: "Nghiêm trọng", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: Flame },
  HIGH: { label: "Cao", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: AlertTriangle },
  MEDIUM: { label: "Trung bình", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: MessageSquareWarning },
  LOW: { label: "Thấp", color: "text-slate-600", bg: "bg-slate-50 border-slate-200", icon: Clock },
};

const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
  NEW: { label: "Mới tạo", dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "Đang xử lý", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  WAITING_EVIDENCE: { label: "Chờ bằng chứng", dot: "bg-purple-500", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  RESOLVED: { label: "Đã xong", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  DISMISSED: { label: "Đã bác bỏ", dot: "bg-slate-400", badge: "bg-slate-50 text-slate-600 border-slate-200" },
  ESCALATED: { label: "Tranh chấp", dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200" },
};

const TAB_MAP: Record<string, string> = {
  ALL: "Tất cả",
  COMPLAINT: "Khiếu nại",
  DISPUTE: "Tranh chấp",
  FLAGGED_FEEDBACK: "Nội dung vi phạm",
};

export default function ComplaintsPage() {
  const [reports, setReports] = useState<IssueReportDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await GetIssueReportsList({
        pageSize: 100 
      });
      if (res.success && res.data) {
        setReports(res.data.items || []);
      } else {
        setError("Không thể tải danh sách khiếu nại.");
      }
    } catch (err) {
      setError("Lỗi khi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredData = useMemo(() => {
    return reports.filter(item => {
      const categoryLabel = CATEGORY_FROM_BE[item.category] || item.category;
      const statusKey = STATUS_FROM_BE[item.status] || "NEW";
      const reporter = item.reporterEmail || "";
      const idStr = String(item.issueReportID);

      const matchesSearch = 
        reporter.toLowerCase().includes(search.toLowerCase()) || 
        idStr.includes(search) ||
        categoryLabel.toLowerCase().includes(search.toLowerCase());
      
      // Principle 3: "Khiếu nại & Tranh chấp" only shows escalated reports (ESCALATED)
      // and potentially Resolved/Dismissed if they were once disputes.
      const isEscalated = statusKey === "ESCALATED" || statusKey === "RESOLVED" || statusKey === "DISMISSED";
      
      const matchesTab = activeTab === "ALL" 
        ? isEscalated 
        : (activeTab === "DISPUTE" && isEscalated);
      
      const matchesSeverity = severityFilter === "ALL";
      const matchesStatus = statusFilter === "ALL" || statusKey === statusFilter;

      return matchesSearch && matchesTab && matchesSeverity && matchesStatus;
    });
  }, [reports, search, activeTab, severityFilter, statusFilter]);


  return (
    <div className="px-8 py-7 pb-16 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight font-plus-jakarta-sans flex items-center gap-2.5">
            <MessageSquareWarning className="w-5 h-5 text-[#eec54e]" />
            Khiếu nại & Tranh chấp
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">Quản lý và giải quyết các khiếu nại, tranh chấp giữa các bên tham gia.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2.5 shadow-sm">
            <Flame className="w-4 h-4 text-red-600" />
            <span className="text-[12px] font-bold text-red-800 font-plus-jakarta-sans">
              {filteredData.length} Yêu cầu trong danh sách
            </span>
          </div>

        </div>
      </div>

      {/* Removed Tabs Section - integrated into Filter Bar */}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full font-plus-jakarta-sans">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Mã số, Người gửi hoặc Đối tượng bị khiếu nại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-[13px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#eec54e]/20 focus:border-[#eec54e] transition-all bg-slate-50/30 font-plus-jakarta-sans"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-plus-jakarta-sans">
          {/* Case Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[13px] font-bold transition-all shadow-sm active:scale-95",
                activeTab !== "ALL" 
                  ? "border-[#eec54e] bg-amber-50 text-[#C8A000]" 
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}>
                <MessageSquareWarning className={cn("w-4 h-4", activeTab !== "ALL" ? "text-[#eec54e]" : "text-slate-400")} />
                <span>{activeTab === "ALL" ? "Tất cả yêu cầu" : TAB_MAP[activeTab]}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1.5 bg-white rounded-2xl shadow-xl border-slate-100 font-plus-jakarta-sans">
              <DropdownMenuRadioGroup value={activeTab} onValueChange={setActiveTab}>
                {Object.entries(TAB_MAP).map(([key, label]) => (
                  <DropdownMenuRadioItem key={key} value={key} className="text-[12px] font-medium py-2 rounded-xl cursor-pointer focus:bg-slate-50">{label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Severity Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[13px] font-bold transition-all shadow-sm active:scale-95",
                severityFilter !== "ALL" 
                  ? "border-[#eec54e] bg-amber-50 text-[#C8A000]" 
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}>
                <ShieldAlert className={cn("w-4 h-4", severityFilter !== "ALL" ? "text-[#eec54e]" : "text-slate-400")} />
                <span>{severityFilter === "ALL" ? "Mọi mức độ" : SEVERITY_CFG[severityFilter].label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1.5 bg-white rounded-2xl shadow-xl border-slate-100 font-plus-jakarta-sans">
              <DropdownMenuRadioGroup value={severityFilter} onValueChange={setSeverityFilter}>
                <DropdownMenuRadioItem value="ALL" className="text-[12px] font-medium py-2 rounded-xl cursor-pointer focus:bg-slate-50">Mọi mức độ</DropdownMenuRadioItem>
                {Object.entries(SEVERITY_CFG).map(([key, cfg]) => (
                  <DropdownMenuRadioItem key={key} value={key} className="text-[12px] font-medium py-2 rounded-xl cursor-pointer focus:bg-slate-50">{cfg.label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[13px] font-bold transition-all shadow-sm active:scale-95",
                statusFilter !== "ALL" 
                  ? "border-[#eec54e] bg-amber-50 text-[#C8A000]" 
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}>
                <ShieldCheck className={cn("w-4 h-4", statusFilter !== "ALL" ? "text-[#eec54e]" : "text-slate-400")} />
                <span>{statusFilter === "ALL" ? "Trạng thái xử lý" : STATUS_CFG[statusFilter].label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1.5 bg-white rounded-2xl shadow-xl border-slate-100 font-plus-jakarta-sans">
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                <DropdownMenuRadioItem value="ALL" className="text-[12px] font-medium py-2 rounded-xl cursor-pointer focus:bg-slate-50">Tất cả trạng thái</DropdownMenuRadioItem>
                {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                  <DropdownMenuRadioItem key={key} value={key} className="text-[12px] font-medium py-2 rounded-xl cursor-pointer focus:bg-slate-50">{cfg.label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reset Button */}
          {(activeTab !== "ALL" || severityFilter !== "ALL" || statusFilter !== "ALL" || search !== "") && (
            <button 
              onClick={() => { setActiveTab("ALL"); setSeverityFilter("ALL"); setStatusFilter("ALL"); setSearch(""); }}
              className="p-2.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all active:scale-95"
              title="Xóa tất cả bộ lọc"
            >
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-plus-jakarta-sans">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-24">Mã số</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nội dung</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Người khiếu nại</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loại thực thể</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thời gian</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-[#eec54e] animate-spin mx-auto mb-3" />
                    <p className="text-[13px] text-slate-400">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <p className="text-[13px] text-red-500">{error}</p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400 italic text-[13px]">
                    Không có khiếu nại nào phù hợp.
                  </td>
                </tr>
              ) : filteredData.map((item) => {
                const categoryLabel = CATEGORY_FROM_BE[item.category] || item.category;
                const statusKey = STATUS_FROM_BE[item.status] || "NEW";
                const severityKey = "MEDIUM"; 
                const SeverityIcon = SEVERITY_CFG[severityKey].icon;

                return (
                  <tr key={item.issueReportID} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="text-[12px] font-bold text-slate-900 font-mono tracking-tighter">#{item.issueReportID}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-bold text-slate-900 font-plus-jakarta-sans">{categoryLabel}</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium truncate max-w-[200px]">{item.description}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <span className="text-[13px] font-bold text-slate-700 font-plus-jakarta-sans truncate max-w-[150px]">{item.reporterEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border font-plus-jakarta-sans bg-blue-50 text-blue-700 border-blue-100")}>
                        {item.relatedEntityType}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border font-plus-jakarta-sans", STATUS_CFG[statusKey].badge)}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_CFG[statusKey].dot)} />
                        {STATUS_CFG[statusKey].label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[12px] font-medium">{new Date(item.submittedAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        href={`/staff/complaints/${item.issueReportID}`}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#eec54e] hover:text-[#e6cc4c] transition-colors group/btn"
                      >
                        Thẩm định
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
