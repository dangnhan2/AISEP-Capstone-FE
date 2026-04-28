"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Calendar,
  ArrowRight,
  Loader2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { SyncPayment } from "@/services/payment/payment.api";

function ResultContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Lấy ID từ URL params (Next.js 15+ dynamic route)
  const id = params?.id as string;
  
  // Lấy các query params từ PayOS/Backend
  const status = searchParams.get("status");
  const code = searchParams.get("code");
  const orderCode = searchParams.get("orderCode");
  const paymentId = searchParams.get("id");
  
  const ref = orderCode || paymentId || "N/A";
  
  const normalizedStatus = (status ?? "").trim().toUpperCase();
  
  // Logic kiểm tra thành công/thất bại dựa trên cả code và status
  const isSuccess = (code === "00" || normalizedStatus === "PAID" || normalizedStatus === "SUCCESS");
  const isCancelled = (searchParams.get("cancel") === "true" || normalizedStatus === "CANCELLED");

  useEffect(() => {
    if (isSuccess && orderCode) {
      console.log("Triggering payment sync for order:", orderCode, "mentorship:", id);
      SyncPayment(orderCode, id)
        .then(response => {
          const res = response as any;
          if (res.success) {
            toast.success("Đồng bộ thanh toán thành công!");
          } else {
            toast.error(`Đồng bộ thất bại: ${res.message || "Lỗi không xác định"}`);
          }
        })
        .catch(err => {
          console.error("Failed to sync payment status:", err);
          toast.error("Không thể kết nối với server để đồng bộ thanh toán.");
        });
    }
  }, [isSuccess, orderCode, id]);

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <AlertCircle className="w-10 h-10" />
        <p className="font-bold">Lỗi: Không tìm thấy ID yêu cầu tư vấn</p>
      </div>
    );
  }

  return (
    <div className="max-w-[540px] mx-auto pb-20 pt-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden">
        {/* Header Section */}
        <div className={`px-8 pt-12 pb-10 text-center bg-gradient-to-b ${isSuccess ? 'from-emerald-50 to-white' : 'from-rose-50 to-white'}`}>
          <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-emerald-100 border-emerald-200' : 'bg-rose-100 border-rose-200'}`}>
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            ) : (
              <XCircle className="w-10 h-10 text-rose-500" />
            )}
          </div>
          <h1 className={`text-[22px] font-black mb-2 ${isSuccess ? 'text-emerald-800' : 'text-rose-800'}`}>
            {isSuccess ? "Thanh toán thành công!" : isCancelled ? "Đã hủy thanh toán" : "Thanh toán thất bại"}
          </h1>
          <p className="text-[13px] text-slate-500 leading-relaxed px-4">
            {isSuccess
              ? "Khoản thanh toán của bạn đã được ghi nhận và đang được bảo vệ bởi AISEP."
              : "Giao dịch không thành công. Nếu tiền đã bị trừ, vui lòng liên hệ hỗ trợ."}
          </p>
        </div>

        {/* Info Section */}
        <div className="px-8 pb-10 space-y-4">
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[12px] font-bold text-slate-500">Mã đơn hàng</span>
            <span className="font-mono text-[12px] font-black text-slate-800">{ref}</span>
          </div>

          {isSuccess && (
            <div className="flex items-start gap-3.5 px-5 py-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-800 leading-relaxed">
                Tiền thanh toán sẽ được <span className="font-bold">giữ bởi AISEP</span> cho đến khi buổi tư vấn hoàn tất.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => router.push(`/startup/mentorship-requests/${id}`)}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold transition-all shadow-lg active:scale-[0.98] ${
                isSuccess 
                  ? 'bg-[#0f172a] text-white hover:bg-slate-800 shadow-slate-200' 
                  : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100'
              }`}
            >
              {isSuccess ? "Xem chi tiết yêu cầu" : "Thử lại thanh toán"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/startup/payments")}
              className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 bg-white text-slate-600 rounded-2xl text-[13px] font-bold hover:bg-slate-50 transition-all"
            >
              <Calendar className="w-4 h-4" />
              Lịch sử giao dịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <StartupShell>
      <Suspense fallback={<div className="flex items-center justify-center py-40"><Loader2 className="w-8 h-8 animate-spin text-amber-400" /></div>}>
        <ResultContent />
      </Suspense>
    </StartupShell>
  );
}
