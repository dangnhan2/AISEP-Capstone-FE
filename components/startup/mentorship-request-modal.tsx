"use client";

import { useState, useEffect } from "react";
import { X, Send, CheckCircle2, BadgeCheck, Clock, Check, Plus, Trash2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateMentorship } from "@/services/mentorships/mentorship.api";

interface MentorshipRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentor: { id?: number; name: string; avatar: string; title?: string; hourlyRate?: number; supportedDurations?: number[] } | null;
}

const SCOPE_OPTIONS = [
    { value: "strategy", label: "Chiến lược" },
    { value: "fundraising", label: "Gọi vốn" },
    { value: "product", label: "Product" },
    { value: "engineering", label: "Kỹ thuật" },
    { value: "marketing", label: "Marketing" },
    { value: "legal", label: "Pháp lý" },
    { value: "operations", label: "Vận hành" },
];

const DURATIONS = [
    { value: "30", label: "30 phút" },
    { value: "60", label: "60 phút" },
    { value: "90", label: "90 phút" },
];

interface TimeSlot { date: string; time: string; }
interface FormErrors { objective?: string; problemContext?: string; scope?: string; apiError?: string; }

export function MentorshipRequestModal({ isOpen, onClose, mentor }: MentorshipRequestModalProps) {
    const [problemContext, setProblemContext] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [scope, setScope] = useState<string[]>([]);

    const [duration, setDuration] = useState("60");
    const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");
    const [slots, setSlots] = useState<TimeSlot[]>([{ date: "", time: "" }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        if (!isOpen) {
            setProblemContext(""); setAdditionalNotes("");
            setScope([]); setDuration("60");
            setTimezone("Asia/Ho_Chi_Minh"); setSlots([{ date: "", time: "" }]);
            setIsSubmitting(false); setIsSuccess(false);
            setErrors({}); setSubmitted(false);
        }
    }, [isOpen]);

    const toggleScope = (val: string) => {
        const next = scope.includes(val) ? scope.filter(v => v !== val) : [...scope, val];
        setScope(next);
        if (submitted) setErrors(e => ({ ...e, scope: next.length > 0 ? undefined : "Vui lòng chọn ít nhất một phạm vi", apiError: undefined }));
    };

    const canSubmit = problemContext.trim() && scope.length > 0;

    const handleSubmit = async () => {
        setSubmitted(true);
        const errs: FormErrors = {};
        if (!problemContext.trim()) errs.problemContext = "Vui lòng mô tả vấn đề bạn đang gặp";
        if (scope.length === 0) errs.scope = "Vui lòng chọn ít nhất một phạm vi";
        if (!mentor?.id) errs.apiError = "Không tìm thấy thông tin cố vấn. Vui lòng thử lại.";

        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsSubmitting(true);

        try {
            await CreateMentorship({
                advisorId: mentor!.id!,
                challengeDescription: problemContext,
                specificQuestions: additionalNotes,
                expectedDuration: duration,
                expectedScope: scope.join(", ")
            });
            setIsSuccess(true);
            setTimeout(onClose, 2400);
        } catch (error: any) {
            console.error("Failed to create mentorship:", error);
            setErrors(prev => ({
                ...prev,
                apiError: error?.response?.data?.message || "Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau."
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !mentor) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative bg-white rounded-t-[24px] sm:rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.16)] w-full max-w-[540px] mx-0 sm:mx-4 flex flex-col max-h-[94vh] overflow-hidden">

                {/* Header */}
                <div className="px-6 pt-5 pb-4 flex-shrink-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative flex-shrink-0">
                                <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-[14px] object-cover ring-2 ring-white shadow-md" />
                                <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-amber-400 rounded-full flex items-center justify-center ring-2 ring-white">
                                    <BadgeCheck className="w-2.5 h-2.5 text-white" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10.5px] font-bold text-amber-500 uppercase tracking-[0.1em] mb-0.5">Gửi yêu cầu đến</p>
                                <p className="text-[15px] font-bold text-slate-900 leading-tight truncate">{mentor.name}</p>
                                {mentor.title && <p className="text-[12px] text-slate-400 truncate mt-0.5">{mentor.title}</p>}
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all flex-shrink-0 mt-0.5">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4 h-px bg-slate-100" />
                </div>

                {/* Body */}
                <div className="flex-1 px-6 pb-2 overflow-y-auto space-y-5">
                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                            <div className="w-[72px] h-[72px] bg-emerald-50 rounded-full flex items-center justify-center mb-5 ring-4 ring-emerald-50">
                                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                            </div>
                            <h3 className="text-[18px] font-bold text-slate-900">Yêu cầu đã được gửi!</h3>
                            <p className="text-[13px] text-slate-500 mt-2 max-w-[240px] leading-relaxed">
                                <span className="font-semibold text-slate-700">{mentor.name}</span> sẽ xem xét và phản hồi sớm nhất có thể.
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-[12px] font-medium text-amber-700">Chờ xem xét</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {errors.apiError && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-[13px] font-medium">
                                    {errors.apiError}
                                </div>
                            )}

                            {/* Mô tả vấn đề */}
                            <Field label="Mô tả vấn đề" sublabel="thách thức bạn đang gặp" required error={errors.problemContext} hint={`${problemContext.length}/500`}>
                                <textarea rows={4} maxLength={500} className={inputCls(!!errors.problemContext)}
                                    placeholder="Mô tả bối cảnh hiện tại, những gì bạn đã thử và khó khăn chính..."
                                    value={problemContext}
                                    onChange={e => {
                                        setProblemContext(e.target.value);
                                        if (submitted) setErrors(err => ({ ...err, problemContext: e.target.value.trim() ? undefined : "Vui lòng mô tả vấn đề bạn đang gặp", apiError: undefined }));
                                    }}
                                />
                            </Field>

                            {/* Ghi chú */}
                            <Field label="Câu hỏi / Ghi chú thêm" hint={`${additionalNotes.length}/300`}>
                                <textarea rows={2} maxLength={300} className={inputCls(false)}
                                    placeholder="Các câu hỏi cụ thể hoặc thông tin bổ sung cho cố vấn..."
                                    value={additionalNotes}
                                    onChange={e => setAdditionalNotes(e.target.value)}
                                />
                            </Field>

                            {/* Phạm vi */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[12.5px] font-semibold text-slate-700">Phạm vi hỗ trợ</span>
                                        <span className="text-amber-400 text-[13px] leading-none">•</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400">Chọn một hoặc nhiều</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {SCOPE_OPTIONS.map(opt => {
                                        const active = scope.includes(opt.value);
                                        return (
                                            <button key={opt.value} type="button" onClick={() => toggleScope(opt.value)}
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-150",
                                                    active
                                                        ? "bg-amber-50 border-amber-300 text-amber-800"
                                                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                                )}>
                                                {active && <Check className="w-3 h-3 text-amber-600" />}
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.scope && (
                                    <p className="flex items-center gap-1.5 text-[11.5px] text-red-500">
                                        <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                                        {errors.scope}
                                    </p>
                                )}
                            </div>



                            {/* Thời lượng */}
                            <div className="space-y-2">
                                <span className="text-[12.5px] font-semibold text-slate-700">Thời lượng dự kiến</span>
                                <div className="p-1 bg-slate-50 border border-slate-200 rounded-xl flex gap-1">
                                    {DURATIONS.map(d => (
                                        <button key={d.value} type="button" onClick={() => setDuration(d.value)}
                                            className={cn(
                                                "flex-1 flex items-center justify-center py-2 rounded-[9px] text-[12px] font-semibold transition-all",
                                                duration === d.value
                                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                                    : "text-slate-400 hover:text-slate-600"
                                            )}>
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>Phản hồi sớm nhất có thể</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={onClose}
                                title="Hủy"
                                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={cn(
                                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all",
                                    isSubmitting
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : canSubmit
                                            ? "bg-[#0f172a] text-white hover:bg-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.25)]"
                                            : "bg-slate-100 text-slate-400"
                                )}
                            >
                                {isSubmitting ? (
                                    <><span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />Đang gửi...</>
                                ) : (
                                    <><Send className="w-3.5 h-3.5" />Gửi yêu cầu</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
    return cn(
        "w-full bg-white border rounded-xl px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none transition-all resize-none leading-relaxed",
        hasError
            ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-300"
            : "border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-amber-100 focus:border-amber-300"
    );
}

function Field({
    label, sublabel, required, error, hint, children,
}: {
    label: string; sublabel?: string; required?: boolean;
    error?: string; hint?: string; children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1 min-h-[18px]">
                <span className="text-[12.5px] font-semibold text-slate-700">{label}</span>
                {sublabel && <span className="text-[12px] text-slate-400">· {sublabel}</span>}
                {required && <span className="text-amber-400 text-[13px] leading-none ml-0.5">•</span>}
                {hint && <span className="ml-auto text-[11px] text-slate-300 tabular-nums">{hint}</span>}
            </div>
            {children}
            {error && (
                <p className="flex items-center gap-1.5 text-[11.5px] text-red-500">
                    <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}
