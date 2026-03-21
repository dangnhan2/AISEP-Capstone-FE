"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import {
  Calendar, CheckCircle2, Clock, Video,
  Globe, Info, BadgeCheck, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatVND = (n: number) => n.toLocaleString('vi-VN') + '₫';

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_SCHEDULE = {
  requestNo: "REQ-0002",
  advisor: {
    name: "Trần Thu Hà",
    title: "Investment Director · VCFund",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkeJpKLH89dtH6jy4p8OtegH6mL83JYobMLHvAQeMV-R-JV6ohyzLx5hQ2sZ387P-fztgR4sHa7EhmwJgbBTLxFVFskQsJI0Gohh4EB7LYt7pPNPIzVeMrNhIypAV8fJEz96dPqr4r8kUGO2XeJO1lDMfCEq0VHu2jl5963wBzE9lbl2WoMzmqdPjjGz-t_FAE1IFgbbvm8uMyf_V-UtsjIaqHKgVh5bF0DB5TQdrgyJ8kdtGF1397AobYsJYg8zAxOXwFyWtd32Q",
    rating: 5.0,
    isVerified: true,
  },
  topic: "Gọi vốn Series A – Pitch Deck & Term Sheet",
  proposedSlots: [
    { id: "a", date: "Thứ Năm", fullDate: "28 Tháng 3, 2024", time: "10:00 – 11:30 SA", timezone: "GMT+7", format: "Google Meet" },
    { id: "b", date: "Thứ Sáu", fullDate: "29 Tháng 3, 2024", time: "14:00 – 15:30 CH", timezone: "GMT+7", format: "Google Meet" },
    { id: "c", date: "Thứ Bảy", fullDate: "30 Tháng 3, 2024", time: "16:00 – 17:30 CH", timezone: "GMT+7", format: "Google Meet" },
  ],
  duration: "90 phút",
  sessionPrice: 3750000,
  hourlyRate: 2500000,
  advisorConfirmed: true,
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ConfirmSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleConfirm = () => {
    if (!selectedSlot) { setToast("Vui lòng chọn một khung giờ phù hợp."); return; }
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      router.push(`/startup/mentorship-requests/${id}/checkout`);
    }, 1500);
  };

  return (
    <StartupShell>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 bg-[#0f172a] text-white text-[13px] font-medium rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-[800px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">

        <>
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Calendar className="w-4.5 h-4.5 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-[18px] font-bold text-slate-900">Xác nhận lịch hẹn tư vấn</h1>
                  <p className="text-[12px] text-slate-400 mt-0.5">Chọn một trong các khung giờ mà cố vấn đề xuất</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Slot Picker */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                  <p className="text-[13px] font-bold text-slate-700 mb-4">Chọn khung giờ phù hợp</p>
                  <div className="space-y-3">
                    {MOCK_SCHEDULE.proposedSlots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                          selectedSlot === slot.id
                            ? "border-[#eec54e] bg-amber-50/50"
                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          selectedSlot === slot.id ? "border-[#eec54e] bg-[#eec54e]" : "border-slate-300"
                        )}>
                          {selectedSlot === slot.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[13px] font-bold text-slate-800">{slot.date}, {slot.fullDate}</p>
                          </div>
                          <div className="flex items-center gap-4 text-[12px] text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{slot.time}</span>
                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{slot.timezone}</span>
                            <span className="flex items-center gap-1"><Video className="w-3 h-3" />{slot.format}</span>
                          </div>
                        </div>
                        {selectedSlot === slot.id && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-[11px] font-bold">Đã chọn</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment required notice */}
                <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-amber-700 leading-relaxed">
                    Tất cả giờ theo <span className="font-semibold">GMT+7</span>. Sau khi chọn khung giờ, bạn sẽ được chuyển đến trang <span className="font-semibold">thanh toán bắt buộc</span>. Link tham gia phiên chỉ hiển thị sau khi thanh toán thành công.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedSlot || isConfirming}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold transition-all shadow-sm",
                      selectedSlot && !isConfirming
                        ? "bg-[#0f172a] text-white hover:bg-slate-700"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {isConfirming ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Xác nhận & Tiến hành thanh toán
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => router.push(`/startup/mentorship-requests/${id}`)}
                    className="px-5 py-3 border border-slate-200 bg-white text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-50 transition-all"
                  >
                    Về chi tiết yêu cầu
                  </button>
                </div>
              </div>

              {/* Sidebar: Summary */}
              <div className="space-y-4">
                {/* Advisor */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Cố vấn</p>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={MOCK_SCHEDULE.advisor.avatar} alt={MOCK_SCHEDULE.advisor.name} className="w-11 h-11 rounded-xl object-cover border border-slate-100" />
                      {MOCK_SCHEDULE.advisor.isVerified && (
                        <BadgeCheck className="absolute -bottom-1 -right-1 w-4.5 h-4.5 text-amber-500 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">{MOCK_SCHEDULE.advisor.name}</p>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{MOCK_SCHEDULE.advisor.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-bold text-slate-600">{MOCK_SCHEDULE.advisor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmation states */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Trạng thái xác nhận</p>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-slate-600">Bạn</span>
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        Chờ xác nhận
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-slate-600">Cố vấn</span>
                      <span className={cn("flex items-center gap-1.5 text-[12px] font-semibold", MOCK_SCHEDULE.advisorConfirmed ? "text-green-600" : "text-amber-600")}>
                        {MOCK_SCHEDULE.advisorConfirmed
                          ? <><CheckCircle2 className="w-3.5 h-3.5" />Đã xác nhận</>
                          : <><Clock className="w-3.5 h-3.5" />Chờ xác nhận</>
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session info */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Thông tin phiên</p>
                  <div className="space-y-2 text-[12px]">
                    <div className="flex justify-between"><span className="text-slate-500">Chủ đề</span><span className="font-semibold text-slate-700 text-right max-w-[120px] truncate">{MOCK_SCHEDULE.topic}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Thời lượng</span><span className="font-semibold text-slate-700">{MOCK_SCHEDULE.duration}</span></div>
                  </div>
                </div>

                {/* Payment preview */}
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                  <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-3">Thanh toán sau khi xác nhận</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-[28px] font-black text-amber-700 leading-none">{formatVND(MOCK_SCHEDULE.sessionPrice)}</span>
                  </div>
                  <p className="text-[11px] text-amber-600/80">{MOCK_SCHEDULE.duration} · {formatVND(MOCK_SCHEDULE.hourlyRate)}/giờ</p>
                  <div className="flex items-center gap-1.5 mt-3 text-[11px] text-amber-700 font-medium">
                    <Info className="w-3 h-3 flex-shrink-0" />
                    Tiền được giữ bởi AISEP cho đến khi phiên hoàn tất.
                  </div>
                </div>
              </div>
            </div>
          </>
      </div>
    </StartupShell>
  );
}
