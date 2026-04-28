"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { GetAdvisorWeekCalendar } from "@/services/startup/startup-mentorship.api";
import type { IAdvisorTimeSlot, IAdvisorWeekCalendar } from "@/types/startup-mentorship";
import {
  CALENDAR_TIMES,
  busyIntervalsToKeys,
  busyKey,
  formatLocalISODate,
  getWeekDates,
  isSameLocalDay,
  slotsToTemplateKeys,
  startOfWeekMonday,
  templateCellKey,
} from "@/lib/weekly-calendar-shared";

const DAY_LABELS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

function unwrapWeekCalendar(resBody: unknown): IAdvisorWeekCalendar | null {
  if (!resBody || typeof resBody !== "object") return null;
  const root = resBody as Record<string, unknown>;
  const inner = root.data as Record<string, unknown> | undefined;
  const src = inner ?? root;
  const weekly =
    (src.weeklyTimeSlots as IAdvisorTimeSlot[] | undefined) ??
    (src.WeeklyTimeSlots as IAdvisorTimeSlot[] | undefined) ??
    [];
  const busy =
    (src.busyIntervals as IAdvisorWeekCalendar["busyIntervals"] | undefined) ??
    (src.BusyIntervals as IAdvisorWeekCalendar["busyIntervals"] | undefined) ??
    [];
  return { weeklyTimeSlots: weekly, busyIntervals: busy };
}

export function AdvisorWeekCalendarDialog({
  open,
  onOpenChange,
  advisorId,
  advisorName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advisorId: number;
  advisorName: string;
}) {
  const [weekStartMonday, setWeekStartMonday] = useState(() => startOfWeekMonday(new Date()));
  const [loading, setLoading] = useState(false);
  const [templateSelected, setTemplateSelected] = useState<Set<string>>(new Set());
  const [busyCells, setBusyCells] = useState<Set<string>>(new Set());
  const today = new Date();

  const weekDates = getWeekDates(weekStartMonday);
  const shiftWeek = useCallback((delta: number) => {
    setWeekStartMonday((prev) => {
      const n = new Date(prev);
      n.setDate(n.getDate() + delta * 7);
      return n;
    });
  }, []);

  const goThisWeek = useCallback(() => {
    setWeekStartMonday(startOfWeekMonday(new Date()));
  }, []);

  const weekRangeLabel = (() => {
    const a = weekDates[0];
    const b = weekDates[6];
    const opts: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return `${a.toLocaleDateString("vi-VN", opts)} – ${b.toLocaleDateString("vi-VN", opts)}`;
  })();

  const isCurrentWeek = isSameLocalDay(weekStartMonday, startOfWeekMonday(new Date()));

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const weekStr = formatLocalISODate(weekStartMonday);
        const res = await GetAdvisorWeekCalendar(advisorId, weekStr);
        const parsed = unwrapWeekCalendar(res.data);
        if (cancelled || !parsed) {
          if (!cancelled) {
            setTemplateSelected(new Set());
            setBusyCells(new Set());
          }
          return;
        }
        const tmpl = slotsToTemplateKeys(parsed.weeklyTimeSlots ?? []);
        const busy = busyIntervalsToKeys(parsed.busyIntervals ?? [], CALENDAR_TIMES);
        if (!cancelled) {
          setTemplateSelected(tmpl);
          setBusyCells(busy);
        }
      } catch {
        if (!cancelled) {
          setTemplateSelected(new Set());
          setBusyCells(new Set());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [open, advisorId, weekStartMonday]);

  const [hoverBusy, setHoverBusy] = useState<{ x: number; y: number } | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-5xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl border-slate-200">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <DialogTitle className="text-[18px] font-bold text-slate-900">
            Lịch trong tuần · {advisorName}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-slate-500 leading-relaxed">
            Khung màu xanh là giờ cố vấn thường mở đặt lịch (lặp lại mỗi tuần).
            Khung màu cam là thời gian đã có hẹn — chỉ hiển thị trạng thái bận, không tiết lộ chi tiết
            buổi họp với đối tượng khác.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => shiftWeek(-1)}
            disabled={loading}
            className="rounded-xl shrink-0"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Tuần trước
          </Button>
          <div className="text-center flex-1 min-w-0">
            <p className="text-[14px] font-bold text-slate-900">{weekRangeLabel}</p>
          </div>
          <div className="flex gap-2 justify-end shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goThisWeek}
              disabled={loading || isCurrentWeek}
              className="rounded-xl"
            >
              Hôm nay
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => shiftWeek(1)}
              disabled={loading}
              className="rounded-xl"
            >
              Tuần sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto px-2 sm:px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-auto max-h-[58vh] rounded-xl border border-slate-200 mt-4">
                <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "52px" }} />
                    {DAY_LABELS.map((_, i) => (
                      <col key={i} />
                    ))}
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-white shadow-sm">
                    <tr>
                      <th className="border-b border-r border-slate-100 bg-white" />
                      {DAY_LABELS.map((label, i) => {
                        const isTodayCol = isSameLocalDay(weekDates[i], today);
                        return (
                          <th
                            key={`head-${i}`}
                            className={`border-b border-r border-slate-100 py-2 text-center ${
                              isTodayCol ? "bg-indigo-50/90" : "bg-white"
                            }`}
                          >
                            <p className="text-[11px] font-semibold text-slate-700">{label}</p>
                            <p className="text-[10px] font-semibold text-slate-500 tabular-nums">
                              {weekDates[i].toLocaleDateString("vi-VN", {
                                day: "numeric",
                                month: "numeric",
                              })}
                            </p>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {CALENDAR_TIMES.map((time) => {
                      const isHour = time.endsWith(":00");
                      return (
                        <tr key={time}>
                          <td
                            className="border-r border-slate-100 text-right align-top pr-1"
                            style={{ height: "22px" }}
                          >
                            {isHour && (
                              <span className="text-[9px] text-slate-400 font-medium relative -top-2 leading-none">
                                {time}
                              </span>
                            )}
                          </td>
                          {Array.from({ length: 7 }, (_, day) => {
                            const iso = formatLocalISODate(weekDates[day]);
                            const tk = templateCellKey(day, time);
                            const bk = busyKey(iso, time);
                            const inTemplate = templateSelected.has(tk);
                            const busy = busyCells.has(bk);
                            const isTodayCol = isSameLocalDay(weekDates[day], today);

                            let bg = "bg-white";
                            if (busy) {
                              bg = "bg-amber-400 hover:bg-amber-500";
                            } else if (inTemplate) {
                              bg = "bg-indigo-500";
                            } else if (isTodayCol) {
                              bg = "bg-indigo-50/40";
                            }

                            return (
                              <td
                                key={day}
                                className={`border-r border-slate-100 transition-colors ${isHour ? "border-t border-slate-200" : "border-t border-slate-100"} ${bg}`}
                                style={{ height: "22px" }}
                                onMouseEnter={(e) => {
                                  if (busy) {
                                    setHoverBusy({ x: e.clientX, y: e.clientY });
                                  } else {
                                    setHoverBusy(null);
                                  }
                                }}
                                onMouseLeave={() => setHoverBusy(null)}
                              />
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-4 px-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                  Khung thường nhận đặt lịch
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-400" />
                  Đã bận (không hiển thị chi tiết)
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm border border-slate-200 bg-white" />
                  Không trong khung đặt
                </div>
              </div>
            </>
          )}
        </div>

        {hoverBusy && (
          <div
            className="fixed z-[100] pointer-events-none bg-[#0f172a] text-white text-[12px] rounded-xl px-3 py-2 shadow-xl"
            style={{ left: hoverBusy.x + 12, top: hoverBusy.y - 8 }}
          >
            <p className="font-semibold">Cố vấn đang bận</p>
            <p className="text-white/70 text-[11px] mt-0.5">Khung giờ đã có lịch</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
