"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  ExternalLink,
  Download,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { GetPendingStartupById, ApproveStartup } from "@/services/staff/staff.api";

type KYCStatus = "PENDING" | "IN_REVIEW" | "PENDING_MORE_INFO" | "APPROVED" | "REJECTED";

const STATUS_CFG: Record<KYCStatus, { label: string; badge: string; dot: string }> = {
  PENDING: { label: "Chờ xử lý", badge: "bg-amber-50 text-amber-700 border-amber-200/80", dot: "bg-amber-400" },
  IN_REVIEW: { label: "Đang soát xét", badge: "bg-blue-50 text-blue-700 border-blue-200/80", dot: "bg-blue-400" },
  PENDING_MORE_INFO: { label: "Chờ bổ sung", badge: "bg-purple-50 text-purple-700 border-purple-200/80", dot: "bg-purple-400" },
  APPROVED: { label: "Đã duyệt", badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80", dot: "bg-emerald-400" },
  REJECTED: { label: "Từ chối", badge: "bg-red-50 text-red-700 border-red-200/80", dot: "bg-red-400" },
};

const AVATAR_COLORS = [
  "from-violet-500 to-violet-600",
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600",
  "from-cyan-500 to-cyan-600",
  "from-pink-500 to-pink-600",
  "from-indigo-500 to-indigo-600",
];

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

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

function looksLikeUrl(v?: string | null) {
  if (!v) return false;
  const s = v.trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

/** Tránh render object từ `data`/`message` khi API trả startup thay vì chuỗi. */
function successMessageFromApproveResponse(res: {
  data?: unknown;
  message?: unknown;
}): string {
  if (typeof res?.data === "string" && res.data.trim()) return res.data;
  if (typeof res?.message === "string" && res.message.trim()) return res.message;
  return "Cập nhật thành công.";
}

type KycFieldKey =
  | "legalName"
  | "taxId"
  | "certificateFile"
  | "applicantName"
  | "applicantRole"
  | "workEmail"
  | "website";

const KYC_SCORE_BY_DECISION: Record<string, number> = {
  // Nhóm tốt → 2 điểm
  EXACT_MATCH: 2,
  VALID_MATCH: 2,
  CLEAR_AND_MATCH: 2,
  STRONG_LINK: 2,
  ROLE_SUPPORTED: 2,
  COMPANY_DOMAIN_MATCH: 2,
  ACTIVE_AND_MATCH: 2,
  CONSISTENT_PUBLICLY: 2,
  CLEAR_AND_RELEVANT: 2,
  ACCEPTED: 2,

  // Nhóm chấp nhận được → 1 điểm
  PARTIAL_MATCH: 1,
  FOUND_BUT_DIFFERS: 1,
  UNCLEAR_BUT_PLAUSIBLE: 1,
  PLAUSIBLE_LINK: 1,
  ROLE_PLAUSIBLE: 1,
  PERSONAL_BUT_PLAUSIBLE: 1,
  ACTIVE_BUT_WEAK: 1,
  BASIC_BUT_WEAK: 1,
  ALIGNED: 1,

  // Nhóm chưa đủ cơ sở → 0 điểm
  CANNOT_VERIFY: 0,
  INCOMPLETE: 0,
  ROLE_UNSUPPORTED: 0,
  INACTIVE_OR_BROKEN: 0,
  UNCLEAR: 0,
  MISSING: 0,

  // Nhóm rủi ro cao → -2 điểm
  MISMATCH: -2,
  NOT_FOUND: -2,
  INVALID_FORMAT: -2,
  MISMATCH_OR_SUSPICIOUS: -2,
  SUSPICIOUS: -2,
  ROLE_INCONSISTENT: -2,
  UNRELATED: -2,
  INVALID: -2,
  NOT_RELATED: -2,
  IRRELEVANT_OR_SUSPICIOUS: -2,
};

const KYC_SCORING_CONFIG: Record<
  KycFieldKey,
  {
    label: string;
    options: { value: string; label: string }[];
  }
> = {
  legalName: {
    label: "Tên pháp lý đầy đủ",
    options: [
      { value: "EXACT_MATCH", label: "EXACT_MATCH" },
      { value: "PARTIAL_MATCH", label: "PARTIAL_MATCH" },
      { value: "CANNOT_VERIFY", label: "CANNOT_VERIFY" },
      { value: "MISMATCH", label: "MISMATCH" },
    ],
  },
  taxId: {
    label: "Mã số doanh nghiệp / mã số thuế",
    options: [
      { value: "VALID_MATCH", label: "VALID_MATCH" },
      { value: "FOUND_BUT_DIFFERS", label: "FOUND_BUT_DIFFERS" },
      { value: "NOT_FOUND", label: "NOT_FOUND" },
      { value: "INVALID_FORMAT", label: "INVALID_FORMAT" },
    ],
  },
  certificateFile: {
    label: "File Giấy chứng nhận ĐKDN",
    options: [
      { value: "CLEAR_AND_MATCH", label: "CLEAR_AND_MATCH" },
      { value: "UNCLEAR_BUT_PLAUSIBLE", label: "UNCLEAR_BUT_PLAUSIBLE" },
      { value: "INCOMPLETE", label: "INCOMPLETE" },
      { value: "MISMATCH_OR_SUSPICIOUS", label: "MISMATCH_OR_SUSPICIOUS" },
    ],
  },
  applicantName: {
    label: "Họ tên người nộp hồ sơ",
    options: [
      { value: "STRONG_LINK", label: "STRONG_LINK" },
      { value: "PLAUSIBLE_LINK", label: "PLAUSIBLE_LINK" },
      { value: "CANNOT_VERIFY", label: "CANNOT_VERIFY" },
      { value: "SUSPICIOUS", label: "SUSPICIOUS" },
    ],
  },
  applicantRole: {
    label: "Vai trò người nộp hồ sơ",
    options: [
      { value: "ROLE_SUPPORTED", label: "ROLE_SUPPORTED" },
      { value: "ROLE_PLAUSIBLE", label: "ROLE_PLAUSIBLE" },
      { value: "ROLE_UNSUPPORTED", label: "ROLE_UNSUPPORTED" },
      { value: "ROLE_INCONSISTENT", label: "ROLE_INCONSISTENT" },
    ],
  },
  workEmail: {
    label: "Email công việc",
    options: [
      { value: "COMPANY_DOMAIN_MATCH", label: "COMPANY_DOMAIN_MATCH" },
      { value: "PERSONAL_BUT_PLAUSIBLE", label: "PERSONAL_BUT_PLAUSIBLE" },
      { value: "UNRELATED", label: "UNRELATED" },
      { value: "INVALID", label: "INVALID" },
    ],
  },
  website: {
    label: "Website hoặc product link",
    options: [
      { value: "ACTIVE_AND_MATCH", label: "ACTIVE_AND_MATCH" },
      { value: "ACTIVE_BUT_WEAK", label: "ACTIVE_BUT_WEAK" },
      { value: "INACTIVE_OR_BROKEN", label: "INACTIVE_OR_BROKEN" },
      { value: "NOT_RELATED", label: "NOT_RELATED" },
    ],
  },
};

export default function KYCDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const startupId = Number(id);

  const [startup, setStartup] = useState<IStartup | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldDecisions, setFieldDecisions] = useState<Record<KycFieldKey, string>>({
    legalName: "",
    taxId: "",
    certificateFile: "",
    applicantName: "",
    applicantRole: "",
    workEmail: "",
    website: "",
  });

  const kycStatus = useMemo(() => mapProfileStatusToKycStatus(startup?.profileStatus), [startup?.profileStatus]);
  const statusCfg = STATUS_CFG[kycStatus];

  const entityName = (() => {
    const n = startup?.companyName ?? startup?.fullNameOfApplicant;
    if (n != null && typeof n === "string" && n.trim()) return n.trim();
    return "—";
  })();
  const avatarGradient = useMemo(() => getAvatarGradient(entityName), [entityName]);

  const kycTotalScore = useMemo(() => {
    const perFieldScores: number[] = [];

    (Object.keys(KYC_SCORING_CONFIG) as KycFieldKey[]).forEach((key) => {
      const selectedValue = fieldDecisions[key];
      if (!selectedValue) return;

      const cfg = KYC_SCORING_CONFIG[key];
      const found = cfg.options.find((o) => o.value === selectedValue);
      if (!found) return;

      const score = KYC_SCORE_BY_DECISION[selectedValue];
      if (typeof score !== "number") return;

      perFieldScores.push(score);
    });

    return perFieldScores.reduce((sum, s) => sum + s, 0);
  }, [fieldDecisions]);

  useEffect(() => {
    let alive = true;
    if (!startupId || Number.isNaN(startupId)) {
      setErrorMsg("Mã hồ sơ không hợp lệ.");
      return;
    }

    const run = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await GetPendingStartupById(startupId);
        if (!alive) return;

        if (res?.success || res?.isSuccess) {
          setStartup(res?.data ?? null);
        } else {
          setStartup(null);
          setErrorMsg(res?.message ?? "Không thể tải hồ sơ.");
        }
      } catch (e: any) {
        if (!alive) return;
        setStartup(null);
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
  }, [startupId]);

  const allFieldsScored = useMemo(
    () => (Object.keys(KYC_SCORING_CONFIG) as KycFieldKey[]).every((key) => !!fieldDecisions[key]),
    [fieldDecisions],
  );

  const canApprove = kycStatus !== "APPROVED" && allFieldsScored;

  const kycFields: Array<{ label: string; value: React.ReactNode }> = useMemo(() => {
    if (!startup) return [];

    return [
      { label: "Tên công ty / Startup", value: startup.companyName || "—" },
      { label: "Mã số doanh nghiệp", value: startup.bussinessCode || "—" },
      {
        label: "Giấy chứng nhận ĐKDN",
        value: startup.fileCertificateBusiness ? (
          looksLikeUrl(startup.fileCertificateBusiness) ? (
            <a
              href={startup.fileCertificateBusiness}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Xem tài liệu
            </a>
          ) : (
            <span className="text-[13px] text-slate-600">{startup.fileCertificateBusiness}</span>
          )
        ) : (
          "—"
        ),
      },
      { label: "Họ tên người nộp", value: startup.fullNameOfApplicant || "—" },
      { label: "Vai trò người nộp", value: startup.roleOfApplicant || "—" },
      { label: "Email liên hệ", value: startup.contactEmail || "—" },
      {
        label: "Website",
        value: startup.website ? (
          looksLikeUrl(startup.website) ? (
            <a
              href={startup.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Mở website
            </a>
          ) : (
            <span className="text-[13px] text-slate-600">{startup.website}</span>
          )
        ) : (
          "—"
        ),
      },
    ];
  }, [startup]);

  const onApprove = async () => {
    if (!startup) return;
    setApproving(true);
    setErrorMsg("");
    try {
      const res = await ApproveStartup(startup.startupID, kycTotalScore);
      if (res?.success || res?.isSuccess) {
        setSuccessMessage(successMessageFromApproveResponse(res));
        setIsSuccess(true);
        setConfirmOpen(false);
      } else {
        setErrorMsg(res?.message ?? "Không thể phê duyệt hồ sơ.");
      }
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Có lỗi xảy ra khi phê duyệt.");
    } finally {
      setApproving(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-20" />
          <CheckCircle2 className="w-12 h-12 text-emerald-500 relative z-10" />
        </div>
        <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Xử lý thành công!</h2>
        <p className="text-[14px] text-slate-500 mt-2 text-center max-w-sm">
          Hồ sơ <span className="font-bold text-slate-900">{entityName}</span> đã được cập nhật.
        </p>
        {successMessage ? (
          <p className="text-[13px] text-slate-500 mt-2 text-center max-w-sm italic">
            {successMessage}
          </p>
        ) : null}
        <div className="flex items-center gap-4 mt-10">
          <Link
            href="/staff/kyc"
            className="px-6 py-2.5 rounded-xl bg-[#0f172a] text-white text-[13px] font-bold hover:bg-[#1e293b] transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            Về danh sách
          </Link>
          <button
            onClick={() => {
              setIsSuccess(false);
              setSuccessMessage("");
            }}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            Xem lại hồ sơ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-400">
      <div className="flex items-center justify-between">
        <Link
          href="/staff/kyc"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-[13px] font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>
        <div className="flex items-center gap-2">{/* reserved */}</div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-[18px] font-bold shrink-0 shadow-sm",
                avatarGradient,
              )}
            >
              {String(entityName).charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[20px] font-bold text-slate-900 leading-tight font-plus-jakarta-sans">
                  {entityName}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border",
                    statusCfg.badge,
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                  {statusCfg.label}
                </span>
              </div>

              <p className="text-[13px] text-slate-500 mt-1">Thông tin KYC của Startup</p>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {startup?.createdAt ? new Date(startup.createdAt).toLocaleDateString("vi-VN") : "—"}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">#{startup?.startupID ?? id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-100 no-scrollbar overflow-x-auto">
            <span className="text-[11px] text-slate-400 uppercase tracking-wide font-medium">
              Ban thẩm định
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
          <div className="h-6 bg-slate-50 rounded animate-pulse mb-4" />
          <div className="h-6 bg-slate-50 rounded animate-pulse mb-4" />
          <div className="h-6 bg-slate-50 rounded animate-pulse" />
        </div>
      ) : errorMsg ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-slate-600">
          {errorMsg}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Thẩm định chi tiết
                </h2>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Trường KYC
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                        Thông tin
                      </th>
                      <th className="px-6 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 w-[55%]">
                        Dữ liệu
                      </th>
                      <th className="px-6 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 w-[30%]">
                        Đánh giá
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {kycFields.map((row) => (
                      <tr key={row.label} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-5 align-top">
                          <p className="text-[13px] font-semibold text-slate-700">{row.label}</p>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="text-[13px] text-slate-600 leading-relaxed font-normal">
                            {row.value}
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          {/* Match display row with scoring field when possible */}
                          {(() => {
                            let scoringKey: KycFieldKey | null = null;
                            if (row.label.includes("Tên công ty")) scoringKey = "legalName";
                            else if (row.label.includes("Mã số doanh nghiệp")) scoringKey = "taxId";
                            else if (row.label.includes("Giấy chứng nhận ĐKDN")) scoringKey = "certificateFile";
                            else if (row.label.includes("Họ tên người nộp")) scoringKey = "applicantName";
                            else if (row.label.includes("Vai trò người nộp")) scoringKey = "applicantRole";
                            else if (row.label.includes("Email liên hệ")) scoringKey = "workEmail";
                            else if (row.label.includes("Website")) scoringKey = "website";

                            if (!scoringKey) return null;

                            const cfg = KYC_SCORING_CONFIG[scoringKey];

                            return (
                              <div className="flex flex-col gap-1">
                                <select
                                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300"
                                  value={fieldDecisions[scoringKey]}
                                  onChange={(e) =>
                                    setFieldDecisions((prev) => ({
                                      ...prev,
                                      [scoringKey as KycFieldKey]: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">Chọn đánh giá...</option>
                                  {cfg.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-[11px] text-slate-400">
                                  Điểm:{" "}
                                  {fieldDecisions[scoringKey]
                                    ? KYC_SCORE_BY_DECISION[fieldDecisions[scoringKey]] ?? "-"
                                    : "-"}
                                </p>
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-5">          

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-5">
              <h2 className="text-[13px] font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Hành động thẩm định
              </h2>

              {errorMsg ? (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium">
                  {errorMsg}
                </div>
              ) : null}

              <p className="text-[13px] text-slate-500 mb-2 leading-relaxed">
                Xác nhận phê duyệt hồ sơ KYC cho <span className="font-bold text-slate-900">{startup?.companyName}</span>.
              </p>
              <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">
                Tổng điểm thẩm định hiện tại:{" "}
                <span className="font-bold text-slate-900">{kycTotalScore}</span>
              </p>
              {!allFieldsScored ? (
                <p className="text-[11px] text-amber-600 mb-4">
                  Vui lòng chọn đánh giá cho tất cả các trường trước khi phê duyệt.
                </p>
              ) : null}

              <button
                disabled={!canApprove || approving || loading}
                onClick={() => setConfirmOpen(true)}
                className={cn(
                  "w-full py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95",
                  canApprove && !approving
                    ? "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed",
                )}
              >
                {canApprove ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Phê duyệt hồ sơ
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Hồ sơ đã được xử lý
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-slate-900">Xác nhận phê duyệt</h3>
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  disabled={approving}
                >
                  <XCircle className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <p className="text-[13px] text-slate-500 leading-relaxed">
                Bạn đang phê duyệt KYC của hồ sơ{" "}
                <span className="font-bold text-slate-900 border-b border-[#eec54e]">
                  #{startup?.startupID ?? id}
                </span>{" "}
                cho <span className="font-bold text-slate-900">{startup?.companyName}</span>.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Trạng thái hiện tại
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border", statusCfg.badge)}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                disabled={approving}
              >
                Huỷ bỏ
              </button>
              <button
                onClick={onApprove}
                disabled={approving || !startup}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all shadow-sm active:scale-95",
                  approving ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700",
                )}
              >
                {approving ? "Đang phê duyệt..." : "Phê duyệt hồ sơ"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

