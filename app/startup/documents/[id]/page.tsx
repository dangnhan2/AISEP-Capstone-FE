"use client";

import { use, useEffect, useMemo, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  RefreshCcw,
  Shield,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import {
  CheckOnchainStatus,
  DeleteDocument,
  GetDocumentById,
  HashDocument,
  SubmitDocumentToBlockchain,
} from "@/services/document/document.api";

type BlockchainStatus = "not_submitted" | "pending" | "recorded" | "matched" | "mismatch" | "failed";

const PROOF_STATUS = {
  Anchored: 0,
  Revoked: 1,
  HashComputed: 2,
  Pending: 3,
} as const;

interface DocView {
  id: string;
  name: string;
  fileUrl?: string | null;
  typeLabel: string;
  analysisLabel: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  hash: string;
  txHash: string;
  blockchainStatus: BlockchainStatus;
}

interface ChainResult {
  transactionHash?: string;
  status?: string;
  blockNumber?: string | number | boolean;
  confirmedAt?: string;
}

function fileNameFromUrl(url?: string | null) {
  if (!url) return "Untitled";
  const parts = url.split("/");
  return parts[parts.length - 1] || "Untitled";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(d);
}

function typeLabel(value?: number | null) {
  if (Number(value) === 0) return "Pitch Deck";
  if (Number(value) === 1) return "Business Plan";
  return "Khác";
}

function analysisLabel(value?: number | null) {
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

function blockchainStatusFromChain(result?: ChainResult | null): BlockchainStatus {
  if (!result) return "not_submitted";
  const s = String(result.status ?? "").toLowerCase();
  if (s.includes("failed") || s.includes("error")) return "failed";
  if (s.includes("pending") || s.includes("processing")) return "pending";
  if (s.includes("mismatch")) return "mismatch";
  if (result.transactionHash || s.includes("matched") || s.includes("verified")) return "matched";
  return "recorded";
}

function shortHash(value?: string | null) {
  if (!value) return "—";
  return value.length <= 14 ? value : `${value.slice(0, 7)}...${value.slice(-5)}`;
}

const BC: Record<BlockchainStatus, { label: string; cls: string; Icon: React.ElementType; spin?: boolean }> = {
  not_submitted: { label: "Chưa gửi", cls: "bg-slate-100 text-slate-500 border-slate-200", Icon: Shield },
  pending: { label: "Chờ xác nhận", cls: "bg-amber-50 text-amber-600 border-amber-100", Icon: RefreshCcw, spin: true },
  recorded: { label: "Đã ghi nhận", cls: "bg-emerald-50 text-emerald-600 border-emerald-100", Icon: CheckCircle2 },
  matched: { label: "Khớp hash", cls: "bg-teal-50 text-teal-600 border-teal-100", Icon: ShieldCheck },
  mismatch: { label: "Hash lệch", cls: "bg-red-50 text-red-600 border-red-100", Icon: AlertTriangle },
  failed: { label: "Thất bại", cls: "bg-rose-50 text-rose-600 border-rose-100", Icon: XCircle },
};

export default function StartupDocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [doc, setDoc] = useState<DocView | null>(null);
  const [chainResult, setChainResult] = useState<ChainResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "info" | "success" | "error" } | null>(null);

  const chainStatus = useMemo(
    () => (chainResult ? blockchainStatusFromChain(chainResult) : doc?.blockchainStatus ?? "not_submitted"),
    [chainResult, doc?.blockchainStatus],
  );

  const showToast = (msg: string, type: "info" | "success" | "error" = "info") => setToast({ msg, type });

  const refreshChainStatus = async () => {
    const backendDocId = Number(id);
    const res = await CheckOnchainStatus(backendDocId);
    const result = res?.data ?? null;
    setChainResult(result);
    if (result?.transactionHash) {
      setDoc((prev) => (prev ? { ...prev, txHash: result.transactionHash ?? prev.txHash } : prev));
    }
    return result;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const backendDocId = Number(id);
        if (!Number.isFinite(backendDocId)) notFound();
        const res = await GetDocumentById(backendDocId);
        const item = res?.data ?? null;
        if (!item) notFound();
        setDoc({
          id: String(item.documentID),
          name: fileNameFromUrl(item.fileUrl),
          fileUrl: item.fileUrl,
          typeLabel: typeLabel(item.documentType),
          analysisLabel: analysisLabel(item.analysisStatus),
          version: item.version,
          createdAt: formatDate(item.uploadedAt),
          updatedAt: formatDate(item.uploadedAt),
          hash: item.fileHash,
          txHash: item.transactionHash,
          blockchainStatus: proofStatusToBlockchainStatus(item.proofStatus),
        });
        if (cancelled) return;
      } catch (e: unknown) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load document");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmitBlockchain = async () => {
    const backendDocId = Number(id);
    setActionLoading(true);
    try {
      await HashDocument(backendDocId);
      await SubmitDocumentToBlockchain(backendDocId);
      showToast("Đã gửi lên blockchain, đang kiểm tra trạng thái...", "info");
      const result = await refreshChainStatus();
      if (result?.status?.toLowerCase().includes("failed")) {
        showToast("Gửi thành công nhưng blockchain đang báo lỗi.", "error");
      } else {
        showToast("Đã cập nhật trạng thái blockchain.", "success");
      }
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gửi blockchain thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryBlockchain = async () => {
    const backendDocId = Number(id);
    setActionLoading(true);
    try {
      await SubmitDocumentToBlockchain(backendDocId);
      showToast("Đã gửi lại yêu cầu blockchain, đang kiểm tra...", "info");
      await refreshChainStatus();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gửi lại thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyBlockchain = async () => {
    setActionLoading(true);
    try {
      await refreshChainStatus();
      showToast("Đã làm mới trạng thái on-chain.", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Kiểm tra on-chain thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const backendDocId = Number(id);
      await DeleteDocument(String(backendDocId));
      showToast("Đã xóa tài liệu", "success");
      setTimeout(() => router.push("/startup/documents"), 700);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Xóa tài liệu thất bại", "error");
    }
  };

  if (loading) {
    return (
      <StartupShell>
        <div className="max-w-[1100px] mx-auto space-y-6 pb-20">
          <p className="text-[13px] text-slate-500">Đang tải tài liệu...</p>
        </div>
      </StartupShell>
    );
  }

  if (error || !doc) {
    return (
      <StartupShell>
        <div className="max-w-[1100px] mx-auto space-y-6 pb-20">
          <p className="text-[13px] text-red-500">{error ?? "Không tìm thấy tài liệu"}</p>
        </div>
      </StartupShell>
    );
  }

  const chainCfg = BC[chainStatus];

  return (
    <StartupShell>
      <div className="max-w-[1100px] mx-auto space-y-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 flex-shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[20px] font-semibold text-[#0f172a] tracking-[-0.02em]">{doc.name}</h1>
                <span className="px-2 py-0.5 bg-[#0f172a] text-white text-[10px] font-medium rounded-md">{doc.version}</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded-md border border-emerald-100">
                  {doc.typeLabel}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> Tạo {doc.createdAt}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {doc.analysisLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDelete}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all"
              title="Xóa tài liệu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#0f172a] truncate">{doc.name}</p>
                  <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border mt-1.5", chainCfg.cls)}>
                    <chainCfg.Icon className={cn("w-2.5 h-2.5", chainCfg.spin && "animate-spin")} />
                    {chainCfg.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {doc.fileUrl ? (
                  <>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 bg-[#0f172a] text-white rounded-xl text-[12px] font-medium hover:bg-slate-800 transition-all">
                      <Eye className="w-3.5 h-3.5" /> Mở tệp
                    </a>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[12px] font-medium hover:bg-slate-50 transition-all">
                      <Download className="w-3.5 h-3.5" /> Tải xuống
                    </a>
                  </>
                ) : (
                  <p className="col-span-2 text-[12px] text-slate-400">Chưa có file đính kèm.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-700">Thông tin</span>
              </div>
              <div className="px-5 pt-4 pb-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-slate-400">Loại</span>
                  <span className="text-[12px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{doc.typeLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-slate-400">Trạng thái phân tích</span>
                  <span className="text-[12px] text-slate-600">{doc.analysisLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-slate-400">Cập nhật</span>
                  <span className="text-[12px] text-slate-600">{doc.updatedAt}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-slate-400">File hash</span>
                  <span className="text-[12px] text-slate-600">{shortHash(doc.hash)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-slate-400">Tx hash</span>
                  <span className="text-[12px] text-slate-600">{shortHash(doc.txHash)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-700">Blockchain</span>
                <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap", chainCfg.cls)}>
                  <chainCfg.Icon className={cn("w-3 h-3", chainCfg.spin && "animate-spin")} />
                  {chainCfg.label}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <button
                  onClick={handleSubmitBlockchain}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0f172a] text-white rounded-xl text-[13px] font-medium hover:bg-slate-800 transition-all disabled:opacity-60"
                >
                  <ArrowRight className="w-4 h-4" />
                  Gửi lên blockchain
                </button>
                <button
                  onClick={handleVerifyBlockchain}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-50 transition-all disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Kiểm tra on-chain
                </button>
                <button
                  onClick={handleRetryBlockchain}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-amber-200 text-amber-700 rounded-xl text-[13px] font-medium hover:bg-amber-50 transition-all disabled:opacity-60"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Gửi lại blockchain
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-700">Kết quả kiểm tra on-chain</span>
                <span className="text-[12px] text-slate-400">{chainResult ? "Đã cập nhật" : "Chưa có dữ liệu"}</span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</p>
                  <p className="text-[15px] font-bold text-slate-900 mt-1">{chainCfg.label}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Transaction hash</p>
                  <p className="text-[15px] font-bold text-slate-900 mt-1 break-all">{chainResult?.transactionHash ?? doc.txHash ?? "—"}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Block number</p>
                  <p className="text-[15px] font-bold text-slate-900 mt-1">{String(chainResult?.blockNumber ?? "—")}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Confirmed at</p>
                  <p className="text-[15px] font-bold text-slate-900 mt-1">{chainResult?.confirmedAt ? formatDate(chainResult.confirmedAt) : "—"}</p>
                </div>
              </div>
            </div>

            {chainResult && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
                <h3 className="text-[13px] font-semibold text-slate-700 mb-4">Dữ liệu phản hồi</h3>
                <div className="space-y-2 text-[12px] text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">transactionHash</span>
                    <span className="font-semibold text-slate-900 break-all text-right">{chainResult.transactionHash ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">status</span>
                    <span className="font-semibold text-slate-900">{chainResult.status ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">blockNumber</span>
                    <span className="font-semibold text-slate-900">{String(chainResult.blockNumber ?? "—")}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">confirmedAt</span>
                    <span className="font-semibold text-slate-900">{chainResult.confirmedAt ?? "—"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] text-[13px] font-medium pointer-events-none whitespace-nowrap",
          toast.type === "success" ? "bg-emerald-600 text-white" : toast.type === "error" ? "bg-red-600 text-white" : "bg-[#0f172a] text-white",
        )}>
          {toast.msg}
        </div>
      )}
    </StartupShell>
  );
}
