/** Lưới tuần dùng chung — khớp app/advisor/availability (07:00–23:30, bước 30 phút). */
export const CALENDAR_TIMES: string[] = (() => {
  const times: string[] = [];
  for (let h = 7; h < 24; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }
  return times;
})();

export function formatLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const js = x.getDay();
  const diff = js === 0 ? -6 : 1 - js;
  x.setDate(x.getDate() + diff);
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function getWeekDates(weekStartMonday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartMonday, i));
}

export function busyKey(isoDate: string, time: string): string {
  return `${isoDate}-${time}`;
}

export function templateCellKey(day: number, time: string): string {
  return `${day}-${time}`;
}

export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Mẫu khung cố định hàng tuần → tập ô template (0=Thứ 2 … 6=CN). */
export function slotsToTemplateKeys(
  slots: { dayOfWeek: number; startTime: string; endTime: string }[],
): Set<string> {
  const selected = new Set<string>();
  slots.forEach(({ dayOfWeek, startTime, endTime }) => {
    let current = startTime;
    while (current < endTime) {
      selected.add(templateCellKey(dayOfWeek, current));
      current = addMinutes(current, 30);
    }
  });
  return selected;
}

/** UTC ISO intervals → ô YYYY-MM-DD-HH:mm theo giờ local của trình duyệt */
export function busyIntervalsToKeys(
  intervals: { startAt: string; endAt: string }[],
  times: readonly string[],
): Set<string> {
  const set = new Set<string>();
  for (const iv of intervals) {
    const end = new Date(iv.endAt);
    const start = new Date(iv.startAt);
    const rounded = new Date(start);
    rounded.setMinutes(rounded.getMinutes() < 30 ? 0 : 30, 0, 0);
    let cur = rounded;
    while (cur < end) {
      const t = `${String(cur.getHours()).padStart(2, "0")}:${String(cur.getMinutes()).padStart(2, "0")}`;
      const dStr = formatLocalISODate(cur);
      if (times.includes(t)) set.add(busyKey(dStr, t));
      cur = new Date(cur.getTime() + 30 * 60000);
    }
  }
  return set;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
