"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Send, CheckCircle2, BadgeCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CreateConnection } from "@/services/connection/connection.api";

interface InvestorConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  investor: {
    name: string;
    logo: string;
    type: string;
    investorId: number;
  } | null;
  onSuccess?: (connectionId: number) => void;
}

const CONNECTION_GOALS = [
  { value: "seed", label: "Gọi vốn Seed / Series A" },
  { value: "networking", label: "Tìm kiếm đối tác chiến lược" },
  { value: "advice", label: "Tham khảo ý kiến chuyên gia" },
];

export function InvestorConnectionModal({
  isOpen,
  onClose,
  investor,
  onSuccess,
}: InvestorConnectionModalProps) {
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ goal?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setGoal("");
      setMessage("");
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!investor) return;

    setSubmitted(true);
    const nextErrors: { goal?: string; message?: string } = {};
    if (!goal) nextErrors.goal = "Vui lòng chọn mục tiêu kết nối";
    if (!message.trim()) nextErrors.message = "Vui lòng nhập lời nhắn giới thiệu";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const payload: ICreateConnection = {
        investorID: investor.investorId,
        personalizedMessage: `[${goal}] ${message.trim()}`,
      };
      const res = await CreateConnection(payload);

      if (res.success || res.isSuccess) {
        setIsSuccess(true);
        if (res.data?.connectionID) onSuccess?.(res.data.connectionID);
        setTimeout(() => onClose(), 2200);
      } else {
        toast.error(res.message || "Gửi lời mời thất bại. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      const messageText =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Đã xảy ra lỗi khi gửi lời mời. Vui lòng thử lại.";
      toast.error(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !investor) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative mx-0 flex max-h-[94vh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:mx-4 sm:rounded-[20px]">
        <div className="flex-shrink-0 px-6 pb-4 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="relative flex-shrink-0">
                <div className="relative h-12 w-12 overflow-hidden rounded-[14px] ring-2 ring-white shadow-md">
                  {investor.logo ? (
                    <Image
                      src={investor.logo}
                      alt={investor.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-[13px] font-bold uppercase text-slate-600">
                      {investor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-amber-400 ring-2 ring-white">
                  <BadgeCheck className="h-2.5 w-2.5 text-white" />
                </div>
              </div>

              <div className="min-w-0">
                <p className="mb-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-amber-500">
                  Gửi lời mời đến
                </p>
                <p className="truncate text-[15px] font-bold leading-tight text-slate-900">
                  {investor.name}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-slate-400">
                  {investor.type}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 h-px bg-slate-100" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2">
          {isSuccess ? (
            <div className="animate-in zoom-in-95 flex flex-col items-center py-14 text-center duration-300">
              <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-50">
                <CheckCircle2 className="h-9 w-9 text-emerald-500" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900">Lời mời đã được gửi</h3>
              <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-700">{investor.name}</span> sẽ nhận được
                yêu cầu kết nối của startup bạn trong hệ thống.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-100/80 bg-amber-50 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[12px] font-medium text-amber-700">Chờ phản hồi</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <Field
                label="Mục tiêu kết nối"
                required
                error={errors.goal}
                hint={goal ? "Đã chọn mục tiêu kết nối" : undefined}
              >
                <select
                  value={goal}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    if (submitted) {
                      setErrors((current) => ({
                        ...current,
                        goal: e.target.value ? undefined : "Vui lòng chọn mục tiêu kết nối",
                      }));
                    }
                  }}
                  className={inputCls(Boolean(errors.goal))}
                >
                  <option value="">Chọn mục tiêu kết nối</option>
                  {CONNECTION_GOALS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Lời nhắn giới thiệu"
                sublabel="lý do bạn muốn kết nối"
                required
                error={errors.message}
                hint={`${message.length}/500`}
              >
                <textarea
                  rows={4}
                  maxLength={500}
                  className={inputCls(Boolean(errors.message))}
                  placeholder="Hãy viết một thông điệp ngắn gọn, nêu rõ startup của bạn đang giải quyết vấn đề gì và vì sao cuộc trao đổi này đáng để nhà đầu tư dành thời gian."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (submitted) {
                      setErrors((current) => ({
                        ...current,
                        message: e.target.value.trim() ? undefined : "Vui lòng nhập lời nhắn giới thiệu",
                      }));
                    }
                  }}
                />
              </Field>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 flex-shrink-0 text-amber-500" />
                  <p className="text-[12px] text-amber-700">
                    Lời mời này sẽ được gửi kèm hồ sơ startup hiện tại của bạn tới nhà đầu tư.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isSuccess && (
          <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Nhà đầu tư sẽ thấy hồ sơ startup mới nhất của bạn
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  disabled={!goal || !message.trim() || isSubmitting}
                  onClick={handleSubmit}
                  className={cn(
                    "inline-flex min-w-[148px] items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-medium transition-colors shadow-sm",
                    !goal || !message.trim() || isSubmitting
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                  )}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Gửi lời mời
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  sublabel,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  sublabel?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[12.5px] font-semibold text-slate-700">{label}</span>
          {sublabel && <span className="text-[12px] text-slate-400">· {sublabel}</span>}
          {required && <span className="text-[13px] leading-none text-amber-400">•</span>}
        </div>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>

      {children}

      {error && (
        <p className="flex items-center gap-1.5 text-[11.5px] text-red-500">
          <span className="h-1 w-1 flex-shrink-0 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-xl border px-4 py-3 text-[13px] text-slate-700 outline-none transition-all placeholder:text-slate-300",
    "bg-white border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-amber-100 focus:border-amber-300",
    hasError && "border-red-300 focus:border-red-300 focus:ring-red-100"
  );
}
