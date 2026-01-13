"use client";

import { StartupShell } from "@/components/startup/startup-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Upload, CheckCircle2, Clock3 } from "lucide-react";

type DocumentStatus = "verified" | "processing";

type DocumentItem = {
  name: string;
  type: string;
  status: DocumentStatus;
  hash?: string;
};

const documents: DocumentItem[] = [
  {
    name: "Pitch Deck 2024.pdf",
    type: "Pitch Deck",
    status: "verified",
    hash: "0x7a8f...3e2d",
  },
  {
    name: "Business Plan.pdf",
    type: "Business Plan",
    status: "processing",
  },
  {
    name: "Legal Docs.pdf",
    type: "Legal",
    status: "verified",
    hash: "0x9b4c...7f1a",
  },
];

const statusMap: Record<DocumentStatus, { label: string; tone: string; icon: React.ElementType }> = {
  verified: {
    label: "Đã xác thực",
    tone: "bg-emerald-100 text-emerald-700 border-transparent",
    icon: CheckCircle2,
  },
  processing: {
    label: "Đang xử lý",
    tone: "bg-amber-100 text-amber-700 border-transparent",
    icon: Clock3,
  },
};

export default function StartupDocumentsPage() {
  return (
    <StartupShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tài liệu &amp; Tài sản Trí tuệ</h1>
            <p className="text-slate-600">Quản lý và bảo vệ tài liệu trên blockchain</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Tải lên
          </Button>
        </div>

        <Card className="border-slate-200 overflow-hidden">
          <CardHeader className="hidden">
            <CardTitle>Tài liệu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] px-6 py-3 bg-slate-50 text-sm font-semibold text-slate-700">
              <div>Tên tài liệu</div>
              <div>Loại</div>
              <div>Trạng thái</div>
              <div>Hash</div>
              <div className="text-right">Hành động</div>
            </div>

            <div className="divide-y divide-slate-100">
              {documents.map((doc) => {
                const status = statusMap[doc.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={doc.name}
                    className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] items-center px-6 py-4 text-sm text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <div className="text-slate-700">{doc.type}</div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                          status.tone
                        )}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    </div>
                    <div className="text-slate-600 font-mono">
                      {doc.hash ?? <span className="text-slate-400">-</span>}
                    </div>
                    <div className="text-right">
                      <Button variant="link" className="text-blue-600 hover:text-blue-700 px-0">
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </StartupShell>
  );
}

