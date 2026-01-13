"use client";

import { StartupShell } from "@/components/startup/startup-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

type Investor = {
  id: string;
  name: string;
  type: string;
  field: string;
  status: "interested" | "has-offer" | "following";
  statusLabel: string;
};

const investors: Investor[] = [
  {
    id: "1",
    name: "ABC Ventures",
    type: "VC Fund",
    field: "AI, SaaS",
    status: "interested",
    statusLabel: "Quan tâm",
  },
  {
    id: "2",
    name: "XYZ Capital",
    type: "Angel",
    field: "Fintech",
    status: "has-offer",
    statusLabel: "Có đề nghị",
  },
  {
    id: "3",
    name: "Tech Investors",
    type: "VC Fund",
    field: "Technology",
    status: "following",
    statusLabel: "Theo dõi",
  },
];

const getStatusBadgeClass = (status: Investor["status"]) => {
  switch (status) {
    case "interested":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "has-offer":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "following":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function InvestorsPage() {
  return (
    <StartupShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nhà đầu tư</h1>
          <p className="text-slate-600 mt-1">
            Quản lý kết nối với nhà đầu tư
          </p>
        </div>

        <Card className="border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-900">
                      Nhà đầu tư
                    </th>
                    <th className="text-left p-4 font-semibold text-slate-900">
                      Loại
                    </th>
                    <th className="text-left p-4 font-semibold text-slate-900">
                      Lĩnh vực
                    </th>
                    <th className="text-left p-4 font-semibold text-slate-900">
                      Trạng thái
                    </th>
                    <th className="text-left p-4 font-semibold text-slate-900">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map((investor, index) => (
                    <tr
                      key={investor.id}
                      className={`border-b border-slate-100 last:border-0 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="p-4 text-slate-900 font-medium">
                        {investor.name}
                      </td>
                      <td className="p-4 text-slate-700">{investor.type}</td>
                      <td className="p-4 text-slate-700">{investor.field}</td>
                      <td className="p-4">
                        <Badge
                          className={`rounded-full border ${getStatusBadgeClass(
                            investor.status
                          )}`}
                        >
                          {investor.statusLabel}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Link
                          href="#"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Nhắn tin</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </StartupShell>
  );
}

