"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StartupShell } from "@/components/startup/startup-shell";
import { cn } from "@/lib/utils";
import {
  Download,
  Eye,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  RefreshCcw,
  Shield,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { DeleteDocument, GetDocument } from "@/services/document/document.api";

type BlockchainStatus = "not_submitted" | "pending" | "recorded" | "matched" | "mismatch" | "failed";

const PROOF_STATUS = {
  Anchored: 0,
  Revoked: 1,
  HashComputed: 2,
  Pending: 3,
} as const;

function fileNameFromUrl(url?: string | null) {
  if (!url) return "Untitled";
  const parts = url.split("/");
  return parts[parts.length - 1] || "Untitled";
}

function formatUploadedAt(uploadedAt?: string | null) {
  if (!uploadedAt) return "—";
  const d = new Date(uploadedAt);
  if (Number.isNaN(d.getTime())) return uploadedAt;
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(d);
}

function documentTypeLabel(value?: number | null) {
  if (Number(value) === 0) return "Pitch Deck";
  if (Number(value) === 1) return "Business Plan";
  return "Khác";
}

function analysisStatusLabel(value?: number | null) {
  if (Number(value) === 1) return "Đã hoàn tất";
  if (Number(value) === 2) return "Thất bại";
  return "Chưa phân tích";
}

function proofStatusToBlockchainStatus(value?: number | null): BlockchainStatus {
  if (value === null || typeof value === "undefined") return "not_submitted";
  if (value === PROOF_STATUS.Pending) return "pending";
  if (value === PROOF_STATUS.Revoked) return "failed";
  if (value === PROOF_STATUS.Anchored || value === PROOF_STATUS.HashComputed) return "recorded";
  return "recorded";
}

function fileIconProps(name: string): { Icon: React.ElementType; cls: string } {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return { Icon: FileText, cls: "text-red-500 bg-red-50 border-red-100" };
  if (["xlsx", "xls", "csv"].includes(ext)) return { Icon: FileSpreadsheet, cls: "text-emerald-600 bg-emerald-50 border-emerald-100" };
  if (ext === "pptx") return { Icon: FileText, cls: "text-orange-500 bg-orange-50 border-orange-100" };
  if (ext === "zip") return { Icon: FileArchive, cls: "text-violet-500 bg-violet-50 border-violet-100" };
  return { Icon: FileCode, cls: "text-blue-500 bg-blue-50 border-blue-100" };
}

const BC: Record<BlockchainStatus, { label: string; cls: string; Icon: React.ElementType; spin?: boolean }> = {
  not_submitted: { label: "Chưa gửi", cls: "bg-slate-100 text-slate-500 border-slate-200", Icon: Shield },
  pending: { label: "Chờ xác nhận", cls: "bg-amber-50 text-amber-600 border-amber-100", Icon: RefreshCcw, spin: true },
  recorded: { label: "Đã ghi nhận", cls: "bg-emerald-50 text-emerald-600 border-emerald-100", Icon: ShieldCheck },
  matched: { label: "Khớp hash", cls: "bg-teal-50 text-teal-600 border-teal-100", Icon: ShieldCheck },
  mismatch: { label: "Hash lệch", cls: "bg-red-50 text-red-600 border-red-100", Icon: Shield },
  failed: { label: "Thất bại", cls: "bg-rose-50 text-rose-600 border-rose-100", Icon: Shield },
};

export default function StartupDocumentsPage() {
  const [docs, setDocs] = useState<IDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await GetDocument();
        const items = (res?.data ?? []) as IDocument[];
        if (cancelled) return;
        setDocs(items);
      } catch (e: unknown) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Không thể tải tài liệu");
        setDocs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const stats = useMemo(() => {
    const total = docs.length;
    const submitted = docs.filter((d) => d.proofStatus !== null && typeof d.proofStatus !== "undefined").length;
    const recorded = docs.filter((d) => proofStatusToBlockchainStatus(d.proofStatus) === "recorded" || proofStatusToBlockchainStatus(d.proofStatus) === "matched").length;
    return { total, submitted, recorded };
  }, [docs]);

  return (
    <StartupShell>
      <div className="max-w-[1100px] mx-auto space-y-5 pb-20">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h1 className="text-[22px] font-semibold text-[#0f172a] tracking-[-0.02em]">Tài liệu & IP</h1>
            <p className="text-[13px] text-slate-500 mt-1">Hiển thị trực tiếp theo `IDocument`.</p>
          </div>
          <button onClick={() => setReloadToken((v) => v + 1)} className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tổng tài liệu", value: String(stats.total) },
            { label: "Đã gửi", value: String(stats.submitted) },
            { label: "Đã ghi nhận", value: String(stats.recorded) },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 py-4">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">{item.label}</p>
              <p className="text-[22px] font-semibold text-[#0f172a] mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Tài liệu", "Loại", "Phân tích", "Blockchain", "Cập nhật", ""].map((h, i) => (
                  <th key={i} className={cn("px-5 py-3.5 text-[10px] font-medium text-slate-400 uppercase tracking-widest", i === 5 ? "text-right" : "text-left")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">Đang tải tài liệu...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-red-500">{error}</td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <FolderOpen className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-[13px] text-slate-400">Không tìm thấy tài liệu phù hợp</p>
                  </td>
                </tr>
              ) : (
                docs.map((doc) => {
                  const fi = fileIconProps(fileNameFromUrl(doc.fileUrl));
                  const bc = BC[proofStatusToBlockchainStatus(doc.proofStatus)];
                  return (
                    <tr key={doc.documentID} className="group hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0", fi.cls)}>
                            <fi.Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <Link href={`/startup/documents/${doc.documentID}`} className="text-[13px] font-medium text-[#0f172a] hover:underline underline-offset-2 line-clamp-1 block">
                              {fileNameFromUrl(doc.fileUrl)}
                            </Link>
                            <p className="text-[11px] text-slate-400 mt-0.5">#{doc.documentID} · Startup #{doc.startupID}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">{documentTypeLabel(doc.documentType)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">{analysisStatusLabel(doc.analysisStatus)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap", bc.cls)}>
                          <bc.Icon className={cn("w-3 h-3 flex-shrink-0", bc.spin && "animate-spin")} />
                          {bc.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-500 whitespace-nowrap">{formatUploadedAt(doc.uploadedAt)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/startup/documents/${doc.documentID}`}>
                            <span className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all" title="Xem chi tiết">
                              <Eye className="w-3.5 h-3.5" />
                            </span>
                          </Link>
                          {doc.fileUrl && (
                            <a href={doc.fileUrl} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all" title="Tải xuống" target="_blank" rel="noopener noreferrer">
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={async () => {
                              await DeleteDocument(String(doc.documentID));
                              setReloadToken((v) => v + 1);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Xóa tài liệu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StartupShell>
  );
}
