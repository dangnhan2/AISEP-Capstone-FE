"use client";

import {
  Star, Search, ChevronDown, Users, Briefcase, FileText, X, ArrowUpDown, BadgeCheck,
  CalendarCheck, Video, Monitor
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { MentorshipDetailModal } from "@/components/startup/mentorship-detail-modal";
import { MentorshipRequestModal } from "@/components/startup/mentorship-request-modal";
import { SessionReviewModal } from "@/components/startup/session-review-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { StartupShell } from "@/components/startup/startup-shell";
import { SearchAdvisors } from "@/services/advisor/advisor.api";
import { GetMentorshipById, GetMentorships } from "@/services/mentorships/mentorship.api";



// ─── Helper Components ────────────────────────────────────────────────────────

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 bg-[#0f172a] text-white text-[13px] font-medium rounded-xl shadow-lg pointer-events-none">
      {msg}
    </div>
  );
}

const REQUESTS_PAGE_SIZE = 10;

type AdvisorCard = {
  id: number;
  name: string;
  headline: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  completedSessions: number;
  yearsOfExperience: number;
  expertise: string[];
  domainTags: string[];
  suitableFor: string[];
  isVerified: boolean;
  availabilityHint: string;
  hourlyRate: number;
  supportedDurations: number[];
};

// type RequestItem = {
//   id: number;
//   advisor: {
//     name: string;
//     title: string;
//     avatar: string;
//   };
//   challenge: string;
//   date: string;
//   type: string;
//   typeLabel: string;
//   statusKey: string;
//   status: string;
//   statusColor: string;
// };

const formatDate = (input?: string) => {
  if (!input) return "--";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("vi-VN");
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Requested":
      return "text-blue-600 bg-blue-50 border-blue-100";
    case "Accepted":
      return "text-teal-600 bg-teal-50 border-teal-100";
    case "InProgress":
      return "text-indigo-600 bg-indigo-50 border-indigo-100";
    case "Completed":
    case "Resolved":
      return "text-green-600 bg-green-50 border-green-100";
    case "Rejected":
    case "InDispute":
      return "text-red-500 bg-red-50 border-red-100";
    case "Cancelled":
    case "Expired":
      return "text-slate-500 bg-slate-50 border-slate-100";
    default:
      return "text-slate-500 bg-slate-50 border-slate-100";
  }
};

const normalizeMentorshipStatus = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "requested":
    case "pending":
    case "chờ phản hồi":
      return { key: "Requested", label: "Chờ phản hồi" };
    case "accepted":
    case "đã chấp nhận":
      return { key: "Accepted", label: "Đã chấp nhận" };
    case "inprogress":
      return { key: "InProgress", label: "Đang diễn ra" };
    case "completed":
    case "hoàn thành":
      return { key: "Completed", label: "Hoàn thành" };
    case "rejected":
    case "từ chối":
      return { key: "Rejected", label: "Từ chối" };
    case "cancelled":
    case "đã hủy":
      return { key: "Cancelled", label: "Đã hủy" };
    case "indispute":
      return { key: "InDispute", label: "Đang tranh chấp" };
    case "resolved":
      return { key: "Resolved", label: "Đã giải quyết" };
    case "expired":
      return { key: "Expired", label: "Đã hết hạn" };
    default:
      return { key: status || "--", label: status || "--" };
  }
};



// ─── Main Component ───────────────────────────────────────────────────────────

export default function StartupAdvisorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Find tab state
  const [search, setSearch] = useState("");
  const [advisorPage, setAdvisorPage] = useState(1);
  const [advisorPageSize, setAdvisorPageSize] = useState(10);
  const [advisorTotal, setAdvisorTotal] = useState(0);
  const [advisor, setAdvisors] = useState<IAdvisorSearchResult[]>([]);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [advisorError, setAdvisorError] = useState<string | null>(null);

  const [showMentorshipDetail, setShowMentorshipDetail] = useState(false);
  const [selectedMentorshipId, setSelectedMentorshipId] = useState<number | null>(null);

  const [requestStatusFilter, setRequestStatusFilter] = useState("all");
  const [sessionStatusFilter, setSessionStatusFilter] = useState("all");
  const [reportStatusFilter, setReportStatusFilter] = useState("all");
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestItems, setRequestItems] = useState<IMentorship[]>([]);
  const [requestsTotalItems, setRequestsTotalItems] = useState(0);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  const advisorTotalItems = advisorTotal;
  const advisorItems = Array.isArray(advisor) ? advisor : [];
  const totalPages = Math.max(1, Math.ceil(advisorTotalItems / advisorPageSize));
  const SESSIONS: any[] = [];
  const REPORTS: any[] = [];

  const filteredRequests = requestItems;
  const filteredSessions = sessionStatusFilter === "all" ? SESSIONS : SESSIONS.filter(s => s.status === sessionStatusFilter);
  const filteredReports = reportStatusFilter === "all" ? REPORTS : reportStatusFilter === "pending" ? REPORTS.filter(r => r.rating === 0) : REPORTS.filter(r => r.rating > 0);

  // Tab derived from URL — no local state needed
  const VALID_TABS = ["find", "requests", "sessions", "reports"] as const;
  type TabKey = typeof VALID_TABS[number];
  const tabParam = searchParams.get("tab") as TabKey | null;
  const activeTab: TabKey = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "find";
  const setTab = (tab: TabKey) => router.replace(`/startup/experts?tab=${tab}`);

  // Modals
  const [selectedAdvisor, setSelectedAdvisor] = useState<IAdvisorSearchResult | null>(null);
  const selectedAdvisorForModal = selectedAdvisor ? { id: selectedAdvisor.advisorID, name: selectedAdvisor.fullName, avatar: selectedAdvisor.profilePhotoURL, title: selectedAdvisor.title, hourlyRate: 0, supportedDurations: [30, 60] } : null;
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => setToast(msg);

  const clearFilters = () => {
    setSearch("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchAdvisors = async () => {
        setIsAdvisorLoading(true);
        setAdvisorError(null);
        try {
          const response = await SearchAdvisors({
            key: search,
            page: advisorPage,
            pageSize: advisorPageSize,
          });

          console.log(response);
          const items = response.data?.data || [];
          setAdvisors(items);
        } catch {
          setAdvisors([]);
          setAdvisorTotal(0);
          setAdvisorError("Không thể tải danh sách cố vấn. Vui lòng thử lại.");
        } finally {
          setIsAdvisorLoading(false);
        }
      };

      fetchAdvisors();
    }, 350);

    return () => clearTimeout(timer);
  }, [search, advisorPage, advisorPageSize]);


  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleOpenRequest = (advisor: IAdvisorSearchResult) => {
    setSelectedAdvisor(advisor);
    setShowRequestModal(true);
  };

  const handleViewMentorshipDetail = async (id: number) => {
    try {
      await GetMentorshipById(id);
      router.push(`/startup/mentorship-requests/${id}`);
    } catch {
      showToast("Không thể tải chi tiết yêu cầu lúc này.");
    }
  };

  useEffect(() => {
    if (activeTab !== "requests") return;

    const fetchMentorships = async () => {
      setIsRequestsLoading(true);
      setRequestsError(null);
      try {
        const response = await GetMentorships({
          page: requestsPage,
          pageSize: REQUESTS_PAGE_SIZE,
          key: requestStatusFilter === "all" ? "" : requestStatusFilter,
        });

        console.log(response);
        const payload = response.data;
        const items = Array.isArray(payload?.data) ? payload.data : [];
        setRequestItems(items);
        setRequestsTotalItems(Number(payload?.total || 0));
      } catch {
        setRequestItems([]);
        setRequestsTotalItems(0);
        setRequestsError("Không thể tải danh sách yêu cầu.");
      } finally {
        setIsRequestsLoading(false);
      }
    };

    fetchMentorships();
  }, [activeTab, requestStatusFilter, requestsPage]);

  const requestsTotalPages = Math.max(1, Math.ceil(requestsTotalItems / REQUESTS_PAGE_SIZE));

  // ─── Tabs ──────────────────────────────────────────────────────────────────

  const tabs = [
    { key: "find" as const, label: "Tìm cố vấn" },
    { key: "requests" as const, label: "Yêu cầu của tôi" },
    { key: "sessions" as const, label: "Các phiên hướng dẫn" },
    { key: "reports" as const, label: "Báo cáo & Đánh giá" },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <StartupShell>
      <div className="max-w-[1100px] mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Cố vấn & Chuyên gia</h1>
            <p className="text-slate-500 text-[14px] font-medium mt-1">Tìm kiếm và kết nối với cố vấn phù hợp cho startup của bạn.</p>
          </div>
          <button
            onClick={() => setTab("requests")}
            className="px-4 py-2.5 bg-[#fdf8e6] text-slate-800 border border-[#eec54e]/30 rounded-xl text-[13px] font-semibold hover:bg-[#eec54e] transition-all"
          >
            Yêu cầu của tôi ({requestsTotalItems})
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={cn(
                "pb-4 text-[14px] font-bold transition-all relative tracking-tight",
                activeTab === tab.key ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#eec54e] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "find" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="w-full pl-9 pr-3 py-2.5 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-all placeholder:text-slate-400"
                  placeholder="Tìm theo chuyên môn, ngành, tên cố vấn..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setAdvisorPage(1); }}
                />
              </div>

              {search && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Advisor Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {isAdvisorLoading && (
                <div className="col-span-full py-16 text-center">
                  <p className="text-[15px] font-semibold text-slate-500">Đang tải danh sách cố vấn...</p>
                </div>
              )}

              {advisorError && !isAdvisorLoading && (
                <div className="col-span-full py-16 text-center">
                  <p className="text-[15px] font-semibold text-red-500">{advisorError}</p>
                </div>
              )}

              {!isAdvisorLoading && !advisorError && advisorItems.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-[15px] font-semibold text-slate-400">Không tìm thấy cố vấn phù hợp</p>
                  <p className="text-[13px] text-slate-400 mt-1">Thử mở rộng tiêu chí tìm kiếm hoặc xóa bộ lọc.</p>
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-200 transition-colors">Xóa bộ lọc</button>
                </div>
              )}

              {!isAdvisorLoading && !advisorError && advisorItems.map(advisor => (
                <div key={advisor.advisorID} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 p-6">
                  {/* Top row */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={advisor.profilePhotoURL}
                      alt={advisor.fullName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[15px] font-semibold text-slate-900">{advisor.fullName}</span>
                      </div>
                      <p className="text-[12px] text-slate-400 mt-0.5">{advisor.title}</p>
                    </div>
                  </div>

                  {/* Trust row */}
                  <div className="flex items-center gap-1 text-[12px] text-slate-400 mb-3 flex-wrap">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-700">{advisor.averageRating}</span>
                  </div>

                  {/* Bio row */}
                  {advisor.bio && (
                    <div className="text-[13px] text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                      {advisor.bio}
                    </div>
                  )}

                  {/* Industries row */}
                  {(advisor.industry || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {advisor.industry.map((ind) => (
                        <span key={ind.industryId} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium text-slate-500">
                          {ind.industry}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => router.push(`/startup/experts/${advisor.advisorID}`)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors"
                    >
                      Xem hồ sơ
                    </button>
                    <button
                      onClick={() => handleOpenRequest(advisor)}
                      className="flex-1 py-2.5 rounded-xl bg-[#fdf8e6] border border-[#eec54e]/30 text-slate-800 text-[13px] font-semibold hover:bg-[#eec54e] transition-all"
                    >
                      Gửi yêu cầu
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {advisorPage > 1 && (
              <div className="pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setAdvisorPage(p => Math.max(1, p - 1))}
                        className={advisorPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setAdvisorPage(page)}
                          isActive={advisorPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setAdvisorPage(p => Math.min(totalPages, p - -1))}
                        className={advisorPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="space-y-5 animate-in fade-in duration-300">

            {isRequestsLoading && (
              <div className="py-10 text-center text-[14px] text-slate-500 font-medium">
                Đang tải danh sách yêu cầu...
              </div>
            )}

            {requestsError && !isRequestsLoading && (
              <div className="py-10 text-center text-[14px] text-red-500 font-medium">
                {requestsError}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-100 hover:bg-slate-50/80">
                    <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cố vấn</TableHead>
                    <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thách thức startup</TableHead>
                    <TableHead className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ngày gửi</TableHead>
                    <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</TableHead>
                    <TableHead className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 border-b-0">
                  {!isRequestsLoading && filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-16 text-center text-[14px] text-slate-400">Không có yêu cầu nào.</TableCell>
                    </TableRow>
                  )}
                  {filteredRequests.map(item => {
                    const normalizedStatus = normalizeMentorshipStatus(item.mentorshipStatus);
                    return (
                      <TableRow key={item.mentorshipID} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-[13px] font-semibold text-slate-900 leading-none mb-0.5">{item.advisorName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 max-w-[260px]">
                          <p className="text-[13px] font-semibold text-slate-800 line-clamp-2">{item.challengeDescription}</p>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-[13px] text-slate-500">{formatDate(item.requestedAt || item.createdAt)}</TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap", getStatusColor(normalizedStatus.key))}>
                            {normalizedStatus.label}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedMentorshipId(item.mentorshipID);
                                setShowMentorshipDetail(true);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-all"
                              title="Xem chi tiết"
                            >
                              <Search className="w-4 h-4" />
                            </button>
                            {normalizedStatus.key === "Accepted" && (
                              <button
                                onClick={() => router.push(`/startup/mentorship-requests/${item.mentorshipID}/confirm-schedule`)}
                                className="p-2 text-slate-400 hover:text-teal-600 bg-slate-50 hover:bg-teal-50 rounded-lg transition-all"
                                title="Xác nhận lịch hẹn"
                              >
                                <CalendarCheck className="w-4 h-4" />
                              </button>
                            )}
                            {normalizedStatus.key === "InProgress" && (
                              <button
                                onClick={() => router.push(`/startup/mentorship-requests/${item.mentorshipID}`)}
                                className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Xem chi tiết phiên"
                              >
                                <Video className="w-4 h-4" />
                              </button>
                            )}
                            {normalizedStatus.key === "Completed" && (
                              <button
                                onClick={() => router.push(`/startup/mentorship-requests/${item.mentorshipID}/report`)}
                                className="p-2 text-slate-400 hover:text-green-600 bg-slate-50 hover:bg-green-50 rounded-lg transition-all"
                                title="Xem báo cáo"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                            {normalizedStatus.key === "Rejected" && (
                              <button
                                onClick={() => router.push("/startup/experts")}
                                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all"
                                title="Tìm cố vấn khác"
                              >
                                <Users className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {requestsTotalPages > 1 && (
              <div className="pt-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setRequestsPage(p => Math.max(1, p - 1))}
                        className={requestsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: requestsTotalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setRequestsPage(page)}
                          isActive={requestsPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setRequestsPage(p => Math.min(requestsTotalPages, p - -1))}
                        className={requestsPage === requestsTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Status filter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {(["all", "Sắp diễn ra", "Đã hoàn thành", "Đã hủy"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSessionStatusFilter(s)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[13px] font-semibold transition-all",
                    sessionStatusFilter === s
                      ? "bg-[#eec54e] text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {s === "all" ? "Tất cả" : s === "Sắp diễn ra" ? "Sắp tới" : s}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cố vấn</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thời gian</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nội dung / Chủ đề</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSessions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-[14px] text-slate-400">Không có phiên nào.</td>
                    </tr>
                  )}
                  {filteredSessions.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.advisor.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900 leading-none mb-0.5">{item.advisor.name}</p>
                            <p className="text-[11px] text-slate-400">{item.advisor.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-semibold text-slate-700">{item.time}</p>
                        <p className="text-[11px] text-slate-400">{item.hour}</p>
                      </td>
                      <td className="px-6 py-4 max-w-[250px]">
                        <p className="text-[13px] font-semibold text-slate-800 truncate">{item.topic}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.subTopic}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[12px] font-medium">
                          {item.type === "Google Meet" ? <Video className="w-3.5 h-3.5 text-emerald-500" /> : item.type === "Microsoft Teams" ? <Monitor className="w-3.5 h-3.5 text-violet-500" /> : <Users className="w-3.5 h-3.5 text-slate-400" />}
                          {item.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold border", item.statusColor)}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {item.canJoin && (
                            <button
                              onClick={() => showToast("Đang kết nối phòng họp...")}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                            >
                              Tham gia họp
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/startup/mentorship-requests/${item.requestId}`)}
                            title="Xem chi tiết yêu cầu"
                            className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          {!item.canJoin && (
                            <button
                              onClick={() => router.push(`/startup/mentorship-requests/${item.requestId}/report`)}
                              title="Xem báo cáo tư vấn"
                              className="p-2 text-slate-400 hover:text-amber-500 bg-slate-50 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <Briefcase className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Status filter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: "all", label: "Tất cả" },
                { key: "pending", label: "Chờ đánh giá" },
                { key: "done", label: "Đã hoàn tất" },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setReportStatusFilter(s.key)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[13px] font-semibold transition-all",
                    reportStatusFilter === s.key
                      ? "bg-[#eec54e] text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cố vấn</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phiên hướng dẫn</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Báo cáo</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Đánh giá</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-[14px] text-slate-400">Không có báo cáo nào.</td>
                    </tr>
                  )}
                  {filteredReports.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.advisor.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900 leading-none mb-0.5">{item.advisor.name}</p>
                            <p className="text-[11px] text-slate-400">{item.advisor.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-semibold text-slate-800">{item.topic}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.hasReport ? (
                          <button
                            onClick={() => router.push(`/startup/mentorship-requests/${item.requestId}/report`)}
                            className="inline-flex items-center gap-1.5 mx-auto text-[11px] font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-[#eec54e] hover:text-white transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" /> Xem báo cáo
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Chưa có báo cáo</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.rating > 0 ? (
                          <div className="flex items-center justify-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={cn("w-3.5 h-3.5", s <= item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                            ))}
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase border border-amber-100">Chưa đánh giá</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {item.rating === 0 && (
                            <button
                              onClick={() => router.push(`/startup/mentorship-requests/${item.requestId}/feedback`)}
                              className="px-3 py-1.5 bg-[#eec54e] text-white rounded-lg text-[11px] font-semibold shadow-sm hover:bg-[#d4ae3d] transition-all"
                            >
                              Gửi đánh giá
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/startup/mentorship-requests/${item.requestId}`)}
                            title="Xem chi tiết yêu cầu"
                            className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        <MentorshipRequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          mentor={selectedAdvisorForModal}
        />
        <SessionReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          session={selectedSession}
        />
        <MentorshipDetailModal
          isOpen={showMentorshipDetail}
          onClose={() => {
            setShowMentorshipDetail(false);
            setSelectedMentorshipId(null);
          }}
          mentorshipId={selectedMentorshipId}
        />

        {/* Toast */}
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </StartupShell>
  );
}
