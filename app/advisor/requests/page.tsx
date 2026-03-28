"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, AlertCircle, X, ChevronRight, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvisorShell } from "@/components/advisor/advisor-shell";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GetMentorships, AcceptMentorship, RejectMentorship } from "@/services/mentorships/mentorship.api";
import { MentorshipDetailModal } from "@/components/startup/mentorship-detail-modal";

const REQUESTS_PAGE_SIZE = 10;

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "Requested", label: "Chờ xử lý" },
  { key: "Accepted", label: "Đã nhận" },
  { key: "InProgress", label: "Đang diễn ra" },
  { key: "Completed", label: "Đã hoàn thành" },
  { key: "Rejected", label: "Đã từ chối" },
  { key: "Cancelled", label: "Đã huỷ" },
];

function getStatusBadge(statusKey: string) {
  switch (statusKey) {
    case "Requested": return { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" };
    case "Accepted": return { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "InProgress": return { dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700 border-blue-200" };
    case "Completed": return { dot: "bg-indigo-400", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" };
    case "Rejected": return { dot: "bg-red-400", badge: "bg-red-50 text-red-700 border-red-200" };
    case "Cancelled": return { dot: "bg-gray-400", badge: "bg-gray-50 text-gray-700 border-gray-200" };
    default: return { dot: "bg-slate-400", badge: "bg-slate-50 text-slate-700 border-slate-200" };
  }
}

function getStatusLabel(statusKey: string) {
  const tab = TABS.find((t) => t.key === statusKey);
  return tab?.label || statusKey;
}

export default function AdvisorRequestsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showDetail, setShowDetail] = useState(false);
  const [selectedMentorshipId, setSelectedMentorshipId] = useState<number | null>(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await GetMentorships({
        page: page,
        pageSize: REQUESTS_PAGE_SIZE,
        key: activeTab === "all" ? "" : activeTab
      });
      const data = response.data?.data || [];
      const total = response.data?.total || 0;
      setRequests(data);
      setTotalItems(Number(total));
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Lỗi tải dữ liệu yêu cầu tư vấn");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab, page]);

  const handleAccept = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn CHẤP NHẬN yêu cầu tư vấn này?")) return;
    setIsProcessing(true);
    try {
      await AcceptMentorship(id);
      toast.success("Đã chấp nhận yêu cầu!");
      fetchRequests();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi chấp nhận yêu cầu");
    } finally {
      setIsProcessing(false);
    }
  };

  const openReject = (id: number) => {
    setRejectingId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    setIsProcessing(true);
    try {
      await RejectMentorship(rejectingId, rejectReason);
      toast.success("Đã từ chối yêu cầu!");
      setShowRejectModal(false);
      setRejectingId(null);
      fetchRequests();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi từ chối yêu cầu");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = Math.ceil(totalItems / REQUESTS_PAGE_SIZE);

  return (
    <AdvisorShell>
      <div className="max-w-[1000px] mx-auto space-y-5 animate-in fade-in duration-400">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 leading-tight">Yêu cầu tư vấn</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Quản lý và phản hồi các yêu cầu từ Startup.</p>
        </div>

        {/* Tabs */}
        {/* <div className="flex items-center gap-1 overflow-x-auto bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={cn(
                "px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all",
                activeTab === tab.key
                  ? "bg-[#0f172a] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div> */}

        {/* Table wrapper */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-100 hover:bg-slate-50/80">
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Startup</TableHead>
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thách thức</TableHead>
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</TableHead>
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ngày gửi</TableHead>
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 border-b-0">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="inline-flex w-8 h-8 border-4 border-slate-200 border-t-[#eec54e] rounded-full animate-spin"></div>
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-[14px] font-bold text-slate-900">Không có dữ liệu</p>
                    <p className="text-[13px] text-slate-500 mt-1">Chưa có yêu cầu tư vấn nào.</p>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((item) => {
                  const statusKey = item.mentorshipStatus;
                  const cfg = getStatusBadge(statusKey);
                  return (
                    <TableRow key={item.mentorshipID} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          <p className="text-[14px] font-semibold text-slate-900">{item.startupName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 max-w-[250px]">
                        <p className="text-[13px] text-slate-600 line-clamp-2">{item.challengeDescription || "--"}</p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border", cfg.badge)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                          {getStatusLabel(statusKey)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <p className="text-[13px] font-medium text-slate-600">
                          {new Date(item.requestedAt || item.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedMentorshipId(item.mentorshipID);
                              setShowDetail(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          {statusKey === "Requested" && (
                            <>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleAccept(item.mentorshipID)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50"
                                title="Chấp nhận"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                disabled={isProcessing}
                                onClick={() => openReject(item.mentorshipID)}
                                className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                title="Từ chối"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        isActive={page === p}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <MentorshipDetailModal
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
          setSelectedMentorshipId(null);
        }}
        mentorshipId={selectedMentorshipId}
      />

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isProcessing && setShowRejectModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-bold text-slate-900 mb-2">Từ chối Yêu cầu</h3>
            <p className="text-[13px] text-slate-500 mb-4">Xin vui lòng cung cấp lý do từ chối yêu cầu tư vấn này. Lý do sẽ được gửi cho Startup.</p>
            <textarea
              className="w-full h-32 p-3 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 disabled:opacity-50"
              placeholder="Nhập lý do..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={isProcessing}
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                disabled={isProcessing}
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                disabled={isProcessing}
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-[13px] font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdvisorShell>
  );
}
