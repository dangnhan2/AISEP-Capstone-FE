"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import {
  CreditCard, Lock, ShieldCheck, BadgeCheck, Star,
  ChevronRight, Info, CheckCircle2, AlertCircle,
  Calendar, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatVND = (n: number) => n.toLocaleString('vi-VN') + '₫';

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_CHECKOUT = {
  requestNo: "REQ-0003",
  sessionPrice: 3000000,
  advisor: {
    name: "Phạm Thành Long",
    title: "CTO & Co-founder · AI-Soft",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd7t5ciDWV2eTaJsfniBll5lOH1FpM75D-rNgvvVbqucB9qLvuvCqdD2n7NevngnBF0iNuRrvyppt6TSVePvhTgOoUFPXs3COh1SFpjFFfpRM7AvqpVQYWIKMeh8ZaAHBQXX7A9LfSgc9hJLF86zECFTAuBW7cVPKthlob2LHXSFNJoAt5LewaefZBVBDzh253xnffFoI4o3adtsf5g77DpJi4MsoGYiv14LMA-ivJZaM5n2tz_QhJaAEUCzsxPuiFm3f6b9lC-GA",
    rating: 4.8,
    isVerified: true,
  },
  topic: "Xây dựng đội kỹ thuật cho giai đoạn scale",
  agreedTime: {
    date: "Thứ Ba, 26 Tháng 3, 2024",
    time: "14:00 – 15:00 CH (GMT+7)",
  },
  duration: "60 phút",
  hourlyRate: 3000000,
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCardNumber(formatCardNumber(e.target.value));
    if (raw.startsWith("4")) setCardType("visa");
    else if (raw.startsWith("5")) setCardType("mastercard");
    else setCardType(null);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, "").length < 16) errors.cardNumber = "Số thẻ không hợp lệ.";
    if (!cardName.trim()) errors.cardName = "Vui lòng nhập tên chủ thẻ.";
    if (expiry.length < 5) errors.expiry = "Ngày hết hạn không hợp lệ.";
    if (cvv.length < 3) errors.cvv = "CVV không hợp lệ.";
    return errors;
  };

  const handlePay = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setIsProcessing(true);
    // Simulate a payment — 80% success for demo
    setTimeout(() => {
      setIsProcessing(false);
      const success = Math.random() > 0.2;
      router.push(
        `/startup/mentorship-requests/${id}/checkout/result?status=${success ? "success" : "failed"}&ref=PAY-${Date.now().toString().slice(-8)}`
      );
    }, 2200);
  };

  const data = MOCK_CHECKOUT;

  return (
    <StartupShell>
      <div className="max-w-[960px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">

        {/* Header */}
        <div className="flex items-center gap-2 text-[13px] text-slate-400">
          <button onClick={() => router.push(`/startup/mentorship-requests/${id}`)} className="hover:text-slate-700 transition-colors">
            {data.requestNo}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 font-semibold">Thanh toán</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: Payment Form */}
          <div className="lg:col-span-7 space-y-5">

            {/* Secure badge */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[12px] font-semibold text-emerald-700">Thanh toán được mã hoá và bảo mật bởi AISEP</span>
            </div>

            {/* Card Form */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-amber-500" />
                  </div>
                  <h2 className="text-[16px] font-bold text-slate-900">Thông tin thẻ thanh toán</h2>
                </div>
                {/* Card logos */}
                <div className="flex items-center gap-2">
                  <div className={cn("px-2.5 py-1 rounded-md border text-[10px] font-black tracking-wide transition-all",
                    cardType === "visa" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-400 border-slate-200"
                  )}>VISA</div>
                  <div className={cn("px-2 py-1 rounded-md border text-[10px] font-black tracking-wide transition-all",
                    cardType === "mastercard" ? "bg-orange-500 text-white border-orange-500" : "bg-slate-50 text-slate-400 border-slate-200"
                  )}>MC</div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Số thẻ</label>
                  <div className={cn(
                    "relative flex items-center border rounded-xl overflow-hidden transition-all",
                    fieldErrors.cardNumber ? "border-red-300 bg-red-50" : "border-slate-200 bg-white focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100"
                  )}>
                    <CreditCard className="w-4 h-4 text-slate-300 ml-3.5 flex-shrink-0" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="flex-1 px-3 py-3 text-[14px] font-mono text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
                    />
                  </div>
                  {fieldErrors.cardNumber && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.cardNumber}</p>}
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tên chủ thẻ</label>
                  <input
                    type="text"
                    placeholder="NGUYEN VAN A"
                    value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                    className={cn(
                      "w-full px-4 py-3 text-[14px] text-slate-800 border rounded-xl outline-none transition-all uppercase",
                      fieldErrors.cardName
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    )}
                  />
                  {fieldErrors.cardName && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.cardName}</p>}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ngày hết hạn</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      className={cn(
                        "w-full px-4 py-3 text-[14px] font-mono text-slate-800 border rounded-xl outline-none transition-all",
                        fieldErrors.expiry
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                      )}
                    />
                    {fieldErrors.expiry && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      <span className="flex items-center gap-1">CVV <Info className="w-3 h-3 text-slate-300" /></span>
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="•••"
                      maxLength={4}
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className={cn(
                        "w-full px-4 py-3 text-[14px] font-mono text-slate-800 border rounded-xl outline-none transition-all",
                        fieldErrors.cvv
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                      )}
                    />
                    {fieldErrors.cvv && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.cvv}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow Note */}
            <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-100 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-700 leading-relaxed">
                Khoản thanh toán sẽ được <span className="font-semibold">giữ an toàn bởi AISEP (escrow)</span> và chỉ giải phóng cho cố vấn sau khi phiên tư vấn hoàn tất và bạn xác nhận.
              </p>
            </div>

            {/* Pay CTA */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className={cn(
                "w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[15px] font-bold transition-all shadow-md",
                isProcessing
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-[#0f172a] text-white hover:bg-slate-700 active:scale-[0.99]"
              )}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-300/40 border-t-slate-400 rounded-full animate-spin" />
                  Đang xử lý giao dịch...
                </>
              ) : (
                <>
                  <Lock className="w-4.5 h-4.5" />
                  Thanh toán {formatVND(data.sessionPrice)}
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Bằng cách thanh toán, bạn đồng ý với <span className="underline cursor-pointer">Điều khoản dịch vụ</span> và <span className="underline cursor-pointer">Chính sách hoàn tiền</span> của AISEP.
            </p>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            {/* Advisor */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Cố vấn</p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={data.advisor.avatar} alt={data.advisor.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                  {data.advisor.isVerified && (
                    <BadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-amber-500 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 leading-none">{data.advisor.name}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{data.advisor.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-bold text-slate-600">{data.advisor.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Chi tiết phiên</p>
              <div className="space-y-2.5 text-[12px]">
                <p className="text-slate-700 font-semibold leading-snug">{data.topic}</p>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{data.agreedTime.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{data.agreedTime.time}</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Chi phí</p>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phí tư vấn ({data.duration})</span>
                  <span className="font-semibold text-slate-700">{formatVND(data.sessionPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phí nền tảng</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <div className="pt-2 mt-1 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[14px] font-bold text-slate-800">Tổng cộng</span>
                  <span className="text-[20px] font-black text-slate-900">{formatVND(data.sessionPrice)}</span>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-[#0f172a] rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-[12px] font-bold">Đảm bảo hoàn tiền</span>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Nếu cố vấn không thực hiện phiên, bạn sẽ được hoàn tiền <span className="text-white/90 font-semibold">100%</span> trong vòng 3–5 ngày làm việc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StartupShell>
  );
}
