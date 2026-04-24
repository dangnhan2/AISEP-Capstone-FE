"use client";

import { cn } from "@/lib/utils";
import {
  History,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  GetKYCHistory,
  IKYCHistoryItem,
} from "@/services/staff/registration.api";

const ROLE_LABELS: Record<string, string> = {
  STARTUP: "Startup",
  ADVISOR: "Advisor",
  INVESTOR: "Investor",
};

const ROLE_COLORS: Record<string, string> = {
  STARTUP: "bg-blue-50 text-blue-700 border-blue-100",
  ADVISOR: "bg-purple-50 text-purple-700 border-purple-100",
  INVESTOR: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

const RESULT_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  APPROVED: { label: "Đã duyệt", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  REJECTED: { label: "Từ chối", className: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  PENDING_MORE_INFO: { label: "Yêu cầu bổ sung", className: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
};

export default function KYCHistoryPage() {
  const [page, setPage] = useState(1);
  const [roleType, setRoleType] = useState<"STARTUP" | "ADVISOR" | "INVESTOR" | "">("");
  const [result, setResult] = useState<"APPROVED" | "REJECTED" | "PENDING_MORE_INFO" | "">("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["kyc-history", page, roleType, result],
    queryFn: async () => {
      const res = await GetKYCHistory({ page, pageSize: 20, roleType, result });
      return (res as any)?.data ?? null;
    },
    staleTime: 30_000,
  });

  const items: IKYCHistoryItem[] = data?.items ?? [];
  const paging = data?.paging;
  const totalPages = paging?.totalPages ?? 1;

  const filtered = search
    ? items.filter((i) =>
        i.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        (i.reviewedBy ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="px-8 py-7 pb-16 space-y-6 animate-in fade-in duration-400">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/staff/kyc"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-[13px] font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>
      </div>

      <div>
        <h1 className="text-[20px] font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <History className="w-5 h-5 text-[#eec54e]" />
          Lịch sử thẩm định KYC
        </h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Xem lại các quyết định thẩm định đã thực hiện.
          {paging && (
            <span className="ml-1 text-slate-400">— {paging.totalItems} hồ sơ</span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 py-4 flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />

        {/* Role filter */}
        <select
          value={roleType}
          onChange={(e) => { setRoleType(e.target.value as any); handleFilterChange(); }}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-[12px] font-medium text-slate-600 bg-white focus:outline-none focus:border-[#eec54e] cursor-pointer transition-colors"
        >
          <option value="">Tất cả loại</option>
          <option value="STARTUP">Startup</option>
          <option value="ADVISOR">Advisor</option>
          <option value="INVESTOR">Investor</option>
        </select>

        {/* Result filter */}
        <select
          value={result}
          onChange={(e) => { setResult(e.target.value as any); handleFilterChange(); }}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-[12px] font-medium text-slate-600 bg-white focus:outline-none focus:border-[#eec54e] cursor-pointer transition-colors"
        >
          <option value="">Tất cả kết quả</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
          <option value="PENDING_MORE_INFO">Yêu cầu bổ sung</option>
        </select>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tên người nộp, người duyệt..."
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); if (!e.target.value) setSearch(""); }}
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-xl text-[12px] w-64 focus:outline-none focus:ring-2 focus:ring-[#eec54e]/10 focus:bg-white focus:border-[#eec54e] transition-all"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <p className="text-[13px] text-slate-400">Không thể tải dữ liệu. Vui lòng thử lại.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <History className="w-8 h-8 text-slate-200" />
            <p className="text-[13px] font-medium text-slate-400">Chưa có lịch sử thẩm định</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Người nộp</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Loại</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Kết quả</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Người duyệt</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Ghi chú</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item, i) => {
                const resCfg = RESULT_CONFIG[item.result] ?? RESULT_CONFIG.APPROVED;
                const ResIcon = resCfg.icon;
                const reviewedByLabel = item.reviewedBy || "—";
                return (
                  <tr key={`${item.applicantId}-${i}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-[13px] font-bold text-slate-900">{item.applicantName}</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border", ROLE_COLORS[item.roleType])}>
                        {ROLE_LABELS[item.roleType] ?? item.roleType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold border", resCfg.className)}>
                        <ResIcon className="w-3 h-3" />
                        {resCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">
                      {item.reviewedBy ? reviewedByLabel : <span className="italic text-slate-400">{reviewedByLabel}</span>}
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-400 max-w-[200px] truncate" title={item.remarks ?? ""}>
                      {item.remarks || <span className="italic">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[12px] font-medium">
                          {new Date(item.processedAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-slate-400">
            Trang {page} / {totalPages}
            {paging && <span className="ml-1">· {paging.totalItems} hồ sơ</span>}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
