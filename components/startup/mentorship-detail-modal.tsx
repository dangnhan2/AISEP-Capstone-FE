"use client";

import { useState, useEffect } from "react";
import { X, Search, Clock, Calendar, CheckCircle2, User, HelpCircle, FileText, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetMentorshipById } from "@/services/mentorships/mentorship.api";

interface MentorshipDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentorshipId: number | null;
}

const formatDate = (input?: string) => {
    if (!input) return "--";
    try {
        const d = new Date(input);
        return d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return input;
    }
};

const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
        case "requested":
        case "pending":
        case "chờ phản hồi":
            return "text-blue-600 bg-blue-50 border-blue-100";
        case "accepted":
        case "đã chấp nhận":
            return "text-teal-600 bg-teal-50 border-teal-100";
        case "inprogress":
            return "text-indigo-600 bg-indigo-50 border-indigo-100";
        case "completed":
        case "hoàn thành":
        case "resolved":
            return "text-green-600 bg-green-50 border-green-100";
        case "rejected":
        case "từ chối":
        case "indispute":
            return "text-red-500 bg-red-50 border-red-100";
        case "cancelled":
        case "đã hủy":
        case "expired":
            return "text-slate-500 bg-slate-50 border-slate-100";
        default:
            return "text-slate-500 bg-slate-50 border-slate-100";
    }
};

const getStatusLabel = (status: string) => {
    switch ((status || "").toLowerCase()) {
        case "requested":
        case "pending":
        case "chờ phản hồi":
            return "Chờ phản hồi";
        case "accepted":
        case "đã chấp nhận":
            return "Đã chấp nhận";
        case "inprogress":
            return "Đang diễn ra";
        case "completed":
        case "hoàn thành":
            return "Hoàn thành";
        case "rejected":
        case "từ chối":
            return "Từ chối";
        case "cancelled":
        case "đã hủy":
            return "Đã hủy";
        case "indispute":
            return "Đang tranh chấp";
        case "resolved":
            return "Đã giải quyết";
        case "expired":
            return "Đã hết hạn";
        default:
            return status || "--";
    }
};

export function MentorshipDetailModal({ isOpen, onClose, mentorshipId }: MentorshipDetailModalProps) {
    const [detail, setDetail] = useState<IMentorshipDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !mentorshipId) {
            setDetail(null);
            setError(null);
            return;
        }

        let isMounted = true;

        const fetchDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await GetMentorshipById(mentorshipId);
                if (isMounted) {
                    setDetail(response.data as any);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err?.response?.data?.message || "Không thể tải thông tin chi tiết. Vui lòng thử lại.");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchDetail();

        return () => {
            isMounted = false;
        };
    }, [isOpen, mentorshipId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <Search className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-bold text-slate-800">Chi tiết Yêu cầu Cố vấn</h2>
                            <p className="text-[13px] text-slate-500 font-medium">Mã yêu cầu: #{mentorshipId}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-3">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-[14px] text-slate-500 font-medium">Đang tải thông tin...</p>
                        </div>
                    ) : error ? (
                        <div className="py-10 text-center">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <X className="w-6 h-6" />
                            </div>
                            <p className="text-[14px] font-medium text-slate-800 mb-1">Đã có lỗi xảy ra</p>
                            <p className="text-[13px] text-slate-500">{error}</p>
                        </div>
                    ) : detail ? (
                        <div className="space-y-6">

                            {/* Advisor & Status */}
                            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Cố vấn</p>
                                    <p className="text-[14px] font-semibold text-slate-800">{detail.advisorName}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Trạng thái</p>
                                    <span className={cn("inline-flex px-3 py-1 rounded-full text-[12px] font-bold border", getStatusColor(detail.mentorshipStatus))}>
                                        {getStatusLabel(detail.mentorshipStatus)}
                                    </span>
                                </div>
                            </div>

                            {/* Challenge */}
                            <div>
                                <h3 className="text-[13px] font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-emerald-500" />
                                    Vấn đề / Thách thức
                                </h3>
                                <div className="bg-white border border-slate-200 rounded-xl p-4 text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {detail.challengeDescription || "Không có nội dung."}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Thời lượng dự kiến</p>
                                    <p className="text-[13px] font-medium text-slate-800">{detail.expectedDuration ? `${detail.expectedDuration} phút` : "--"}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày gửi yêu cầu</p>
                                    <p className="text-[13px] font-medium text-slate-800 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {formatDate(detail.requestedAt || detail.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Additional Information (if any) */}
                            {detail.rejectedReason && (
                                <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                                    <h3 className="text-[13px] font-bold text-red-700 mb-1 flex items-center gap-2">
                                        <Ban className="w-4 h-4" />
                                        Lý do từ chối
                                    </h3>
                                    <p className="text-[13px] text-red-600">{detail.rejectedReason}</p>
                                </div>
                            )}

                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
