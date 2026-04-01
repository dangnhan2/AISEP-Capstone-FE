"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  ChevronDown,
  Clock,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { 
  KYCSubtype, 
  KYC_SUBTYPE_CONFIGS 
} from "@/types/staff-kyc";

import { GetPendingStartups, GetPendingAdvisors, GetPendingInvestors } from "@/services/staff/staff.api";

// --- Types ---
type KYCListKind = "startup" | "advisor" | "investor";

type KYCStatus = "PENDING" | "IN_REVIEW" | "PENDING_MORE_INFO" | "APPROVED" | "REJECTED";

// --- Helper Functions ---
const AVATAR_COLORS = [
  "from-violet-500 to-violet-600", "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600", "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600", "from-cyan-500 to-cyan-600",
  "from-pink-500 to-pink-600", "from-indigo-500 to-indigo-600",
];

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const STATUS_CFG: Record<KYCStatus, { label: string, badge: string, dot: string }> = {
  PENDING: { label: "Chờ xử lý", badge: "bg-amber-50 text-amber-700 border-amber-200/80", dot: "bg-amber-400" },
  IN_REVIEW: { label: "Đang soát xét", badge: "bg-blue-50 text-blue-700 border-blue-200/80", dot: "bg-blue-400" },
  PENDING_MORE_INFO: { label: "Chờ bổ sung", badge: "bg-purple-50 text-purple-700 border-purple-200/80", dot: "bg-purple-400" },
  APPROVED: { label: "Đã duyệt", badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80", dot: "bg-emerald-400" },
  REJECTED: { label: "Từ chối", badge: "bg-red-50 text-red-700 border-red-200/80", dot: "bg-red-400" },
};

function mapProfileStatusToKycStatus(profileStatus?: string | null): KYCStatus {
  const raw = profileStatus?.toString().trim().toUpperCase();
  if (!raw) return "PENDING";

  if (raw.includes("UNDER_REVIEW") || raw.includes("IN_REVIEW")) return "IN_REVIEW";
  if (raw.includes("PENDING_MORE_INFO") || raw.includes("MORE_INFO")) return "PENDING_MORE_INFO";
  if (raw.includes("APPROVED") || raw.includes("VERIFIED")) return "APPROVED";
  if (raw.includes("FAILED") || raw.includes("REJECT") || raw.includes("VERIFICATION_FAILED")) return "REJECTED";
  if (raw.includes("PENDING") || raw.includes("SUBMITTED") || raw.includes("NOT_SUBMITTED")) return "PENDING";

  return "PENDING";
}

function inferStartupSubtype(startup: IStartup): KYCSubtype {
  const hasLegal = Boolean(startup.bussinessCode?.trim()) || Boolean(startup.fileCertificateBusiness?.trim());
  return hasLegal ? "STARTUP_ENTITY" : "STARTUP_NO_ENTITY";
}

function inferInvestorSubtype(inv: IInvestor): KYCSubtype {
  return inv.firmName?.trim() ? "INSTITUTIONAL_INVESTOR" : "INDIVIDUAL_INVESTOR";
}

export default function KYCPendingListPage() {
  const [listKind, setListKind] = useState<KYCListKind>("startup");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | KYCStatus>("ALL");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [items, setItems] = useState<IStartup[]>([]);
  const [advisorItems, setAdvisorItems] = useState<IAdvisorProfile[]>([]);
  const [investorItems, setInvestorItems] = useState<IInvestor[]>([]);
  const [paging, setPaging] = useState<IPaging | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const query = `page=${page}&pageSize=${pageSize}`;
        const res =
          listKind === "startup"
            ? await GetPendingStartups(query)
            : listKind === "advisor"
              ? await GetPendingAdvisors(query)
              : await GetPendingInvestors(query);
        if (!alive) return;

        if (res?.success || res?.isSuccess) {
          if (listKind === "startup") {
            setItems((res?.data?.items ?? []) as IStartup[]);
            setAdvisorItems([]);
            setInvestorItems([]);
          } else if (listKind === "advisor") {
            setAdvisorItems((res?.data?.items ?? []) as IAdvisorProfile[]);
            setItems([]);
            setInvestorItems([]);
          } else {
            setInvestorItems((res?.data?.items ?? []) as IInvestor[]);
            setItems([]);
            setAdvisorItems([]);
          }
          setPaging(res?.data?.paging ?? null);
        } else {
          setItems([]);
          setAdvisorItems([]);
          setInvestorItems([]);
          setPaging(null);
          setErrorMsg(
            typeof res?.message === "string" ? res.message : "Không thể tải danh sách hồ sơ.",
          );
        }
      } catch (e: any) {
        if (!alive) return;
        setItems([]);
        setAdvisorItems([]);
        setInvestorItems([]);
        setPaging(null);
        setErrorMsg(e?.message ?? "Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [page, pageSize, listKind]);

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (listKind === "startup") {
      return items.filter((s) => {
        const status = mapProfileStatusToKycStatus(s.profileStatus);
        const matchesStatus = statusFilter === "ALL" || status === statusFilter;
        const matchesSearch =
          !q ||
          s.companyName?.toLowerCase().includes(q) ||
          s.fullNameOfApplicant?.toLowerCase().includes(q) ||
          String(s.startupID).toLowerCase().includes(q) ||
          s.bussinessCode?.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      });
    }
    if (listKind === "advisor") {
      return advisorItems.filter((a) => {
        const status = mapProfileStatusToKycStatus(a.profileStatus);
        const matchesStatus = statusFilter === "ALL" || status === statusFilter;
        const matchesSearch =
          !q ||
          a.fullName?.toLowerCase().includes(q) ||
          a.title?.toLowerCase().includes(q) ||
          String(a.advisorID).toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      });
    }
    return investorItems.filter((inv) => {
      const status = mapProfileStatusToKycStatus(inv.profileStatus);
      const matchesStatus = statusFilter === "ALL" || status === statusFilter;
      const matchesSearch =
        !q ||
        inv.fullName?.toLowerCase().includes(q) ||
        inv.firmName?.toLowerCase().includes(q) ||
        String(inv.investorID).toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [listKind, items, advisorItems, investorItems, search, statusFilter]);

  const totalItems = paging?.totalItems ?? 0;
  const canPrev = page > 1;
  const canNext = totalItems > 0 ? page * pageSize < totalItems : false;

  const totalLoaded =
    listKind === "startup" ? items.length : listKind === "advisor" ? advisorItems.length : investorItems.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight font-plus-jakarta-sans">Xét duyệt danh tính (KYC)</h1>
          <p className="text-[13px] text-slate-500 mt-1">Quản lý và thẩm định hồ sơ người dùng trên nền tảng.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "startup" as const, label: "Startup" },
            { id: "advisor" as const, label: "Advisor" },
            { id: "investor" as const, label: "Nhà đầu tư" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setListKind(tab.id);
              setPage(1);
            }}
            className={cn(
              "px-4 py-2 rounded-xl text-[13px] font-bold border transition-all",
              listKind === tab.id
                ? "border-[#eec54e] bg-amber-50 text-[#C8A000] shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs & Search Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên, tổ chức, mã hồ sơ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-[13px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#eec54e]/20 focus:border-[#eec54e] bg-slate-50/30 transition-all font-plus-jakarta-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[13px] font-bold transition-all shadow-sm active:scale-95",
                  statusFilter !== "ALL" 
                    ? "border-[#eec54e] bg-amber-50 text-[#C8A000]" 
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={cn("w-4 h-4", statusFilter !== "ALL" ? "text-[#eec54e]" : "text-slate-400")} />
                    <span>{statusFilter === "ALL" ? "Tất cả trạng thái" : STATUS_CFG[statusFilter].label}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] p-1.5 bg-white rounded-2xl shadow-xl border-slate-100 font-plus-jakarta-sans">
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                  <DropdownMenuRadioItem value="ALL" className="text-[12px] font-medium py-2 rounded-xl">Tất cả trạng thái</DropdownMenuRadioItem>
                  {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                    <DropdownMenuRadioItem key={key} value={key} className="text-[12px] font-medium py-2 rounded-xl">
                      {cfg.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset Button */}
            {(statusFilter !== "ALL" || search !== "") && (
              <button 
                onClick={() => { setStatusFilter("ALL"); setSearch(""); }}
                className="ml-2 p-2.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all active:scale-95"
                title="Xóa tất cả bộ lọc"
              >
                <Filter className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Hồ sơ</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Đối tượng</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Ngày nộp</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Trạng thái</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wide text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4" colSpan={5}>
                      <div className="h-10 bg-slate-50 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : errorMsg ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    {errorMsg}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Không có hồ sơ phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : listKind === "startup" ? (
                (filteredData as IStartup[]).map((startup) => {
                  const status = STATUS_CFG[mapProfileStatusToKycStatus(startup.profileStatus)];
                  const subtype = inferStartupSubtype(startup);

                  const avatarSeed = startup.fullNameOfApplicant || startup.companyName || "—";
                  const displayName = startup.companyName || startup.fullNameOfApplicant || "—";

                  return (
                    <tr key={startup.startupID} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-[15px] font-bold shrink-0 shadow-sm",
                              getAvatarGradient(avatarSeed),
                            )}
                          >
                            {String(avatarSeed).charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                              {displayName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-slate-400 font-mono tracking-tight uppercase">
                                #{startup.startupID}
                              </span>
                              <span className="text-[11px] text-slate-200">•</span>
                              <span className="text-[11px] text-slate-400 leading-none">{startup.fullNameOfApplicant}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-slate-700">Startup</span>
                          <span className="text-[11px] text-slate-400 mt-0.5">{KYC_SUBTYPE_CONFIGS[subtype].label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-slate-600">
                            {startup.createdAt ? new Date(startup.createdAt).toLocaleDateString("vi-VN") : "—"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {startup.createdAt
                                ? new Date(startup.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border",
                            status.badge,
                          )}
                        >
                          <div className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/staff/kyc/${startup.startupID}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#eec54e]/40 bg-white text-[#C8A000] text-[12px] font-bold hover:bg-[#eec54e] hover:text-white hover:border-[#eec54e] hover:scale-105 transition-all shadow-sm active:scale-95"
                          >
                            Thẩm định
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : listKind === "advisor" ? (
                (filteredData as IAdvisorProfile[]).map((a) => {
                  const status = STATUS_CFG[mapProfileStatusToKycStatus(a.profileStatus)];
                  const subtype: KYCSubtype = "ADVISOR";
                  const avatarSeed = a.fullName || "—";
                  const displayName = a.fullName || "—";

                  return (
                    <tr key={a.advisorID} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-[15px] font-bold shrink-0 shadow-sm",
                              getAvatarGradient(avatarSeed),
                            )}
                          >
                            {String(avatarSeed).charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                              {displayName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-slate-400 font-mono tracking-tight uppercase">
                                #{a.advisorID}
                              </span>
                              <span className="text-[11px] text-slate-200">•</span>
                              <span className="text-[11px] text-slate-400 leading-none">{a.title || "—"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-slate-700">Advisor</span>
                          <span className="text-[11px] text-slate-400 mt-0.5">{KYC_SUBTYPE_CONFIGS[subtype].label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-slate-600">
                            {a.createdAt ? new Date(a.createdAt).toLocaleDateString("vi-VN") : "—"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {a.createdAt
                                ? new Date(a.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border",
                            status.badge,
                          )}
                        >
                          <div className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/staff/kyc/advisor/${a.advisorID}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#eec54e]/40 bg-white text-[#C8A000] text-[12px] font-bold hover:bg-[#eec54e] hover:text-white hover:border-[#eec54e] hover:scale-105 transition-all shadow-sm active:scale-95"
                          >
                            Thẩm định
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                (filteredData as IInvestor[]).map((inv) => {
                  const status = STATUS_CFG[mapProfileStatusToKycStatus(inv.profileStatus)];
                  const subtype = inferInvestorSubtype(inv);
                  const avatarSeed = inv.fullName || inv.firmName || "—";
                  const displayName = inv.firmName?.trim() ? inv.firmName : inv.fullName || "—";

                  return (
                    <tr key={inv.investorID} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-[15px] font-bold shrink-0 shadow-sm",
                              getAvatarGradient(avatarSeed),
                            )}
                          >
                            {String(avatarSeed).charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                              {displayName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-slate-400 font-mono tracking-tight uppercase">
                                #{inv.investorID}
                              </span>
                              <span className="text-[11px] text-slate-200">•</span>
                              <span className="text-[11px] text-slate-400 leading-none">{inv.fullName || "—"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-slate-700">Nhà đầu tư</span>
                          <span className="text-[11px] text-slate-400 mt-0.5">{KYC_SUBTYPE_CONFIGS[subtype].label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-slate-600">
                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("vi-VN") : "—"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {inv.createdAt
                                ? new Date(inv.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border",
                            status.badge,
                          )}
                        >
                          <div className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/staff/kyc/investor/${inv.investorID}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#eec54e]/40 bg-white text-[#C8A000] text-[12px] font-bold hover:bg-[#eec54e] hover:text-white hover:border-[#eec54e] hover:scale-105 transition-all shadow-sm active:scale-95"
                          >
                            Thẩm định
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[12px] text-slate-500 font-medium">
            Hiển thị <span className="text-slate-900 font-bold">{filteredData.length}</span> trên {totalLoaded} hồ sơ
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev || loading}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-colors",
                canPrev && !loading
                  ? "border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
                  : "border-slate-200 bg-white text-slate-400 cursor-not-allowed",
              )}
            >
              Trước
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext || loading}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-colors",
                canNext && !loading
                  ? "border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
                  : "border-slate-200 bg-white text-slate-400 cursor-not-allowed",
              )}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
