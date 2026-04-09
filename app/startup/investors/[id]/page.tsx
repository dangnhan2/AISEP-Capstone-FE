"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter, notFound } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import {
    ArrowLeft,
    ArrowUpRight,
    Globe,
    Linkedin,
    MapPin,
    Info,
    TrendingUp,
    Flag,
    Zap,
    Target,
    HelpCircle,
    UserPlus,
    MessageCircle,
    Clock,
    Loader2,
    AlertCircle,
    Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getInvestorPreferredStageLabel } from "@/lib/investor-preferred-stages";
import { buildInvestorProfilePresentation, isInvestorKycVerified } from "@/lib/investor-profile-presenter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InvestorConnectionModal } from "@/components/startup/investor-connection-modal";
import { GetConnectionByInvestorId } from "@/services/connection/connection.api";
import { GetInvestorById } from "@/services/startup/startup.api";
import { CreateConversation } from "@/services/messaging/messaging.api";
import { VerifiedRoleMark } from "@/components/shared/verified-role-mark";

// -- Types ----------------------------------------------------------------------

// -- Helpers ------------------------------------------------------------------

function deriveBadges(
    inv: IInvestorProfile,
    isInstitutional?: boolean,
    canRequestConnection = false,
): { label: string; color: "yellow" | "green" | "blue" }[] {
    const badges: { label: string; color: "yellow" | "green" | "blue" }[] = [];
    if (isInstitutional) badges.push({ label: "QUỸ CHÍNH QUY", color: "yellow" });
    else badges.push({ label: "ANGEL INVESTOR", color: "yellow" });
    if (canRequestConnection) badges.push({ label: "ĐANG MỞ KẾT NỐI", color: "green" });
    if (inv.country) badges.push({ label: inv.country.toUpperCase(), color: "blue" });
    return badges;
}

function AvatarOrLogo({ name, url, className }: { name: string; url?: string; className?: string }) {
    if (url) {
        return (
            <div className={cn("relative overflow-hidden", className)}>
                <Image src={url} alt={name} fill sizes="128px" className="object-cover" />
            </div>
        );
    }
    const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
    return (
        <div className={cn("bg-slate-100 flex items-center justify-center font-black text-slate-500 text-2xl", className)}>
            {initials}
        </div>
    );
}

// -- Page ---------------------------------------------------------------------

export default function InvestorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const investorId = Number(id);
    const router = useRouter();

    const [investor, setInvestor] = useState<IInvestorProfile | null>(null);
    const [investorLoading, setInvestorLoading] = useState(true);
    const [investorError, setInvestorError] = useState<string | null>(null);
    const [isNotFound, setIsNotFound] = useState(false);

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [connection, setConnection] = useState<IConnectionItem | null>(null);
    const [connectionLoading, setConnectionLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);

    // Fetch investor profile + connection status in parallel
    useEffect(() => {
        const loadInvestor = async () => {
            setInvestorLoading(true);
            try {
                const res = await GetInvestorById(investorId) as unknown as IBackendRes<IInvestorProfile>;
                if (res.isSuccess && res.data) {
                    setInvestor(res.data);
                } else {
                    setIsNotFound(true);
                }
            } catch (error) {
                const status =
                    typeof error === "object" &&
                    error !== null &&
                    "response" in error &&
                    typeof (error as { response?: { status?: number } }).response?.status === "number"
                        ? (error as { response?: { status?: number } }).response?.status
                        : undefined;

                if (status === 404) {
                    setIsNotFound(true);
                    return;
                }
                setInvestorError("Không thể tải thông tin nhà đầu tư.");
            } finally {
                setInvestorLoading(false);
            }
        };

        const loadConnection = async () => {
            try {
                const conn = await GetConnectionByInvestorId(investorId);
                setConnection(conn);
            } catch { /* silent */ } finally {
                setConnectionLoading(false);
            }
        };

        loadInvestor();
        loadConnection();
    }, [investorId]);

    const handleConnectionSuccess = (connectionId: number) => {
        setConnection({
            connectionID: connectionId,
            startupID: 0,
            startupName: "",
            investorID: investorId,
            investorName: investor?.fullName ?? "",
            connectionStatus: "Pending",
            personalizedMessage: "",
            matchScore: 0,
            requestedAt: new Date().toISOString(),
            respondedAt: "",
        });
    };

    const handleStartChat = async () => {
        if (!connection) return;
        setChatLoading(true);
        try {
            const res = await CreateConversation({ connectionId: connection.connectionID });
            if (res.isSuccess && res.data) {
                router.push(`/startup/messaging?conversationId=${res.data.conversationId}`);
            } else {
                router.push("/startup/messaging");
            }
        } catch {
            router.push("/startup/messaging");
        } finally {
            setChatLoading(false);
        }
    };

    // -- Loading / Error states --
    if (investorLoading) {
        return (
            <StartupShell>
                <div className="flex flex-col items-center justify-center py-40 text-slate-400">
                    <Loader2 className="size-8 animate-spin mb-3 text-[#eec54e]" />
                    <p className="text-[14px] font-medium">Đang tải hồ sơ nhà đầu tư...</p>
                </div>
            </StartupShell>
        );
    }

    if (isNotFound) notFound();

    if (investorError || !investor) {
        return (
            <StartupShell>
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="size-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                        <AlertCircle className="size-6 text-red-400" />
                    </div>
                    <p className="text-slate-800 font-semibold text-[16px] mb-1">{investorError || "Không tìm thấy nhà đầu tư"}</p>
                    <button onClick={() => router.push("/startup/investors")} className="mt-5 px-4 py-2 rounded-xl text-[13px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        Quay lại danh sách
                    </button>
                </div>
            </StartupShell>
        );
    }

    const presentation = buildInvestorProfilePresentation(investor);
    const isKycVerified = isInvestorKycVerified(investor);
    const profileAvailabilityReason = investor.profileAvailabilityReason ?? "OPEN";
    const isReadOnlyProfile = profileAvailabilityReason === "INVESTOR_PAUSED_DISCOVERY";
    const canRequestConnection = investor.canRequestConnection ?? (!isReadOnlyProfile && investor.acceptingConnections);
    const badges = deriveBadges(investor, presentation.isInstitutional, canRequestConnection);
    const badgeColors = {
        yellow: "bg-yellow-50/50 border-yellow-200/50 text-yellow-600",
        green:  "bg-green-50/50 border-green-200/50 text-green-600",
        blue:   "bg-blue-50/50 border-blue-200/50 text-blue-600",
    };
    const dotColors = { yellow: "bg-yellow-400", green: "bg-green-400", blue: "bg-blue-400" };
    const locationLabel = [investor.location, investor.country].filter(Boolean).join(", ");
    const preferredStages = (investor.preferredStages ?? []).map(getInvestorPreferredStageLabel);
    const aiScoreRangeLabel = typeof investor.preferredAIScoreRange === "string"
        ? investor.preferredAIScoreRange
        : investor.preferredAIScoreRange
            ? `${(investor.preferredAIScoreRange as { min?: number; max?: number }).min} - ${(investor.preferredAIScoreRange as { min?: number; max?: number }).max}`
            : "";
    const highlightItems = [
        { label: "Loại nhà đầu tư", value: presentation.categoryLabel || investor.investorType || "Nhà đầu tư" },
        { label: "Giai đoạn quan tâm", value: preferredStages.slice(0, 2).join(" | ") || "Chưa cập nhật" },
        { label: "Lĩnh vực ưu tiên", value: (investor.preferredIndustries ?? []).slice(0, 2).join(" | ") || "Chưa cập nhật" },
    ];

    return (
        <StartupShell>
            <div className="mx-auto max-w-[1100px] space-y-6 pb-20 animate-in fade-in duration-500">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-br from-amber-50 via-white to-sky-50" />
                    <div className="absolute -right-8 top-0 h-36 w-36 rounded-full bg-[#eec54e]/20 blur-3xl" />
                    <div className="absolute left-8 top-6 h-20 w-20 rounded-full bg-sky-200/30 blur-3xl" />

                    <div className="relative p-6 sm:p-8">
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <Link
                                href="/startup/investors"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-[12px] font-semibold text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-colors hover:text-slate-900"
                            >
                                <ArrowLeft className="size-4" />
                                Quay lại danh sách
                            </Link>

                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                                <span className={cn("size-2 rounded-full", isReadOnlyProfile ? "bg-slate-300" : connection?.connectionStatus === "Accepted" ? "bg-emerald-400" : connection?.connectionStatus === "Pending" ? "bg-amber-400" : canRequestConnection ? "bg-sky-400" : "bg-slate-300")} />
                                {isReadOnlyProfile
                                    ? "Hồ sơ chỉ xem"
                                    : connectionLoading
                                    ? "Đang tải trạng thái"
                                    : connection?.connectionStatus === "Accepted"
                                        ? "Đã kết nối"
                                        : connection?.connectionStatus === "Pending"
                                            ? "Đang chờ phản hồi"
                                            : canRequestConnection
                                                ? "Sẵn sàng kết nối"
                                                : "Không nhận kết nối"}
                            </div>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                                    <div className="relative size-28 shrink-0 rounded-2xl border-4 border-white bg-white shadow-xl shadow-amber-500/10 sm:size-32">
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/20" />
                                        <AvatarOrLogo name={presentation.primaryName} url={investor.profilePhotoURL} className="relative size-full rounded-xl border border-slate-100 bg-slate-50" />
                                    </div>

                                    <div className="min-w-0 space-y-4 text-center sm:text-left">
                                        <div className="space-y-3">
                                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">Hồ sơ nhà đầu tư</p>
                                            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                                                <h1 className="text-[26px] font-black tracking-tight text-slate-900">{presentation.primaryName}</h1>
                                                {isKycVerified && <VerifiedRoleMark className="h-5 w-5" />}
                                            </div>
                                            {presentation.heroIdentityLine && <p className="max-w-[640px] text-[15px] font-semibold text-slate-500">{presentation.heroIdentityLine}</p>}
                                            {!presentation.heroIdentityLine && investor.title && <p className="max-w-[640px] text-[15px] font-semibold text-slate-500">{investor.title}</p>}
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-2.5 sm:justify-start">
                                            {badges.map((badge, i) => (
                                                <div key={i} className={cn("inline-flex items-center gap-2 rounded-xl border px-3 py-1.5", badgeColors[badge.color])}>
                                                    <div className={cn("size-2.5 rounded-full", dotColors[badge.color])} />
                                                    <span className="text-[11px] font-medium">{badge.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {locationLabel && (
                                            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-[12px] font-medium text-slate-500">
                                                    <MapPin className="size-3.5 text-slate-400" />
                                                    {locationLabel}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
                                    {highlightItems.map((item, index) => (
                                        <div
                                            key={item.label}
                                            className={cn(
                                                "flex items-center gap-2",
                                                index === 1 ? "md:px-6 md:border-x md:border-slate-100" : "",
                                            )}
                                        >
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
                                                {index === 0 ? (
                                                    <Target className="h-4 w-4 text-amber-500" />
                                                ) : index === 1 ? (
                                                    <TrendingUp className="h-4 w-4 text-blue-500" />
                                                ) : (
                                                    <Handshake className="h-4 w-4 text-emerald-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-bold leading-none text-slate-900">
                                                    {item.value}
                                                </p>
                                                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                    {item.label}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,197,78,0.12),transparent_38%)]" />
                                <div className="relative space-y-6">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Trạng thái kết nối</p>
                                        <h2 className="mt-3 text-[20px] font-black tracking-tight text-slate-900">
                                            {isReadOnlyProfile
                                                ? "Hồ sơ không mở kết nối mới"
                                                : connectionLoading
                                                ? "Đang kiểm tra"
                                                : connection?.connectionStatus === "Accepted"
                                                    ? "Có thể trò chuyện ngay"
                                                    : connection?.connectionStatus === "Pending"
                                                        ? "Lời mời đang mở"
                                                        : canRequestConnection
                                                            ? "Có thể gửi lời mời"
                                                            : "Tạm đóng tiếp nhận"}
                                        </h2>
                                        <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
                                            {isReadOnlyProfile
                                                ? "Nhà đầu tư này đang tạm ẩn khỏi danh sách khám phá. Bạn vẫn có thể xem hồ sơ ở chế độ chỉ đọc."
                                                : connectionLoading
                                                ? "AISEP đang đối chiếu trạng thái kết nối gần nhất với nhà đầu tư này."
                                                : connection?.connectionStatus === "Accepted"
                                                    ? "Kết nối đã được chấp nhận. Bạn có thể bắt đầu trao đổi trực tiếp để đi sâu vào cơ hội hợp tác."
                                                    : connection?.connectionStatus === "Pending"
                                                        ? "Nhà đầu tư đã nhận được lời mời của bạn. Hãy giữ hồ sơ startup đầy đủ để tăng khả năng phản hồi."
                                                        : canRequestConnection
                                                            ? "Hồ sơ này hiện đang mở kết nối. Bạn có thể gửi lời mời kèm thông điệp cá nhân ngay từ màn hình này."
                                                            : "Nhà đầu tư hiện chưa tiếp nhận lời mời mới. Bạn vẫn có thể xem tiêu chí để chuẩn bị cho lần tiếp cận sau."}
                                        </p>
                                    </div>

                                    {isReadOnlyProfile ? (
                                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-medium text-slate-500">
                                            Hồ sơ này đang ở chế độ chỉ xem.
                                        </div>
                                    ) : connectionLoading ? (
                                        <Button disabled className="h-11 w-full rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-500 gap-2.5">
                                            <Loader2 className="size-4 animate-spin" />
                                            <span>Đang tải</span>
                                        </Button>
                                    ) : connection?.connectionStatus === "Accepted" ? (
                                        <Button onClick={handleStartChat} disabled={chatLoading} className="h-11 w-full rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-semibold text-[13px] shadow-sm gap-2.5">
                                            {chatLoading ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-5" />}
                                            <span>Bắt đầu chat</span>
                                        </Button>
                                    ) : connection?.connectionStatus === "Pending" ? (
                                        <Button disabled className="h-11 w-full rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-400 gap-2.5 cursor-not-allowed">
                                            <Clock className="size-5" />
                                            <span>Đang chờ phản hồi</span>
                                        </Button>
                                    ) : canRequestConnection ? (
                                        <Button onClick={() => setIsRequestModalOpen(true)} className="h-11 w-full rounded-xl bg-[#fdf8e6] text-slate-900 border border-amber-200 hover:bg-[#faefbe] transition-all font-semibold text-[13px] shadow-sm gap-2.5">
                                            <UserPlus className="size-5" />
                                            <span>Gửi lời mời kết nối</span>
                                        </Button>
                                    ) : (
                                        <Button disabled className="h-11 w-full rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-400 gap-2.5 cursor-not-allowed">
                                            <Clock className="size-5" />
                                            <span>Không nhận kết nối</span>
                                        </Button>
                                    )}

                                    <div className="grid gap-3 border-t border-slate-200 pt-4">
                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Phạm vi hiện diện</p>
                                            <p className="mt-2 text-[13px] font-semibold leading-relaxed text-slate-900">{locationLabel || investor.country || "Chưa cập nhật"}</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Hồ sơ đầu tư</p>
                                            <p className="mt-2 text-[13px] font-semibold leading-relaxed text-slate-900">{presentation.organizationName || investor.title || presentation.categoryLabel || "Đang cập nhật"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Tong quan */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-8 space-y-10">
                                {/* Bio */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50">
                                            <Info className="size-5 text-[#C8A000]" />
                                        </div>
                                        <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Tổng quan hồ sơ</p>
                                        <h2 className="mt-1 text-[20px] font-bold text-slate-900">Về {presentation.primaryName}</h2>
                                        </div>
                                    </div>
                                    <div className="rounded-[28px] border border-slate-200/60 bg-gradient-to-b from-white to-slate-50 p-6 sm:p-7">
                                        <p className="text-[14px] leading-relaxed text-slate-600">
                                            {investor.bio || "Chưa có thông tin giới thiệu."}
                                        </p>
                                    </div>
                                </section>

                                {/* Support Offered + Investment Thesis */}
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {(investor.supportOffered?.length ?? 0) > 0 && (
                                        <div className="rounded-[28px] border border-emerald-100/80 bg-emerald-50/60 p-6 space-y-5">
                                            <div className="flex items-center gap-3">
                                                <Handshake className="size-5 text-emerald-600" />
                                                <h3 className="text-[15px] font-semibold text-slate-900">Hỗ trợ cung cấp</h3>
                                            </div>
                                            <ul className="space-y-4">
                                                {(investor.supportOffered ?? []).map((item, i) => (
                                                    <li key={i} className="flex gap-3">
                                                        <div className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                                                        <p className="text-[13px] leading-relaxed text-slate-600">{item}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {investor.investmentThesis && (
                                        <div className="rounded-[28px] border border-amber-100/80 bg-amber-50/50 p-6 space-y-5">
                                            <div className="flex items-center gap-3">
                                                <TrendingUp className="size-5 text-[#C8A000]" />
                                                <h3 className="text-[15px] font-semibold text-slate-900">Luận điểm đầu tư</h3>
                                            </div>
                                            <p className="text-[13px] leading-relaxed text-slate-600">
                                                {investor.investmentThesis}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Connection Guidance */}
                                {investor.connectionGuidance && (
                                    <section className="rounded-[28px] border border-slate-200/70 bg-slate-50/90 p-6 sm:p-7 space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                                                <Flag className="size-5 text-[#C8A000]" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Hướng dẫn tiếp cận</p>
                                                <h2 className="mt-1 text-[20px] font-bold text-slate-900">Gợi ý kết nối</h2>
                                            </div>
                                        </div>
                                        <p className="text-[14px] leading-relaxed text-slate-600">
                                            {investor.connectionGuidance}
                                        </p>
                                    </section>
                                )}
                            </div>

                        {/* Tieu chi dau tu */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-8 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50">
                                        <Target className="size-5 text-[#C8A000]" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Tiêu chí đầu tư</p>
                                        <h2 className="mt-1 text-[20px] font-bold text-slate-900">Tiêu chí đầu tư</h2>
                                    </div>
                                </div>
                                {[
                                    { label: "Giai đoạn ưu tiên", items: preferredStages },
                                    { label: "Lĩnh vực ưu tiên", items: investor.preferredIndustries },
                                    { label: "Địa lý", items: investor.preferredGeographies },
                                    { label: "Phạm vi thị trường", items: investor.preferredMarketScopes },
                                    { label: "Độ trưởng thành sản phẩm", items: investor.preferredProductMaturity },
                                    { label: "Mức độ kiểm chứng", items: investor.preferredValidationLevel },
                                    { label: "Điểm mạnh ưu tiên", items: investor.preferredStrengths },
                                ].filter(g => (g.items?.length ?? 0) > 0).map(group => (
                                    <div key={group.label} className="rounded-[26px] border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-6 space-y-4">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{group.label}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(group.items ?? []).map(item => (
                                                <span key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {investor.preferredAIScoreRange && (
                                    <div className="rounded-[28px] border border-amber-100/80 bg-amber-50/60 p-6 sm:p-7 space-y-3">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Dải AI Score ưu tiên</p>
                                        <p className="text-[20px] font-bold text-slate-900">
                                            {aiScoreRangeLabel}
                                        </p>
                                        <p className="text-[13px] text-slate-500">Mức độ quan trọng: <span className="font-semibold text-amber-600">{investor.aiScoreImportance}</span></p>
                                    </div>
                                )}
                            </div>

                        {/* Thong tin lien he */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-8 space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50">
                                        <HelpCircle className="size-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Thông tin liên hệ</p>
                                        <h2 className="mt-1 text-[20px] font-bold text-slate-900">Thông tin liên hệ</h2>
                                    </div>
                                </div>
                                {investor.website && (
                                    <a href={investor.website.startsWith("http") ? investor.website : `https://${investor.website}`} target="_blank" rel="noopener noreferrer"
                                        className="group flex items-center justify-between gap-4 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/70">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                                                <Globe className="size-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Website chính thức</p>
                                                <p className="mt-1 text-[13px] font-medium text-slate-700 transition-colors group-hover:text-blue-600">{investor.website}</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="size-4 text-slate-300 transition-colors group-hover:text-blue-500" />
                                    </a>
                                )}
                                {investor.linkedInURL && (
                                    <a href={investor.linkedInURL.startsWith("http") ? investor.linkedInURL : `https://linkedin.com/in/${investor.linkedInURL}`} target="_blank" rel="noopener noreferrer"
                                        className="group flex items-center justify-between gap-4 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/70">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                                                <Linkedin className="size-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">LinkedIn</p>
                                                <p className="mt-1 text-[13px] font-medium text-slate-700 transition-colors group-hover:text-blue-600">{investor.linkedInURL}</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="size-4 text-slate-300 transition-colors group-hover:text-blue-500" />
                                    </a>
                                )}
                                {locationLabel && (
                                    <div className="flex items-center gap-4 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                                            <MapPin className="size-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Địa điểm</p>
                                            <p className="mt-1 text-[13px] font-medium text-slate-700">{locationLabel}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-8 lg:self-start">
                        {/* Investment Criteria Summary */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
                            <div className="flex items-center gap-3">
                                <Target className="size-5 text-[#C8A000]" />
                                <h3 className="text-[13px] font-semibold text-slate-900">Tiêu chí đầu tư</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Loại nhà đầu tư</p>
                                    <p className="text-[15px] font-semibold leading-relaxed text-slate-900">{presentation.categoryLabel || investor.investorType}</p>
                                    {presentation.organizationName && <p className="mt-1 text-[12px] text-slate-500">{presentation.organizationName}</p>}
                                </div>
                                {preferredStages.length > 0 && (
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Giai đoạn ưu tiên</p>
                                        <div className="flex flex-wrap gap-2">
                                            {preferredStages.map(stage => (
                                                <span key={stage} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] font-medium text-slate-700">
                                                    {stage}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {(investor.preferredIndustries?.length ?? 0) > 0 && (
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Lĩnh vực quan tâm</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(investor.preferredIndustries ?? []).slice(0, 6).map(sector => (
                                                <span key={sector} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600">
                                                    {sector}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact quick-view */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="size-5 text-blue-500" />
                                <h3 className="text-[13px] font-semibold text-slate-900">Thông tin liên hệ</h3>
                            </div>
                            {investor.website && (
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 p-4">
                                    <Globe className="size-4 text-slate-400 shrink-0" />
                                    <p className="text-[13px] font-medium text-slate-600 truncate">{investor.website}</p>
                                </div>
                            )}
                            {investor.linkedInURL && (
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 p-4">
                                    <Linkedin className="size-4 text-slate-400 shrink-0" />
                                    <p className="text-[13px] font-medium text-slate-600 truncate">{investor.linkedInURL}</p>
                                </div>
                            )}
                            {locationLabel && (
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 p-4">
                                    <MapPin className="size-4 text-slate-400 shrink-0" />
                                    <p className="text-[13px] font-medium text-slate-600">{locationLabel}</p>
                                </div>
                            )}
                        </div>

                        {/* Note */}
                        <div className="overflow-hidden rounded-2xl border border-amber-100/80 bg-gradient-to-b from-amber-50/90 to-orange-50/80 p-6 shadow-[0_1px_3px_rgba(251,191,36,0.12)] space-y-4">
                            <div className="flex items-center gap-3">
                                <Zap className="size-5 text-[#C8A000]" />
                                <h3 className="text-[13px] font-semibold text-slate-900">Ghi chú quan trọng</h3>
                            </div>
                            <p className="text-[13px] leading-relaxed text-slate-600">
                                {canRequestConnection
                                    ? "Nhà đầu tư này đang mở kết nối. Hãy đảm bảo hồ sơ dự án đã đầy đủ trước khi gửi lời mời."
                                    : "Nhà đầu tư này đang tạm ẩn khỏi danh sách khám phá. Bạn vẫn có thể xem hồ sơ ở chế độ chỉ đọc."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                <InvestorConnectionModal
                    isOpen={isRequestModalOpen}
                    onClose={() => setIsRequestModalOpen(false)}
                    investor={investor ? {
                        name: presentation.primaryName,
                        logo: investor.profilePhotoURL ?? "",
                        type: presentation.heroIdentityLine || presentation.categoryLabel || investor.firmName || investor.investorType || "",
                        investorId: investorId,
                    } : null}
                    onSuccess={handleConnectionSuccess}
                />
            </div>
        </StartupShell>
    );
}

