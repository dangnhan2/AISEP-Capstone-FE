"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Globe,
  Layers,
  Lightbulb,
  MapPin,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { GetStartupById } from "@/services/investor/investor.api";

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<string, string> = {
  "0": "Hạt giống (Idea)", "1": "Tiền ươm mầm (Pre-Seed)", "2": "Ươm mầm (Seed)",
  "3": "Series A", "4": "Series B", "5": "Series C+", "6": "Tăng trưởng (Growth)",
  Idea: "Hạt giống (Idea)", PreSeed: "Tiền ươm mầm (Pre-Seed)", Seed: "Ươm mầm (Seed)",
  SeriesA: "Series A", SeriesB: "Series B", SeriesC: "Series C+", Growth: "Tăng trưởng (Growth)",
};

const TABS = ["Tổng quan", "Kinh doanh", "Gọi vốn", "Đội ngũ", "Liên hệ"] as const;
type Tab = typeof TABS[number];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StaffStartupProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const startupId = Number(id);

  const router = useRouter();
  const [startup, setStartup] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Tổng quan");

  useEffect(() => {
    if (!Number.isFinite(startupId) || startupId <= 0) { setLoading(false); return; }
    (async () => {
      try {
        const res = await GetStartupById(startupId) as any;
        if ((res?.isSuccess || res?.success) && res.data) setStartup(res.data);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, [startupId]);

  const displayStage = STAGE_LABELS[String(startup?.stage)] ?? startup?.stage ?? "—";
  const displayIndustry = Array.isArray(startup?.industry)
    ? startup.industry.join(", ")
    : (startup?.industry ?? startup?.industryName ?? "—");
  const teamMembers: any[] = Array.isArray(startup?.teamMembers) ? startup.teamMembers : Array.isArray(startup?.team) ? startup.team : [];
  const currentNeeds: string[] = Array.isArray(startup?.currentNeeds) ? startup.currentNeeds : [];
  const targetFunding = Number(startup?.fundingAmountSought) || 0;
  const raisedAmount = Number(startup?.currentFundingRaised) || 0;
  const fundingProgress = targetFunding > 0 ? Math.round((raisedAmount / targetFunding) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#eec54e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <p className="text-[15px] font-semibold text-slate-700">Không tìm thấy hồ sơ startup</p>
        <button onClick={() => router.back()} className="text-[13px] text-slate-500 hover:text-slate-800 underline">Quay lại</button>
      </div>
    );
  }

  const p = startup;

  return (
    <div className="px-8 py-6 pb-16 space-y-5 animate-in fade-in duration-400">
      {/* Top nav */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500">
        <Link href="/staff/kyc" className="hover:text-slate-800 transition-colors font-medium">Xét duyệt KYC</Link>
        <span className="text-slate-300">/</span>
        <button onClick={() => router.back()} className="hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Hồ sơ Startup
        </button>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-5">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-white font-bold text-[20px] shrink-0 shadow-sm",
            !p.logoURL && "bg-gradient-to-br from-blue-500 to-blue-600"
          )}>
            {p.logoURL
              ? <img src={p.logoURL} alt={p.companyName} className="w-full h-full object-cover" />
              : <span>{p.companyName?.charAt(0)?.toUpperCase()}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-bold text-slate-900 leading-tight">{p.companyName}</h1>
            {p.tagline && <p className="text-[13px] text-slate-500 mt-0.5 truncate">{p.tagline}</p>}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {displayStage !== "—" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fdfbe9] text-[#171611] border border-[#e6cc4c]/40">
                  {displayStage}
                </span>
              )}
              {displayIndustry !== "—" && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">{displayIndustry}</span>
              )}
              {(p.marketScope || p.targetMarket) && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">{p.marketScope ?? p.targetMarket}</span>
              )}
              {(p.location || p.country) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-200">
                  <MapPin className="w-3 h-3" />{[p.location, p.country].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-t border-slate-100 mt-5 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors",
                activeTab === t ? "border-[#0f172a] text-[#0f172a]" : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>

        {/* ── Tổng quan ── */}
        {activeTab === "Tổng quan" && (
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: AlertTriangle, label: "Vấn đề", text: p.problemStatement || "Chưa cập nhật vấn đề", color: "text-rose-500" },
                  { icon: Lightbulb,     label: "Giải pháp", text: p.solutionSummary || "Chưa cập nhật giải pháp", color: "text-amber-500" },
                ].map(({ icon: Icon, label, text, color }) => (
                  <div key={label} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("w-4 h-4", color)} />
                      <h3 className="text-[13px] font-semibold text-slate-700">{label}</h3>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              {(p.description || p.oneLiner) && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-3">
                  <h3 className="text-[13px] font-semibold text-slate-700">Mô tả chi tiết</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{p.description || p.oneLiner}</p>
                </div>
              )}
              {currentNeeds.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <h3 className="text-[13px] font-semibold text-slate-700">Nhu cầu hiện tại</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentNeeds.map((n) => (
                      <span key={n} className="px-3 py-1.5 rounded-lg bg-[#fdfbe9] text-[#171611] text-[12px] font-medium border border-[#e6cc4c]/25">{n}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-4">
                <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Thông tin nhanh</h3>
                {[
                  { icon: Layers,       label: "Giai đoạn", val: displayStage },
                  { icon: Building2,    label: "Ngành",     val: displayIndustry },
                  { icon: Globe,        label: "Thị trường", val: p.marketScope || p.targetMarket || "—" },
                  { icon: CheckCircle2, label: "Sản phẩm",  val: p.productStatus || "—" },
                  { icon: Calendar,     label: "Thành lập", val: p.foundedDate ? new Date(p.foundedDate).toLocaleDateString("vi-VN") : "—" },
                  { icon: Users,        label: "Team size",  val: p.teamSize ? `${p.teamSize} người` : "—" },
                  { icon: MapPin,       label: "Địa điểm",  val: [p.location, p.country].filter(Boolean).join(", ") || "—" },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                      <p className="text-[12px] font-medium text-slate-700 truncate">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Kinh doanh ── */}
        {activeTab === "Kinh doanh" && (
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-8 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
                <h3 className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Vấn đề & Giải pháp
                </h3>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">Vấn đề</p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">{p.problemStatement || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">Giải pháp</p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">{p.solutionSummary || "—"}</p>
                </div>
              </div>
              {currentNeeds.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3">
                  <h3 className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" /> Nhu cầu hiện tại
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentNeeds.map((n) => (
                      <span key={n} className="px-3 py-1.5 rounded-lg bg-[#fdfbe9] text-[#171611] text-[12px] font-medium border border-[#e6cc4c]/25">{n}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
                <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Thị trường</h3>
                {p.marketScope && (
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Phạm vi thị trường</p>
                    <p className="text-[13px] font-medium text-slate-700">{p.marketScope}</p>
                  </div>
                )}
                {p.productStatus && (
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Trạng thái sản phẩm</p>
                    <p className="text-[13px] font-medium text-slate-700">{p.productStatus}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Gọi vốn ── */}
        {activeTab === "Gọi vốn" && (
          <div className="space-y-5">
            {targetFunding > 0 || raisedAmount > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-5">
                  {[
                    { label: "Giai đoạn gọi vốn", value: displayStage, icon: TrendingUp, sub: "Vòng hiện tại" },
                    { label: "Số vốn cần", value: targetFunding > 0 ? `$${targetFunding.toLocaleString()}` : "—", icon: DollarSign, sub: "USD" },
                    { label: "Đã huy động", value: raisedAmount > 0 ? `$${raisedAmount.toLocaleString()}` : "—", icon: CheckCircle2, sub: `${fundingProgress}% mục tiêu` },
                  ].map(({ label, value, icon: Icon, sub }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-[22px] font-semibold text-[#0f172a] tracking-[-0.02em]">{value}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>
                {targetFunding > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                    <p className="text-[12px] font-medium text-slate-500 mb-3">Tiến độ huy động vốn</p>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#e6cc4c] rounded-full" style={{ width: `${fundingProgress}%` }} />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[11px] text-slate-400">${raisedAmount.toLocaleString()} đã huy động</span>
                      <span className="text-[11px] text-slate-400">{fundingProgress}% · Mục tiêu ${targetFunding.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                <DollarSign className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-[13px] text-slate-400">Chưa có thông tin gọi vốn.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Đội ngũ ── */}
        {activeTab === "Đội ngũ" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" /> Thành viên cốt cán ({teamMembers.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {teamMembers.length > 0 ? teamMembers.map((m: any, idx: number) => (
                  <div key={m.teamMemberID ?? m.id ?? idx} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {(m.photoURL || m.PhotoURL) ? (
                        <img src={m.photoURL ?? m.PhotoURL} alt={m.fullName ?? "Member"} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-500 text-[13px] font-bold">
                          {(m.fullName ?? m.FullName ?? m.name ?? "?")[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-[14px] font-semibold text-slate-800">{m.fullName ?? m.FullName ?? m.name ?? "Thành viên"}</p>
                        {(m.isFounder || m.IsFounder) && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100/50 text-amber-700 text-[10px] font-bold border border-amber-200/50">FOUNDER</span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-500 font-medium">
                        {[m.title ?? m.Title, m.role ?? m.Role].filter(Boolean).join(" · ")}
                        {Number(m.yearsOfExperience) > 0 ? ` · ${m.yearsOfExperience} năm KN` : ""}
                      </p>
                      {(m.bio || m.Bio) && <p className="text-[13px] text-slate-600 mt-1.5 leading-relaxed">{m.bio ?? m.Bio}</p>}
                    </div>
                  </div>
                )) : (
                  <p className="text-[13px] text-slate-400 italic py-4">Chưa có thông tin thành viên.</p>
                )}
              </div>
            </div>
            {p.enterpriseCode && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3">
                <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Pháp lý</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[12px] font-medium text-emerald-700">Đã đăng ký doanh nghiệp</span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Mã số doanh nghiệp</p>
                  <p className="text-[13px] font-medium text-slate-700">{p.enterpriseCode}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Liên hệ ── */}
        {activeTab === "Liên hệ" && (
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="text-[13px] font-semibold text-slate-700">Liên hệ trực tiếp</h3>
              {p.contactEmail && (
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Email</p>
                  <p className="text-[13px] font-medium text-slate-700">{p.contactEmail}</p>
                </div>
              )}
              {p.contactPhone && (
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Điện thoại</p>
                  <p className="text-[13px] font-medium text-slate-700">{p.contactPhone}</p>
                </div>
              )}
              {(p.location || p.country) && (
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-[13px] font-medium text-slate-700">{[p.location, p.country].filter(Boolean).join(", ")}</p>
                </div>
              )}
              {!p.contactEmail && !p.contactPhone && !p.location && !p.country && (
                <p className="text-[13px] text-slate-400">Chưa có thông tin liên hệ.</p>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="text-[13px] font-semibold text-slate-700">Liên kết</h3>
              {p.website && (
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Website</p>
                  <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-blue-600 hover:underline break-all">{p.website}</a>
                </div>
              )}
              {p.linkedInURL && (
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">LinkedIn</p>
                  <a href={p.linkedInURL} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-blue-600 hover:underline break-all">{p.linkedInURL}</a>
                </div>
              )}
              {!p.website && !p.linkedInURL && (
                <p className="text-[13px] text-slate-400">Chưa có liên kết.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
