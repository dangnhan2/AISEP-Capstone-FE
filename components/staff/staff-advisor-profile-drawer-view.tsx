"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Globe,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IAdvisorDetail } from "@/types/startup-mentorship";

const ADVISOR_PROFILE_TABS = ["Tổng quan", "Chuyên môn & Dịch vụ", "Liên hệ"] as const;
type AdvisorProfileTab = typeof ADVISOR_PROFILE_TABS[number];

const EXPERTISE_LABEL: Record<string, string> = {
  FUNDRAISING: "Gọi vốn",
  PRODUCT_STRATEGY: "Chiến lược SP",
  GO_TO_MARKET: "Go-to-market",
  FINANCE: "Tài chính",
  LEGAL_IP: "Pháp lý & SHTT",
  OPERATIONS: "Vận hành",
  TECHNOLOGY: "Công nghệ",
  MARKETING: "Marketing",
  HR_OR_TEAM_BUILDING: "Nhân sự",
};

function calcAdvisorDrawerCompleteness(advisor: IAdvisorDetail) {
  const checks = [
    Boolean(advisor.fullName?.trim()),
    Boolean(advisor.title?.trim()),
    Boolean(advisor.company?.trim()),
    advisor.yearsOfExperience != null && advisor.yearsOfExperience >= 0,
    Boolean(advisor.linkedInURL?.trim()),
    Boolean(advisor.expertise?.length),
    Boolean((advisor.biography || advisor.bio)?.trim()),
    Boolean((advisor.mentorshipPhilosophy || advisor.philosophy)?.trim()),
    advisor.hourlyRate > 0,
    Boolean(advisor.supportedDurations?.length),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function StaffAdvisorProfileDrawerView({
  advisor,
}: {
  advisor: IAdvisorDetail;
}) {
  const [activeTab, setActiveTab] = useState<AdvisorProfileTab>("Tổng quan");
  const expertise = advisor.expertise ?? [];
  const [primary, ...secondary] = expertise;
  const isAvailable = advisor.availabilityHint === "Available";
  const completeness = calcAdvisorDrawerCompleteness(advisor);
  const biography = advisor.biography || advisor.bio;
  const philosophy = advisor.mentorshipPhilosophy || advisor.philosophy;
  const supportedDurations = advisor.supportedDurations ?? [];
  const industries = Array.isArray(advisor.industry) ? advisor.industry : [];

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8">
      <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="relative h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
          <div className="absolute inset-0 rounded-t-2xl bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-4 right-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
              <span className={cn("h-1.5 w-1.5 rounded-full", isAvailable ? "bg-emerald-400" : "bg-slate-400")} />
              {isAvailable ? "Đang nhận mentee" : "Tạm ngưng nhận mentee"}
            </div>
          </div>
        </div>

        <div className="px-7 pb-7">
          <div className="-mt-10 mb-4 relative z-10">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-white bg-gradient-to-br from-amber-400 to-amber-600 text-[20px] font-bold text-white shadow-md">
              {advisor.profilePhotoURL ? (
                <img src={advisor.profilePhotoURL} alt={advisor.fullName} className="h-full w-full object-cover" />
              ) : (
                <span>{advisor.fullName ? advisor.fullName.charAt(0).toUpperCase() : "?"}</span>
              )}
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#0f172a]">{advisor.fullName}</h1>
              {advisor.isVerified && <BadgeCheck className="h-5 w-5 flex-shrink-0 text-teal-500" />}
            </div>
            <p className="text-[13px] text-slate-500">
              {[advisor.title, advisor.company].filter(Boolean).join(" · ") || "Chưa cập nhật thông tin"}
            </p>
          </div>
          <div className="mb-5 flex flex-wrap items-center gap-1.5">
            {[primary, ...secondary].filter(Boolean).map((item, index) => (
              <span
                key={item}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium",
                  index === 0
                    ? "border-amber-100/60 bg-amber-50 text-amber-700"
                    : "border-slate-100 bg-slate-50 text-slate-600",
                )}
              >
                {index === 0 && <Star className="h-3 w-3" />}
                {EXPERTISE_LABEL[item] || item}
              </span>
            ))}
            {advisor.yearsOfExperience != null && (
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                <Clock className="h-3 w-3" />
                {advisor.yearsOfExperience} năm KN
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold",
                isAvailable
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border-slate-100 bg-slate-50 text-slate-500",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
              {isAvailable ? "Đang nhận mentee" : "Tạm ngưng nhận"}
            </span>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-medium text-slate-500">Độ hoàn thiện hồ sơ</span>
              <span className={cn("text-[12px] font-semibold", completeness === 100 ? "text-emerald-600" : "text-slate-700")}>
                {completeness}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full transition-all", completeness === 100 ? "bg-emerald-500" : "bg-[#eec54e]")}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex w-fit items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {ADVISOR_PROFILE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-medium transition-all",
              activeTab === tab
                ? "bg-[#0f172a] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Tổng quan" && (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 space-y-5 lg:col-span-8">
            {biography ? (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <h3 className="text-[13px] font-semibold text-slate-700">Giới thiệu bản thân</h3>
                </div>
                <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-500">{biography}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
                <p className="text-[13px] text-slate-400">Chưa có phần giới thiệu bản thân.</p>
              </div>
            )}
            {philosophy && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="text-[13px] font-semibold text-slate-700">Triết lý cố vấn</h3>
                </div>
                <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-500">{philosophy}</p>
              </div>
            )}
          </div>

          <div className="col-span-12 space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-widest text-slate-400">Thông tin nhanh</h3>
              <div className="space-y-3">
                {advisor.title && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Chức vụ</p>
                      <p className="text-[12px] font-medium text-slate-700">{advisor.title}</p>
                    </div>
                  </div>
                )}
                {advisor.company && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Công ty</p>
                      <p className="text-[12px] font-medium text-slate-700">{advisor.company}</p>
                    </div>
                  </div>
                )}
                {advisor.yearsOfExperience != null && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Kinh nghiệm</p>
                      <p className="text-[12px] font-medium text-slate-700">{advisor.yearsOfExperience} năm</p>
                    </div>
                  </div>
                )}
                {advisor.averageRating > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Đánh giá</p>
                      <p className="text-[12px] font-medium text-slate-700">{advisor.averageRating.toFixed(1)} ({advisor.reviewCount})</p>
                    </div>
                  </div>
                )}
                {advisor.completedSessions > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Phiên tư vấn</p>
                      <p className="text-[12px] font-medium text-slate-700">{advisor.completedSessions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Chuyên môn & Dịch vụ" && (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 space-y-5 lg:col-span-8">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="text-[13px] font-semibold text-slate-700">Chuyên môn</h3>
              </div>
              {expertise.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {expertise.map((item, index) => (
                    <span
                      key={item}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold",
                        index === 0
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-slate-50 text-slate-600",
                      )}
                    >
                      {index === 0 && <Star className="h-3 w-3" />}
                      {EXPERTISE_LABEL[item] || item}
                      {index === 0 && <span className="ml-0.5 text-[9px] font-normal opacity-60">(Chính)</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-slate-400">Chưa chọn chuyên môn.</p>
              )}
            </div>

            {(advisor.hourlyRate > 0 || supportedDurations.length > 0) && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <h3 className="text-[13px] font-semibold text-slate-700">Dịch vụ & Mức phí</h3>
                </div>
                {advisor.hourlyRate > 0 && (
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="text-[18px] font-bold text-slate-900">{advisor.hourlyRate.toLocaleString("vi-VN")}đ</span>
                    <span className="text-[13px] text-slate-400">/ giờ</span>
                    <div className="ml-auto flex gap-2">
                      {supportedDurations.map((duration) => (
                        <span key={duration} className="rounded-lg bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-600">
                          {duration}m
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {supportedDurations.length > 0 && advisor.hourlyRate > 0 && (
                  <div className="overflow-hidden rounded-xl border border-slate-100">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 text-slate-400">
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider">Thời lượng</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider">Giá buổi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {supportedDurations.map((duration) => {
                          const price = Math.round((advisor.hourlyRate * duration) / 60);
                          return (
                            <tr key={duration} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-bold text-slate-700">{duration} phút</td>
                              <td className="px-4 py-3 text-right font-semibold text-slate-900">{price.toLocaleString("vi-VN")} đ</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-span-12 space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-widest text-slate-400">Trạng thái nhận tư vấn</h3>
              <div className={cn("flex items-center gap-3 rounded-xl border p-3", isAvailable ? "border-emerald-100 bg-emerald-50" : "border-slate-100 bg-slate-50")}>
                <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", isAvailable ? "bg-emerald-500" : "bg-slate-300")} />
                <div>
                  <p className={cn("text-[12px] font-semibold", isAvailable ? "text-emerald-700" : "text-slate-600")}>
                    {isAvailable ? "Đang nhận yêu cầu" : "Tạm đóng yêu cầu"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {isAvailable ? "Startup có thể gửi yêu cầu tư vấn" : "Không nhận yêu cầu mới"}
                  </p>
                </div>
              </div>
            </div>

            {industries.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-widest text-slate-400">Ngành tập trung</h3>
                <div className="flex flex-wrap gap-2">
                  {industries.map((item) => (
                    <span key={`${item.industryId}-${item.industry}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] font-medium text-slate-600">
                      {item.industry}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "Liên hệ" && (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 space-y-5 lg:col-span-8">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" />
                <h3 className="text-[13px] font-semibold text-slate-700">Liên kết công khai</h3>
              </div>
              <div className="space-y-3">
                {advisor.linkedInURL ? (
                  <div>
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">LinkedIn</p>
                    <a href={advisor.linkedInURL} target="_blank" rel="noopener noreferrer" className="break-all text-[13px] font-medium text-blue-600 hover:underline">
                      {advisor.linkedInURL}
                    </a>
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-400">Chưa có liên kết công khai.</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-widest text-slate-400">Thông tin hồ sơ</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Loại hồ sơ</p>
                  <p className="text-[12px] font-medium text-slate-700">Advisor</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Xác minh</p>
                  <p className="text-[12px] font-medium text-slate-700">{advisor.isVerified ? "Đã xác minh" : "Chưa xác minh"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
