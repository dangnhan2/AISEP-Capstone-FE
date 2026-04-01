"use client";

import {
  Star, Search, ChevronRight, ChevronLeft, ChevronDown, Users, Briefcase,
  MessageSquare, FileText, BarChart3, X, ArrowUpDown, BadgeCheck,
  CalendarCheck, Video, Monitor
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { MentorshipRequestModal } from "@/components/startup/mentorship-request-modal";
import { SessionReviewModal } from "@/components/startup/session-review-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { StartupShell } from "@/components/startup/startup-shell";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ADVISORS = [
  { id: 1, name: "Nguyễn Minh Quân", headline: "Giúp startup SaaS xây dựng chiến lược sản phẩm từ 0 đến 1", title: "Head of Product · TechGlobal", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY2B_40T_b8ifCFhZYE9RUfdodTMIq4hkMeAvPfCxdek8AhcikuKD11XDhYpXmtyvdSlnne2UWZDbdEO4TMXf17yrSsltdyX2-bBHPjbzbTxFQNPTgQkflvmeFd6QdGRvx0WBDDS0vnBvv-defpdnEB2zPF8-sAiLMhhfWCHe6M2UpyMAwTRdjcu8xSEmKOJ3aGlWMMK40SM6ThVvCpVFz_jvRfcX6dDBi4rDUGiVvfrUIHpezyewWd_4dYD9EbKusdQxomMZQhk", rating: 4.9, reviewCount: 124, completedSessions: 120, yearsOfExperience: 10, expertise: ["Product Strategy", "Go-to-market"], domainTags: ["SaaS", "B2B"], suitableFor: ["Product-Market Fit", "Chiến lược tăng trưởng", "Go-to-market"], isVerified: true, availabilityHint: "Thứ 3, Thứ 5", hourlyRate: 2000000, supportedDurations: [30, 60, 90] },
  { id: 2, name: "Trần Thu Hà", headline: "Chuyên gia gọi vốn & tài chính khởi nghiệp", title: "Investment Director · VCFund", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkeJpKLH89dtH6jy4p8OtegH6mL83JYobMLHvAQeMV-R-JV6ohyzLx5hQ2sZ387P-fztgR4sHa7EhmwJgbBTLxFVFskQsJI0Gohh4EB7LYt7pPNPIzVeMrNhIypAV8fJEz96dPqr4r8kUGO2XeJO1lDMfCEq0VHu2jl5963wBzE9lbl2WoMzmqdPjjGz-t_FAE1IFgbbvm8uMyf_V-UtsjIaqHKgVh5bF0DB5TQdrgyJ8kdtGF1397AobYsJYg8zAxOXwFyWtd32Q", rating: 5.0, reviewCount: 85, completedSessions: 85, yearsOfExperience: 12, expertise: ["Fundraising", "Financial Strategy"], domainTags: ["FinTech", "VC"], suitableFor: ["Gọi vốn", "Pitch Deck", "Term Sheet"], isVerified: true, availabilityHint: "Thứ 2, Thứ 4, Thứ 6", hourlyRate: 2500000, supportedDurations: [30, 60, 90] },
  { id: 3, name: "Phạm Thành Long", headline: "CTO kinh nghiệm xây dựng đội kỹ thuật scale-up", title: "CTO & Co-founder · AI-Soft", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd7t5ciDWV2eTaJsfniBll5lOH1FpM75D-rNgvvVbqucB9qLvuvCqdD2n7NevngnBF0iNuRrvyppt6TSVePvhTgOoUFPXs3COh1SFpjFFfpRM7AvqpVQYWIKMeh8ZaAHBQXX7A9LfSgc9hJLF86zECFTAuBW7cVPKthlob2LHXSFNJoAt5LewaefZBVBDzh253xnffFoI4o3adtsf5g77DpJi4MsoGYiv14LMA-ivJZaM5n2tz_QhJaAEUCzsxPuiFm3f6b9lC-GA", rating: 4.8, reviewCount: 210, completedSessions: 210, yearsOfExperience: 15, expertise: ["Engineering", "AI/ML"], domainTags: ["AI", "Deep Tech"], suitableFor: ["Kỹ thuật", "AI Strategy", "Tuyển CTO"], isVerified: true, availabilityHint: "Thứ 3, Thứ 6", hourlyRate: 3000000, supportedDurations: [30, 60, 90] },
  { id: 4, name: "Lê Hồng Nhung", headline: "Growth hacker đã scale 3 startup từ 0 đến Series B", title: "Growth Lead · FastDelivery", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaiDXjuR0ngcu2gjH7wWIYdvc0Z64rZ4uKjXIuRusn_lY1IEWFYzwMyeYzlUPSUHnBTt6mDDuv0eJ8SL71wy7SaD-05KoaTWJzurSlnJClIIJsgTS--Cv40ApHR5shEQ7SeCpNxnp5xtIwWuRCBa4OUemqewQ9q0w2DqIrWm50zdbyWm-9sYgEnRGt14BdHMznN22ho7LmUpoRO43UFNRR-WvdR3xEiHq7wURyqtcS5fcDxxd6ZjMEG9GhQRcdPpl6nwaJ4uRrLE", rating: 4.7, reviewCount: 45, completedSessions: 45, yearsOfExperience: 7, expertise: ["Growth Hacking", "Marketing"], domainTags: ["E-commerce", "Consumer"], suitableFor: ["Tăng trưởng người dùng", "Marketing", "E-commerce"], isVerified: true, availabilityHint: "Thứ 2, Thứ 5", hourlyRate: 1500000, supportedDurations: [30, 60] },
  { id: 5, name: "Võ Minh Tuấn", headline: "Legal advisor cho thương vụ M&A, đầu tư và tuân thủ pháp lý", title: "Founder & Legal Counsel · StartupLaw", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd7t5ciDWV2eTaJsfniBll5lOH1FpM75D-rNgvvVbqucB9qLvuvCqdD2n7NevngnBF0iNuRrvyppt6TSVePvhTgOoUFPXs3COh1SFpjFFfpRM7AvqpVQYWIKMeh8ZaAHBQXX7A9LfSgc9hJLF86zECFTAuBW7cVPKthlob2LHXSFNJoAt5LewaefZBVBDzh253xnffFoI4o3adtsf5g77DpJi4MsoGYiv14LMA-ivJZaM5n2tz_QhJaAEUCzsxPuiFm3f6b9lC-GA", rating: 4.6, reviewCount: 32, completedSessions: 38, yearsOfExperience: 14, expertise: ["Legal/Compliance", "Corporate Governance"], domainTags: ["Legal", "Finance"], suitableFor: ["Pháp lý", "Tuân thủ", "M&A"], isVerified: false, availabilityHint: "Thứ 4, Thứ 6", hourlyRate: 2200000, supportedDurations: [60, 90] },
  { id: 6, name: "Bùi Thị Lan Anh", headline: "Operations expert, xây dựng COO office từ Seed đến Series B+", title: "Former COO · Gojek Vietnam", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkeJpKLH89dtH6jy4p8OtegH6mL83JYobMLHvAQeMV-R-JV6ohyzLx5hQ2sZ387P-fztgR4sHa7EhmwJgbBTLxFVFskQsJI0Gohh4EB7LYt7pPNPIzVeMrNhIypAV8fJEz96dPqr4r8kUGO2XeJO1lDMfCEq0VHu2jl5963wBzE9lbl2WoMzmqdPjjGz-t_FAE1IFgbbvm8uMyf_V-UtsjIaqHKgVh5bF0DB5TQdrgyJ8kdtGF1397AobYsJYg8zAxOXwFyWtd32Q", rating: 4.9, reviewCount: 67, completedSessions: 72, yearsOfExperience: 11, expertise: ["Operations", "Scaling"], domainTags: ["Logistics", "Marketplace"], suitableFor: ["Vận hành", "Mở rộng quy mô", "OKRs"], isVerified: true, availabilityHint: "Thứ 2, Thứ 6", hourlyRate: 1800000, supportedDurations: [30, 60, 90] },
];

const formatVND = (n: number) => n.toLocaleString('vi-VN') + '₫';

const REQUESTS = [
  { id: 1, advisor: { name: "Nguyễn Minh Quân", title: "Head of Product · TechGlobal", avatar: ADVISORS[0].avatar }, topic: "Chiến lược tối ưu Product-Market Fit cho SaaS", challenge: "Vấn đề về retention rate đang giảm nhẹ...", date: "14/03/2024", type: "Google Meet", status: "Chờ phản hồi", statusColor: "text-blue-600 bg-blue-50 border-blue-100" },
  { id: 2, advisor: { name: "Trần Thu Hà", title: "Investment Director · VCFund", avatar: ADVISORS[1].avatar }, topic: "Gọi vốn Series A – Pitch Deck & Term Sheet", challenge: "Rà soát tài liệu đầu tư và chiến lược định giá...", date: "12/03/2024", type: "Google Meet", status: "Đã chấp nhận", statusColor: "text-teal-600 bg-teal-50 border-teal-100" },
  { id: 3, advisor: { name: "Phạm Thành Long", title: "CTO & Co-founder · AI-Soft", avatar: ADVISORS[2].avatar }, topic: "Xây dựng đội kỹ thuật cho giai đoạn scale", challenge: "Tuyển dụng và cấu trúc team engineering...", date: "10/03/2024", type: "Google Meet", status: "Đã lên lịch", statusColor: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  { id: 4, advisor: { name: "Lê Hồng Nhung", title: "Growth Lead · FastDelivery", avatar: ADVISORS[3].avatar }, topic: "Chiến lược tăng trưởng người dùng Q2/2024", challenge: "CAC đang tăng trong khi LTV chưa cải thiện...", date: "05/03/2024", type: "Trực tiếp", status: "Hoàn thành", statusColor: "text-green-600 bg-green-50 border-green-100" },
  { id: 5, advisor: { name: "Võ Minh Tuấn", title: "Founder & Legal Counsel · StartupLaw", avatar: ADVISORS[4].avatar }, topic: "Tư vấn pháp lý cơ cấu công ty trước gọi vốn", challenge: "Rà soát cap table và điều khoản shareholder...", date: "01/03/2024", type: "Google Meet", status: "Từ chối", statusColor: "text-red-500 bg-red-50 border-red-100" },
  { id: 6, advisor: { name: "Bùi Thị Lan Anh", title: "Former COO · Gojek Vietnam", avatar: ADVISORS[5].avatar }, topic: "Xây dựng OKR framework cho team vận hành", challenge: "Thiếu alignment giữa các team về mục tiêu...", date: "25/02/2024", type: "Trực tiếp", status: "Đã hủy", statusColor: "text-slate-500 bg-slate-50 border-slate-100" },
];

// requestId maps to the ID in MOCK_REQUESTS (in the detail page) so navigation is consistent
const SESSIONS = [
  { id: 1, requestId: 3, advisor: { name: "Phạm Thành Long", title: "CTO & Co-founder · AI-Soft", avatar: ADVISORS[2].avatar }, time: "26/03/2024", hour: "14:00", topic: "Xây dựng đội kỹ thuật cho giai đoạn scale", subTopic: "Cấu trúc team engineering khi scale lên 20+ người", type: "Google Meet", status: "Sắp diễn ra", statusColor: "text-indigo-600 bg-indigo-50 border-indigo-100", canJoin: true },
  { id: 2, requestId: 4, advisor: { name: "Nguyễn Minh Quân", title: "Head of Product · TechGlobal", avatar: ADVISORS[0].avatar }, time: "15/03/2024", hour: "14:00", topic: "Chiến lược tăng trưởng người dùng Q2/2024", subTopic: "Scale MAU từ 10K lên 100K trong 2 quý", type: "Google Meet", status: "Đã hoàn thành", statusColor: "text-green-600 bg-green-50 border-green-100", canJoin: false },
];

const REPORTS = [
  { id: 1, requestId: 4, advisor: { name: "Nguyễn Minh Quân", title: "Head of Product · TechGlobal", avatar: ADVISORS[0].avatar }, topic: "Chiến lược tăng trưởng người dùng Q2/2024", time: "15/03/2024 • 14:00 CH", hasReport: true, rating: 0, status: "Chưa đánh giá" },
  { id: 2, requestId: 4, advisor: { name: "Nguyễn Minh Quân", title: "Head of Product · TechGlobal", avatar: ADVISORS[0].avatar }, topic: "Chiến lược tăng trưởng người dùng Q2/2024", time: "15/03/2024 • 14:00 CH", hasReport: true, rating: 5, status: "Đã đánh giá" },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function FSelect({ value, onChange, options, labels }: { value: string; onChange: (v: string) => void; options: string[]; labels: string[] }) {
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-2.5 text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 cursor-pointer transition-all"
      >
        {options.map((o, i) => <option key={o} value={o}>{labels[i]}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
    </div>
  );
}

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

const PAGE_SIZE = 4;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StartupAdvisorsPage() {
  return (
    <Suspense>
      <StartupAdvisorsPageInner />
    </Suspense>
  );
}

function StartupAdvisorsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Find tab state
  const [search, setSearch] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("best_match");
  const [advisorPage, setAdvisorPage] = useState(1);

  // Tab derived from URL — no local state needed
  const VALID_TABS = ["find", "requests", "sessions", "reports"] as const;
  type TabKey = typeof VALID_TABS[number];
  const tabParam = searchParams.get("tab") as TabKey | null;
  const activeTab: TabKey = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "find";
  const setTab = (tab: TabKey) => router.replace(`/startup/experts?tab=${tab}`);

  // Sub-filter state
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");
  const [sessionStatusFilter, setSessionStatusFilter] = useState("all");
  const [reportStatusFilter, setReportStatusFilter] = useState("all");

  // Request management
  const [localRequests, setLocalRequests] = useState(REQUESTS);
  const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null);

  // Modals
  const [selectedAdvisor, setSelectedAdvisor] = useState<typeof ADVISORS[0] | null>(null);
  const selectedAdvisorForModal = selectedAdvisor ? { name: selectedAdvisor.name, avatar: selectedAdvisor.avatar, title: selectedAdvisor.title, hourlyRate: selectedAdvisor.hourlyRate, supportedDurations: selectedAdvisor.supportedDurations } : null;
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => setToast(msg);

  // ─── Filtering / Sorting ───────────────────────────────────────────────────

  const filteredAdvisors = ADVISORS.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.headline.toLowerCase().includes(q) || a.expertise.some(e => e.toLowerCase().includes(q)) || a.domainTags.some(t => t.toLowerCase().includes(q));
    const matchExpertise = expertiseFilter === "all" || a.expertise.some(e => e === expertiseFilter) || a.domainTags.some(t => t === expertiseFilter);
    const matchExp =
      experienceFilter === "all" ||
      (experienceFilter === "1-3" && a.yearsOfExperience >= 1 && a.yearsOfExperience <= 3) ||
      (experienceFilter === "3-7" && a.yearsOfExperience > 3 && a.yearsOfExperience <= 7) ||
      (experienceFilter === "7+" && a.yearsOfExperience > 7) ||
      (experienceFilter === "10+" && a.yearsOfExperience >= 10);
    const matchRating = ratingFilter === "all" || a.rating >= parseFloat(ratingFilter);
    return matchSearch && matchExpertise && matchExp && matchRating;
  });

  const sortedAdvisors = [...filteredAdvisors].sort((a, b) => {
    if (sortBy === "highest_rated") return b.rating - a.rating;
    if (sortBy === "most_experienced") return b.yearsOfExperience - a.yearsOfExperience;
    if (sortBy === "most_sessions") return b.completedSessions - a.completedSessions;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedAdvisors.length / PAGE_SIZE));
  const paginatedAdvisors = sortedAdvisors.slice((advisorPage - 1) * PAGE_SIZE, advisorPage * PAGE_SIZE);

  const hasActiveFilters = search !== "" || expertiseFilter !== "all" || experienceFilter !== "all" || ratingFilter !== "all" || sortBy !== "best_match";

  const clearFilters = () => {
    setSearch("");
    setExpertiseFilter("all");
    setExperienceFilter("all");
    setRatingFilter("all");
    setSortBy("best_match");
    setAdvisorPage(1);
  };

  // ─── Filtered Sub-lists ────────────────────────────────────────────────────

  const filteredRequests = requestStatusFilter === "all"
    ? localRequests
    : localRequests.filter(r => r.status === requestStatusFilter);

  const filteredSessions = sessionStatusFilter === "all"
    ? SESSIONS
    : SESSIONS.filter(s => s.status === sessionStatusFilter);

  const filteredReports = reportStatusFilter === "all"
    ? REPORTS
    : reportStatusFilter === "pending"
      ? REPORTS.filter(r => r.rating === 0)
      : REPORTS.filter(r => r.rating > 0);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleCancelRequest = (id: number) => {
    setLocalRequests(prev => prev.filter(r => r.id !== id));
    showToast("Đã hủy yêu cầu");
    setCancelConfirmId(null);
  };

  const handleOpenRequest = (advisor: typeof ADVISORS[0]) => {
    setSelectedAdvisor(advisor);
    setShowRequestModal(true);
  };

  const handleOpenReview = (report: any) => {
    setSelectedSession({
      advisorName: report.advisor.name,
      advisorAvatar: report.advisor.avatar,
      topic: report.topic,
      time: report.time,
    });
    setShowReviewModal(true);
  };

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
            Yêu cầu của tôi ({localRequests.length})
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

              <FSelect
                value={expertiseFilter}
                onChange={v => { setExpertiseFilter(v); setAdvisorPage(1); }}
                options={["all", "Product Strategy", "Fundraising", "Engineering", "AI/ML", "Growth Hacking", "Marketing", "Legal/Compliance", "Operations", "SaaS", "FinTech", "AI", "E-commerce"]}
                labels={["Tất cả chuyên môn", "Product Strategy", "Fundraising", "Engineering", "AI/ML", "Growth Hacking", "Marketing", "Legal/Compliance", "Operations", "SaaS", "FinTech", "AI", "E-commerce"]}
              />

              <FSelect
                value={experienceFilter}
                onChange={v => { setExperienceFilter(v); setAdvisorPage(1); }}
                options={["all", "1-3", "3-7", "7+", "10+"]}
                labels={["Tất cả kinh nghiệm", "1–3 năm", "3–7 năm", "7+ năm", "10+ năm"]}
              />

              <FSelect
                value={ratingFilter}
                onChange={v => { setRatingFilter(v); setAdvisorPage(1); }}
                options={["all", "4.5", "4", "3"]}
                labels={["Tất cả xếp hạng", "4.5★ trở lên", "4★ trở lên", "3★ trở lên"]}
              />

              <div className="w-px h-6 bg-slate-200 flex-shrink-0" />

              {/* Sort */}
              <div className="relative flex-shrink-0">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-8 pr-7 py-2.5 text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 cursor-pointer transition-all"
                >
                  <option value="best_match">Phù hợp nhất</option>
                  <option value="highest_rated">Đánh giá cao nhất</option>
                  <option value="most_experienced">Nhiều kinh nghiệm nhất</option>
                  <option value="most_sessions">Nhiều phiên nhất</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Result Count */}
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-slate-500">
                <span className="font-semibold text-[#0f172a]">{filteredAdvisors.length}</span> cố vấn phù hợp
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-[12px] text-slate-400 hover:text-slate-600 flex items-center gap-1">
                  <X className="w-3 h-3" /> Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Advisor Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {paginatedAdvisors.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-[15px] font-semibold text-slate-400">Không tìm thấy cố vấn phù hợp</p>
                  <p className="text-[13px] text-slate-400 mt-1">Thử mở rộng tiêu chí tìm kiếm hoặc xóa bộ lọc.</p>
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-200 transition-colors">Xóa bộ lọc</button>
                </div>
              )}

              {paginatedAdvisors.map(advisor => (
                <div key={advisor.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 p-6">
                  {/* Top row */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={advisor.avatar}
                      alt={advisor.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[15px] font-semibold text-slate-900">{advisor.name}</span>
                        {advisor.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        )}
                        <span className="ml-auto flex-shrink-0 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium text-slate-500">
                          {advisor.availabilityHint}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-400 mt-0.5">{advisor.title}</p>
                      <p className="text-[13px] text-slate-500 mt-1.5 line-clamp-1">{advisor.headline}</p>
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {advisor.expertise.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium text-slate-600">{tag}</span>
                    ))}
                    {advisor.domainTags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg text-[11px] font-medium text-amber-700">{tag}</span>
                    ))}
                  </div>

                  {/* Trust row */}
                  <div className="flex items-center gap-1 text-[12px] text-slate-400 mb-3 flex-wrap">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-700">{advisor.rating}</span>
                    <span>·</span>
                    <span>{advisor.reviewCount} đánh giá</span>
                    <span>·</span>
                    <span>{advisor.completedSessions} phiên</span>
                    <span>·</span>
                    <span>{advisor.yearsOfExperience} năm KN</span>
                  </div>

                  {/* Suitable For */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    <span className="text-[11px] text-slate-400 font-medium">Phù hợp:</span>
                    {advisor.suitableFor.slice(0, 2).map(f => (
                      <span key={f} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-medium border border-amber-100">{f}</span>
                    ))}
                  </div>

                  {/* Pricing Widget */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-amber-50/60 border border-amber-100 rounded-xl mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-slate-700">{formatVND(advisor.hourlyRate)} / giờ</span>
                    </div>
                    <div className="flex gap-1">
                      {advisor.supportedDurations.map(d => (
                        <span key={d} className="px-1.5 py-0.5 bg-white border border-amber-100 rounded-md text-[10px] font-semibold text-amber-700">{d}m</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => router.push(`/startup/experts/${advisor.id}`)}
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
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setAdvisorPage(p => Math.max(1, p - 1))}
                  disabled={advisorPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setAdvisorPage(page)}
                    className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-xl text-[13px] font-semibold transition-all",
                      advisorPage === page
                        ? "bg-[#eec54e] text-white shadow-sm"
                        : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setAdvisorPage(p => Math.min(totalPages, p + 1))}
                  disabled={advisorPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Status filter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {([
                { key: "all", label: "Tất cả" },
                { key: "Chờ phản hồi", label: "Chờ phản hồi" },
                { key: "Đã chấp nhận", label: "Đã chấp nhận" },
                { key: "Đã lên lịch",  label: "Đã lên lịch" },
                { key: "Hoàn thành",   label: "Hoàn thành" },
                { key: "Từ chối",      label: "Từ chối" },
                { key: "Đã hủy",       label: "Đã hủy" },
              ] as const).map(s => (
                <button
                  key={s.key}
                  onClick={() => setRequestStatusFilter(s.key)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all",
                    requestStatusFilter === s.key
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
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chủ đề / Thách thức</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ngày gửi</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hình thức</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-[14px] text-slate-400">Không có yêu cầu nào.</td>
                    </tr>
                  )}
                  {filteredRequests.map(item => (
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
                      <td className="px-6 py-4 max-w-[260px]">
                        <p className="text-[13px] font-semibold text-slate-800 truncate">{item.topic}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.challenge}</p>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-500">{item.date}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[12px] font-medium">
                          {item.type === "Google Meet" ? <Video className="w-3.5 h-3.5 text-emerald-500" /> : item.type === "Microsoft Teams" ? <Monitor className="w-3.5 h-3.5 text-violet-500" /> : <Users className="w-3.5 h-3.5 text-slate-400" />}
                          {item.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap", item.statusColor)}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => router.push(`/startup/mentorship-requests/${item.id}`)}
                            className="p-2 text-slate-400 hover:text-amber-500 bg-slate-50 hover:bg-amber-50 rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          {item.status === "Chờ phản hồi" && (
                            cancelConfirmId === item.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleCancelRequest(item.id)} className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-[11px] font-semibold hover:bg-red-600 transition-colors">Xác nhận</button>
                                <button onClick={() => setCancelConfirmId(null)} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-semibold hover:bg-slate-200 transition-colors">Không</button>
                              </div>
                            ) : (
                              <button onClick={() => setCancelConfirmId(item.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all" title="Hủy yêu cầu">
                                <X className="w-4 h-4" />
                              </button>
                            )
                          )}
                          {item.status === "Đã chấp nhận" && (
                            <button
                              onClick={() => router.push(`/startup/mentorship-requests/${item.id}/confirm-schedule`)}
                              className="p-2 text-slate-400 hover:text-teal-600 bg-slate-50 hover:bg-teal-50 rounded-lg transition-all"
                              title="Xác nhận lịch hẹn"
                            >
                              <CalendarCheck className="w-4 h-4" />
                            </button>
                          )}
                          {item.status === "Đã lên lịch" && (
                            <button
                              onClick={() => router.push(`/startup/mentorship-requests/${item.id}`)}
                              className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Xem chi tiết phiên"
                            >
                              <Video className="w-4 h-4" />
                            </button>
                          )}
                          {item.status === "Hoàn thành" && (
                            <button
                              onClick={() => router.push(`/startup/mentorship-requests/${item.id}/report`)}
                              className="p-2 text-slate-400 hover:text-green-600 bg-slate-50 hover:bg-green-50 rounded-lg transition-all"
                              title="Xem báo cáo"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          {item.status === "Từ chối" && (
                            <button
                              onClick={() => router.push("/startup/experts")}
                              className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all"
                              title="Tìm cố vấn khác"
                            >
                              <Users className="w-4 h-4" />
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
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hình thức</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hành động</th>
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

        {/* Toast */}
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </StartupShell>
  );
}
