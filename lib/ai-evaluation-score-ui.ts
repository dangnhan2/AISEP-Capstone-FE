/** Hiển thị điểm 0–100 từ BE; `null` = chưa có / không áp dụng (API trả null). */

export function formatScore100(v: number | null | undefined): string {
  if (v == null || (typeof v === "number" && Number.isNaN(v))) return "—";
  return String(Math.round(v));
}

export function scoreChipColorClass(v: number | null | undefined): string {
  if (v == null) return "text-slate-400";
  if (v >= 75) return "text-emerald-600";
  if (v >= 50) return "text-amber-600";
  return "text-red-500";
}

export function scoreRingVisual(score: number | null | undefined): {
  pct: number;
  stroke: string;
  label: string;
} {
  if (score == null || Number.isNaN(Number(score))) {
    return { pct: 0, stroke: "#94a3b8", label: "—" };
  }
  const n = Math.min(100, Math.max(0, Number(score)));
  const stroke = n >= 75 ? "#10b981" : n >= 50 ? "#f59e0b" : "#ef4444";
  return { pct: n / 100, stroke, label: String(Math.round(n)) };
}
