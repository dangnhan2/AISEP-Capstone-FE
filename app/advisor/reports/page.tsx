"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Eye, Edit } from "lucide-react";
import { AdvisorShell } from "@/components/advisor/advisor-shell";

type Report = {
  id: string;
  title: string;
  startup: string;
  date: string;
  status: "sent" | "draft";
};

const reports: Report[] = [
  {
    id: "1",
    title: "AI Strategy Review Report",
    startup: "Tech ABC",
    date: "15/12/2024",
    status: "sent",
  },
  {
    id: "2",
    title: "Funding Preparation Consulting",
    startup: "FinNext",
    date: "10/12/2024",
    status: "sent",
  },
  {
    id: "3",
    title: "Technical Architecture Review",
    startup: "AI Solutions",
    date: "05/12/2024",
    status: "draft",
  },
];

export default function AdvisorReportsPage() {
  const handleView = (id: string) => {
    console.log("View report:", id);
    // TODO: Implement view logic
  };

  const handleEdit = (id: string) => {
    console.log("Edit report:", id);
    // TODO: Implement edit logic
  };

  const handleCreate = () => {
    console.log("Create new report");
    // TODO: Implement create logic
  };

  return (
    <AdvisorShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Báo cáo Tư vấn</h1>
            <p className="text-slate-600 mt-1">Quản lý báo cáo tư vấn</p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo báo cáo
          </Button>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {report.title}
                      </h3>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium">Startup:</span> {report.startup}
                        </p>
                        <p>
                          <span className="font-medium">Ngày:</span> {report.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <Button
                          onClick={() => handleView(report.id)}
                          variant="outline"
                          size="sm"
                          className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem
                        </Button>
                        <Button
                          onClick={() => handleEdit(report.id)}
                          variant="outline"
                          size="sm"
                          className="border-slate-300 hover:bg-slate-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {report.status === "sent" ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                        Đã gửi
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100">
                        Nháp
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdvisorShell>
  );
}

