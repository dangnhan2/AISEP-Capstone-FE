"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Calendar,
  ArrowRight,
  Loader2,
  XCircle,
  RotateCcw,
} from "lucide-react";

function ResultContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const ref = searchParams.get("ref") ?? "";
  const isSuccess = status === "success";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = `mentorship_paid_${id}`;

    if (isSuccess) {
      localStorage.setItem(key, "true");
    } else {
      localStorage.removeItem(key);
    }
  }, [id, isSuccess]);

  // ── Failed / cancelled payment ──
  if (!isSuccess) {
    return (
      <div className="max-w-[540px] mx-auto pb-20 pt-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-8 pt-10 pb-8 text-center bg-gradient-to-b from-red-50 to-white">
            <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-5 bg-red-100 border-red-200">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-[22px] font-black mb-2 text-red-800">
              Thanh toán không thành công
            </h1>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              {status === "CANCELLED"
                ? "Bạn đã hủy giao dịch. Không có khoản nào bị trừ."
                : "Đã xảy ra lỗi từ cổng thanh toán. Không có khoản nào bị trừ từ tài khoản của bạn."}
            </p>
          </div>

          <div className="px-8 pb-8 space-y-4">
            <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-100 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-700 leading-relaxed">
                Nếu tài khoản của bạn đã bị trừ tiền nhưng không nhận được xác nhận, vui lòng liên hệ hỗ trợ AISEP.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => router.push(`/startup/mentorship-requests/${id}/checkout`)}
                className="flex items-center justify-center gap-2 py-3.5 bg-[#0f172a] text-white rounded-xl text-[13px] font-semibold hover:bg-slate-700 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Thử thanh toán lại
              </button>
              <button
                onClick={() => router.push(`/startup/mentorship-requests/${id}`)}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 bg-white text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-50 transition-all"
              >
                Quay về chi tiết yêu cầu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Successful payment ──
  return (
    <div className="max-w-[540px] mx-auto pb-20 pt-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-8 pt-10 pb-8 text-center bg-gradient-to-b from-emerald-50 to-white">
          <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-5 bg-emerald-100 border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-[22px] font-black mb-2 text-emerald-800">
            Thanh toán thành công!
          </h1>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            Khoản thanh toán của bạn đã được xử lý thành công và đang được giữ bởi AISEP.
          </p>
        </div>

        <div className="px-8 pb-8 space-y-4">
          {ref && (
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="text-[12px] text-slate-500">Mã giao dịch</span>
              </div>
              <span className="font-mono text-[12px] font-semibold text-slate-700">{ref}</span>
            </div>
          )}

          <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-100 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-700 leading-relaxed">
              Tiền của bạn đang được <span className="font-semibold">giữ an toàn bởi AISEP</span>. Khoản thanh toán chỉ chuyển cho cố vấn sau khi phiên tư vấn hoàn tất.
            </p>
          </div>

          <div className="px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Bước tiếp theo</p>
            <ul className="space-y-2">
              {[
                "Kiểm tra email để nhận xác nhận và link tham gia phiên",
                "Tham gia đúng giờ theo lịch đã xác nhận",
                "Sau phiên, xác nhận để giải phóng thanh toán cho cố vấn",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-[12px] text-slate-600 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={() => router.push(`/startup/mentorship-requests/${id}`)}
              className="flex items-center justify-center gap-2 py-3.5 bg-[#0f172a] text-white rounded-xl text-[13px] font-semibold hover:bg-slate-700 transition-all"
            >
              Xem chi tiết yêu cầu
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/startup/payments")}
              className="flex items-center justify-center gap-2 py-3 border border-slate-200 bg-white text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-50 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              Lịch sử thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="max-w-[540px] mx-auto pb-20 pt-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    </div>
  );
}

export default function CheckoutResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <StartupShell>
      <Suspense fallback={<ResultSkeleton />}>
        <ResultContent id={id} />
      </Suspense>
    </StartupShell>
  );
}
