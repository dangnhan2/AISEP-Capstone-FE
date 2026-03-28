"use client";

import { AdvisorShell } from "@/components/advisor/advisor-shell";
import {
  Calendar,
  Plus,
  Trash2,
  Save,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GetAvailableSlots, CreateWeeklyScheduleBulk, DeleteWeeklySchedule } from "@/services/mentorships/mentorship.api";

const DAYS = [
  "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
];

const ENG_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const getDayIndex = (dayStr: string) => Math.max(0, ENG_DAYS.findIndex((d) => d.toLowerCase() === dayStr.toLowerCase()));

export default function AdvisorAvailabilityPage() {
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const res = await GetAvailableSlots({ page: 1, pageSize: 100 });
      const apiSlots: any[] = Array.isArray(res.data) ? res.data : (res.data as any)?.data || [];
      const mapped: ISlot[] = apiSlots.map((s: any) => {
        let st = s.startTime || "09:00";
        if (st.includes("T")) st = st.split("T")[1];
        st = st.substring(0, 5);

        let et = s.endTime || "10:00";
        if (et.includes("T")) et = et.split("T")[1];
        et = et.substring(0, 5);

        return {
          slotID: s.slotID || -Math.floor(Math.random() * 1000000),
          advisorID: s.advisorID || 0,
          startTime: st,
          endTime: et,
          isBooked: s.isBooked || false,
          bookedSessionID: s.bookedSessionID || 0,
          notes: s.notes || "Sunday",
          createdAt: s.createdAt || new Date().toISOString(),
          updatedAt: s.updatedAt || new Date().toISOString()
        } as ISlot;
      });
      setSlots(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải lịch rảnh");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = (dayIdx: number) => {
    const newSlot: ISlot = {
      slotID: -Math.floor(Math.random() * 1000000),
      advisorID: 0,
      startTime: "09:00",
      endTime: "10:00",
      isBooked: false,
      bookedSessionID: 0,
      notes: ENG_DAYS[dayIdx] || "Sunday",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSlots([...slots, newSlot]);
  };

  const handleRemoveSlot = async (id: number) => {
    const slotToRemove = slots.find(s => s.slotID === id);
    if (slotToRemove && slotToRemove.slotID > 0) {
      try {
        await DeleteWeeklySchedule(slotToRemove.slotID);
        toast.success("Đã xóa khung giờ");
      } catch (err) {
        toast.error("Xóa khung giờ thất bại");
        return;
      }
    }
    setSlots(slots.filter(s => s.slotID !== id));
  };

  const handleUpdateSlot = (id: number, updates: Partial<ISlot>) => {
    setSlots(slots.map(s => s.slotID === id ? { ...s, ...updates } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payloadSlots = slots.map(s => ({
        startTime: `2026-04-01T${s.startTime.substring(0, 5)}:00Z`,
        endTime: `2026-04-01T${s.endTime.substring(0, 5)}:00Z`,
        notes: s.notes,
      }));

      await CreateWeeklyScheduleBulk({ slots: payloadSlots as any });
      toast.success("Cập nhật lịch rảnh thành công");
      fetchSlots();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Lỗi khi lưu lịch rảnh");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdvisorShell>
      <div className="max-w-5xl mx-auto space-y-7 animate-in fade-in duration-500">

        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-white shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Thiết lập Lịch rảnh</h1>
                <p className="text-[13px] text-slate-500 mt-1 max-w-md">
                  Quản lý các khoảng thời gian bạn sẵn sàng để tư vấn. Startup sẽ dựa vào đây để đề xuất lịch họp.
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f172a] text-white text-[13px] font-medium hover:bg-[#1e293b] transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-100/60 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[12px] text-amber-700 leading-relaxed">
              Các khung giờ này sẽ được lặp lại hàng tuần. Bạn có thể tạm thời vô hiệu hóa hoặc xóa các khung giờ không còn phù hợp. Múi giờ mặc định của bạn là <span className="font-bold">Asia/Ho_Chi_Minh (GMT+7)</span>.
            </p>
          </div>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#0f172a] animate-spin mb-4" />
              <p className="text-[14px] text-slate-500 font-medium">Đang tải lịch rảnh...</p>
            </div>
          ) : DAYS.map((dayName, idx) => {
            const daySlots = slots.filter(s => getDayIndex(s.notes) === idx).sort((a, b) => a.startTime.localeCompare(b.startTime));
            return (
              <div key={idx} className="group bg-white rounded-2xl border border-slate-200/80 hover:border-[#eec54e]/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-5 md:p-6">
                  {/* Day Indicator */}
                  <div className="w-full md:w-40 shrink-0">
                    <h3 className={cn(
                      "text-[15px] font-bold tracking-tight",
                      idx === 0 || idx === 6 ? "text-slate-400" : "text-slate-800"
                    )}>
                      {dayName}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">
                      {daySlots.length} khoảng giờ
                    </p>
                  </div>

                  {/* Slots Area */}
                  <div className="flex-1 flex flex-wrap gap-3">
                    {daySlots.map(slot => (
                      <div key={slot.slotID} className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 group/slot hover:bg-white hover:border-slate-200 transition-all focus-within:ring-2 focus-within:ring-[#eec54e]/20">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => handleUpdateSlot(slot.slotID, { startTime: e.target.value })}
                            className="bg-transparent text-[13px] font-semibold text-slate-700 focus:outline-none focus:text-[#0f172a]"
                          />
                          <span className="text-slate-300 text-[12px]">—</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => handleUpdateSlot(slot.slotID, { endTime: e.target.value })}
                            className="bg-transparent text-[13px] font-semibold text-slate-700 focus:outline-none focus:text-[#0f172a]"
                          />
                        </div>
                        <div className="w-px h-4 bg-slate-200 mx-1" />
                        <button
                          onClick={() => handleRemoveSlot(slot.slotID)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/slot:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddSlot(idx)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-[#eec54e] hover:text-[#0f172a] hover:bg-[#eec54e]/5 text-[12px] font-medium transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm khung giờ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pb-10 pt-4 flex items-center justify-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[12px] text-slate-400 italic">Hệ thống sẽ đồng bộ lịch rảnh của bạn với ứng dụng ngay lập tức sau khi lưu.</p>
        </div>
      </div>
    </AdvisorShell>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={cn("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
