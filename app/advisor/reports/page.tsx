"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Eye, Edit, Trash2, Building2, Calendar } from "lucide-react";
import { AdvisorShell } from "@/components/advisor/advisor-shell";

type Report = {
  id: string;
  projectName: string;
  startupName: string;
  content: string;
  updatedDate: string;
};

const initialReports: Report[] = [
  {
    id: "1",
    projectName: "Tech ABC - AI Platform",
    startupName: "Tech ABC",
    content: "Buổi tư vấn đã tập trung vào chiến lược phát triển sản phẩm AI. Startup có nền tảng kỹ thuật tốt nhưng cần cải thiện về go-to-market strategy. Đề xuất: 1) Tập trung vào một vertical market cụ thể trước, 2) Xây dựng case studies mạnh, 3) Tăng cường content marketing.",
    updatedDate: "20/01/2026",
  },
  {
    id: "2",
    projectName: "AI Solutions - ML Pipeline",
    startupName: "AI Solutions",
    content: "Review kiến trúc hệ thống ML pipeline. Đánh giá: Architecture tốt nhưng cần tối ưu về scalability. Khuyến nghị chuyển sang microservices và implement caching layer để giảm latency.",
    updatedDate: "15/01/2026",
  },
];

export default function AdvisorReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [startupName, setStartupName] = useState("");
  const [content, setContent] = useState("");

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowDetailDialog(true);
  };

  const handleDeleteClick = (report: Report) => {
    setSelectedReport(report);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedReport) {
      setReports(reports.filter((r) => r.id !== selectedReport.id));
      setShowDeleteDialog(false);
      setSelectedReport(null);
    }
  };

  const handleCreateClick = () => {
    setProjectName("");
    setStartupName("");
    setContent("");
    setShowCreateDialog(true);
  };

  const handleCreateConfirm = () => {
    if (projectName && startupName && content) {
      const newReport: Report = {
        id: Date.now().toString(),
        projectName,
        startupName,
        content,
        updatedDate: new Date().toLocaleDateString("vi-VN"),
      };
      setReports([newReport, ...reports]);
      setShowCreateDialog(false);
      setProjectName("");
      setStartupName("");
      setContent("");
    }
  };

  const handleUpdateClick = (report: Report) => {
    setSelectedReport(report);
    setProjectName(report.projectName);
    setStartupName(report.startupName);
    setContent(report.content);
    setShowUpdateDialog(true);
  };

  const handleUpdateConfirm = () => {
    if (selectedReport && projectName && startupName && content) {
      setReports(
        reports.map((r) =>
          r.id === selectedReport.id
            ? {
                ...r,
                projectName,
                startupName,
                content,
                updatedDate: new Date().toLocaleDateString("vi-VN"),
              }
            : r
        )
      );
      setShowUpdateDialog(false);
      setSelectedReport(null);
      setProjectName("");
      setStartupName("");
      setContent("");
    }
  };

  const truncateContent = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <AdvisorShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Báo cáo Tư vấn</h1>
            <p className="text-slate-600 mt-1">Quản lý báo cáo sau mỗi phiên tư vấn</p>
          </div>
          <Button
            onClick={handleCreateClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo báo cáo mới
          </Button>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900">
                    {report.projectName}
                  </h3>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{report.startupName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Cập nhật: {report.updatedDate}</span>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {truncateContent(report.content)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(report)}
                      className="border-slate-300 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateClick(report)}
                      className="border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Cập nhật
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(report)}
                      className="border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedReport.projectName}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{selectedReport.startupName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Cập nhật: {selectedReport.updatedDate}</span>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-900">Nội dung báo cáo</Label>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedReport.content}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailDialog(false)}
                >
                  Đóng
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setShowDetailDialog(false);
                    handleUpdateClick(selectedReport);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Xóa báo cáo?</DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4">
                <p className="text-sm text-slate-700">
                  Bạn có chắc chắn muốn xóa báo cáo <strong>{selectedReport.projectName}</strong>?
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Hành động này không thể hoàn tác.
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteConfirm}
                >
                  Xóa báo cáo
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Tạo báo cáo mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Tên dự án</Label>
              <Input
                id="project-name"
                placeholder="Ví dụ: Tech ABC - AI Platform"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startup-name">Tên startup</Label>
              <Input
                id="startup-name"
                placeholder="Ví dụ: Tech ABC"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung báo cáo</Label>
              <Textarea
                id="content"
                placeholder="Mô tả chi tiết về buổi tư vấn, đánh giá, và các khuyến nghị..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-y"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              onClick={handleCreateConfirm}
              disabled={!projectName || !startupName || !content}
            >
              Tạo báo cáo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Cập nhật báo cáo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="update-project-name">Tên dự án</Label>
              <Input
                id="update-project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-startup-name">Tên startup</Label>
              <Input
                id="update-startup-name"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-content">Nội dung báo cáo</Label>
              <Textarea
                id="update-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-y"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleUpdateConfirm}
              disabled={!projectName || !startupName || !content}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdvisorShell>
  );
}
