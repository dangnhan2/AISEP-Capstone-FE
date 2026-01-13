"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type OfferStatus = "pending" | "accepted" | "rejected";

type Offer = {
  startup: string;
  amount: string;
  date: string;
  status: OfferStatus;
};

const offers: Offer[] = [
  {
    startup: "AI Vision Tech",
    amount: "$500K",
    date: "15/12/2024",
    status: "pending",
  },
  {
    startup: "FinNext Solutions",
    amount: "$1M",
    date: "10/12/2024",
    status: "accepted",
  },
  {
    startup: "HealthAI Pro",
    amount: "$300K",
    date: "05/12/2024",
    status: "rejected",
  },
];

function StatusBadge({ status }: { status: OfferStatus }) {
  if (status === "pending") {
    return (
      <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">
        Đang chờ
      </Badge>
    );
  }

  if (status === "accepted") {
    return (
      <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        Đã chấp nhận
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full bg-red-100 text-red-600 hover:bg-red-100">
      Đã từ chối
    </Badge>
  );
}

export default function InvestorOffersPage() {
  return (
    <InvestorShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Đề nghị của tôi</h1>
          <p className="text-slate-600">
            Quản lý các đề nghị đầu tư đã gửi
          </p>
        </div>

        <Card className="border-slate-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="min-w-full divide-y divide-slate-100 text-sm">
              <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] bg-slate-50 px-6 py-3 font-medium text-slate-700">
                <div>Startup</div>
                <div>Số tiền</div>
                <div>Ngày gửi</div>
                <div>Trạng thái</div>
                <div className="text-right">Hành động</div>
              </div>

              {offers.map((offer) => (
                <div
                  key={offer.startup}
                  className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] items-center px-6 py-4"
                >
                  <div className="text-slate-900">{offer.startup}</div>
                  <div className="text-slate-800">{offer.amount}</div>
                  <div className="text-slate-700">{offer.date}</div>
                  <div>
                    <StatusBadge status={offer.status} />
                  </div>
                  <div className="text-right">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </InvestorShell>
  );
}


