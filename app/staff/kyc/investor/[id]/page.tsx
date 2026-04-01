"use client";

import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

export default function PendingInvestorKycPlaceholder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4 px-4">
      <p className="text-[15px] font-semibold text-slate-900 text-center">
        Thẩm định Nhà đầu tư (ID: {id})
      </p>
      <p className="text-[13px] text-slate-500 text-center max-w-md">
        Trang chi tiết thẩm định Nhà đầu tư đang được nối với API. Tạm thời quay lại danh sách để xem các hồ sơ chờ.
      </p>
      <Link
        href="/staff/kyc"
        className="inline-flex items-center gap-2 text-[13px] font-bold text-[#C8A000] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Về danh sách KYC
      </Link>
    </div>
  );
}
