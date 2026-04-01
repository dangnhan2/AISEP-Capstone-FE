"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Filter,
  Hash,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { CustomToast } from "@/components/ui/custom-toast";
import { ChekOnchainHashByStaff, GetDocumentByStaff } from "@/services/staff/staff.api";

type CheckedHashResult = IBlockchainChecking & { checkedAt: string };
type DocTypeFilter = -1 | 0 | 1;

const TYPE_CFG: Record<DocTypeFilter, { label: string; badge: string }> = {
  [-1]: { label: "Tất cả", badge: "bg-slate-50 text-slate-600 border-slate-200" },
  0: { label: "Pitch Deck", badge: "bg-blue-50 text-blue-700 border-blue-100" },
  1: { label: "Business Plan", badge: "bg-violet-50 text-violet-700 border-violet-100" },
};

const ANALYSIS_CFG: Record<number, { label: string; badge: string; dot: string }> = {
  0: { label: "Chưa phân tích", badge: "bg-amber-50 text-amber-700 border-amber-200/80", dot: "bg-amber-400" },
  1: { label: "Đã hoàn tất", badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80", dot: "bg-emerald-400" },
  2: { label: "Thất bại", badge: "bg-rose-50 text-rose-700 border-rose-200/80", dot: "bg-rose-400" },
};

const CHECKED_CFG: Record<"empty" | "ok" | "fail" | "mismatch", { badge: string; label: string }> = {
  empty: { label: "Chưa kiểm tra", badge: "bg-slate-50 text-slate-600 border-slate-200" },
  ok: { label: "Đã xác thực", badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  fail: { label: "Lỗi xác thực", badge: "bg-rose-50 text-rose-700 border-rose-200/80" },
  mismatch: { label: "Không khớp", badge: "bg-amber-50 text-amber-700 border-amber-200/80" },
};

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function fileNameFromUrl(url?: string | null) {
  if (!url) return "Untitled";
  const parts = url.split("/");
  return parts[parts.length - 1] || "Untitled";
}

function typeLabel(value?: number | null) {
  return TYPE_CFG[(Number(value) as DocTypeFilter) ?? -1]?.label ?? "Unknown";
}

function typeBadge(value?: number | null) {
  return TYPE_CFG[(Number(value) as DocTypeFilter) ?? -1]?.badge ?? TYPE_CFG[-1].badge;
}

function analysisLabel(value?: number | null) {
  return ANALYSIS_CFG[Number(value) ?? 0]?.label ?? "Unknown";
}

function analysisBadge(value?: number | null) {
  return ANALYSIS_CFG[Number(value) ?? 0]?.badge ?? "bg-slate-50 text-slate-600 border-slate-200";
}

function analysisDot(value?: number | null) {
  return ANALYSIS_CFG[Number(value) ?? 0]?.dot ?? "bg-slate-400";
}

function shortHash(value?: string | null) {
  if (!value) return "—";
  return value.length <= 14 ? value : `${value.slice(0, 7)}...${value.slice(-5)}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}

function checkedCfg(result?: CheckedHashResult | null) {
  if (!result) return CHECKED_CFG.empty;
  if (result.onChainVerified) return CHECKED_CFG.ok;
  if (String(result.status ?? "").toUpperCase().includes("FAILED")) return CHECKED_CFG.fail;
  return CHECKED_CFG.mismatch;
}

export default function StaffDocumentPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("Page") ?? "1") || 1;
  const pageSize = Number(searchParams.get("PageSize") ?? "10") || 10;
  const documentTypeRaw = searchParams.get("DocumentType");
  const documentType = documentTypeRaw === null || documentTypeRaw === "" ? (-1 as DocTypeFilter) : (Number(documentTypeRaw) as DocTypeFilter);

  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [paging, setPaging] = useState<IPaging | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [checkingDocumentId, setCheckingDocumentId] = useState<number | null>(null);
  const [checkedResults, setCheckedResults] = useState<Record<number, CheckedHashResult>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  const selectedDocument = useMemo(
    () => documents.find((doc) => doc.documentID === selectedDocumentId) ?? documents[0] ?? null,
    [documents, selectedDocumentId],
  );
  const selectedChecked = selectedDocument ? checkedResults[selectedDocument.documentID] ?? null : null;

  const updateQuery = (patch: { page?: number; pageSize?: number; documentType?: DocTypeFilter | null }) => {
    const q = new URLSearchParams(searchParams.toString());
    if (typeof patch.page === "number") q.set("Page", String(patch.page));
    if (typeof patch.pageSize === "number") q.set("PageSize", String(patch.pageSize));
    if (typeof patch.documentType !== "undefined") {
      if (patch.documentType === null || patch.documentType === -1) q.delete("DocumentType");
      else q.set("DocumentType", String(patch.documentType));
    }
    router.push(`${pathname}?${q.toString()}`);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const query = new URLSearchParams();
        query.set("Page", String(page));
        query.set("PageSize", String(pageSize));
        if (documentType !== -1 && !Number.isNaN(documentType)) query.set("DocumentType", String(documentType));

        const res = await GetDocumentByStaff(query.toString());
        if (!alive) return;

        if (res?.success || res?.isSuccess) {
          const items = (res?.data?.items ?? []) as IDocument[];
          setDocuments(items);
          setPaging(res?.data?.paging ?? null);
          setSelectedDocumentId((current) => (current && items.some((doc) => doc.documentID === current) ? current : items[0]?.documentID ?? null));
        } else {
          setDocuments([]);
          setPaging(null);
          setSelectedDocumentId(null);
          setErrorMsg(typeof res?.message === "string" ? res.message : "Không thể tải danh sách tài liệu.");
        }
      } catch (error: unknown) {
        if (!alive) return;
        setDocuments([]);
        setPaging(null);
        setSelectedDocumentId(null);
        setErrorMsg(getErrorMessage(error, "Có lỗi xảy ra khi tải tài liệu."));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [documentType, page, pageSize, reloadToken]);

  const totalItems = paging?.totalItems ?? documents.length;
  const canPrev = page > 1;
  const canNext = totalItems > 0 ? page * pageSize < totalItems : false;

  const pushToast = (message: string, type: "success" | "error" | "info" = "info") => setToast({ message, type });

  const handleCheckOnchain = async (doc: IDocument) => {
    setCheckingDocumentId(doc.documentID);
    try {
      const res = await ChekOnchainHashByStaff(doc.documentID);
      if (res?.success || res?.isSuccess) {
        setCheckedResults((prev) => ({
          ...prev,
          [doc.documentID]: {
            ...(res?.data ?? ({} as IBlockchainChecking)),
            checkedAt: new Date().toISOString(),
          },
        }));
        pushToast(`Đã kiểm tra on-chain cho tài liệu #${doc.documentID}`, "success");
      } else {
        pushToast(typeof res?.message === "string" ? res.message : "Kiểm tra on-chain thất bại.", "error");
      }
    } catch (error: unknown) {
      pushToast(getErrorMessage(error, "Kiểm tra on-chain thất bại."), "error");
    } finally {
      setCheckingDocumentId(null);
    }
  };

  const displayedTypeCount = (type: DocTypeFilter) => documents.filter((doc) => Number(doc.documentType) === type).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight font-plus-jakarta-sans">Tài liệu của staff</h1>
          <p className="text-[13px] text-slate-500 mt-1">Filter và phân trang đang đi theo query string `DocumentType`, `Page`, `PageSize`.</p>
        </div>
        <button onClick={() => setReloadToken((v) => v + 1)} className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all shadow-sm active:scale-95">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tổng tài liệu", value: documents.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Pitch Deck", value: displayedTypeCount(0), icon: Clock3, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { label: "Business Plan", value: displayedTypeCount(1), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Đang xem", value: selectedDocument ? 1 : 0, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", card.bg, card.border)}>
                <card.icon className={cn("w-4 h-4", card.color)} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{card.label}</p>
            </div>
            <p className="text-[22px] font-black text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {([-1, 0, 1] as const).map((value) => (
            <button
              key={value}
              onClick={() => updateQuery({ page: 1, documentType: value })}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[13px] font-bold transition-all shadow-sm active:scale-95",
                documentType === value ? "border-[#eec54e] bg-amber-50 text-[#C8A000]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              <Filter className="w-4 h-4" />
              {TYPE_CFG[value].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">Danh sách tài liệu</h3>
            <span className="text-[11px] font-bold text-slate-500">{documents.length} / {totalItems}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-[11px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100">Tài liệu</th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100">Loại</th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100">Phân tích</th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100">On-chain</th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100">Ngày tải</th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: pageSize }).map((_, idx) => (
                    <tr key={idx}>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : errorMsg ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      {errorMsg}
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      Không có tài liệu phù hợp.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => {
                    const selected = selectedDocument?.documentID === doc.documentID;
                    const checked = checkedResults[doc.documentID] ?? null;
                    const cfg = checkedCfg(checked);

                    return (
                      <tr key={doc.documentID} onClick={() => setSelectedDocumentId(doc.documentID)} className={cn("group cursor-pointer hover:bg-slate-50/60 transition-colors", selected && "bg-amber-50/30")}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-slate-900 line-clamp-1">{fileNameFromUrl(doc.fileUrl)}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">#{doc.documentID} · Startup #{doc.startupID}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border", typeBadge(doc.documentType))}>
                            {typeLabel(doc.documentType)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border", analysisBadge(doc.analysisStatus))}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", analysisDot(doc.analysisStatus))} />
                            {analysisLabel(doc.analysisStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border", cfg.badge)}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[12px] text-slate-500 whitespace-nowrap">{formatDateTime(doc.uploadedAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleCheckOnchain(doc);
                              }}
                              disabled={checkingDocumentId === doc.documentID}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eec54e]/40 bg-white text-[#C8A000] text-[12px] font-bold hover:bg-[#eec54e] hover:text-white hover:border-[#eec54e] transition-all shadow-sm active:scale-95 disabled:opacity-50"
                            >
                              <Hash className="w-3.5 h-3.5" />
                              {checkingDocumentId === doc.documentID ? "Đang kiểm tra" : "Kiểm tra hash"}
                            </button>
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                onClick={(e) => e.stopPropagation()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                                title="Tải xuống"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[12px] text-slate-500 font-medium">
              Hiển thị <span className="text-slate-900 font-bold">{documents.length}</span> trên <span className="text-slate-900 font-bold">{totalItems}</span> tài liệu
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuery({ page: Math.max(1, page - 1) })}
                disabled={!canPrev || loading}
                className={cn("px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-colors", canPrev && !loading ? "border-slate-200 bg-white text-slate-400 hover:bg-slate-50" : "border-slate-200 bg-white text-slate-400 cursor-not-allowed")}
              >
                Trước
              </button>
              <button
                onClick={() => updateQuery({ page: page + 1 })}
                disabled={!canNext || loading}
                className={cn("px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-colors", canNext && !loading ? "border-slate-200 bg-white text-slate-400 hover:bg-slate-50" : "border-slate-200 bg-white text-slate-400 cursor-not-allowed")}
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight mb-4">Chi tiết tài liệu</h3>
            {selectedDocument ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tên file</p>
                  <p className="text-[15px] font-bold text-slate-900 mt-1 break-words">{fileNameFromUrl(selectedDocument.fileUrl)}</p>
                  <p className="text-[12px] text-slate-500 mt-1">Document ID #{selectedDocument.documentID}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</p>
                    <p className="text-[13px] font-semibold text-slate-900 mt-1">{typeLabel(selectedDocument.documentType)}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysis</p>
                    <p className="text-[13px] font-semibold text-slate-900 mt-1">{analysisLabel(selectedDocument.analysisStatus)}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Startup</p>
                    <p className="text-[13px] font-semibold text-slate-900 mt-1">#{selectedDocument.startupID}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Version</p>
                    <p className="text-[13px] font-semibold text-slate-900 mt-1">{selectedDocument.version || "—"}</p>
                  </div>
                </div>
                <div className="space-y-3 text-[12px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Uploaded</span>
                    <span className="text-slate-700 font-semibold">{formatDateTime(selectedDocument.uploadedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">File hash</span>
                    <span className="text-slate-700 font-semibold break-all text-right">{shortHash(selectedDocument.fileHash)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Transaction hash</span>
                    <span className="text-slate-700 font-semibold break-all text-right">{shortHash(selectedDocument.transactionHash)}</span>
                  </div>
                </div>
                <button
                  onClick={() => void handleCheckOnchain(selectedDocument)}
                  disabled={checkingDocumentId === selectedDocument.documentID}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0f172a] text-white text-[13px] font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {checkingDocumentId === selectedDocument.documentID ? "Đang kiểm tra..." : "Kiểm tra on-chain"}
                </button>
                <div className={cn("rounded-2xl border px-4 py-3", checkedCfg(selectedChecked).badge)}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest">Kết quả on-chain</p>
                      <p className="text-[13px] font-semibold mt-1">{checkedCfg(selectedChecked).label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-500">Verified</p>
                      <p className="text-[13px] font-bold text-slate-900">{selectedChecked ? (selectedChecked.onChainVerified ? "True" : "False") : "—"}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-[12px]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Computed hash</span>
                      <span className="font-semibold text-slate-900 break-all text-right">{shortHash(selectedChecked?.computedHash)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Status</span>
                      <span className="font-semibold text-slate-900">{selectedChecked?.status ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Checked at</span>
                      <span className="font-semibold text-slate-900">{selectedChecked ? formatDateTime(selectedChecked.checkedAt) : "—"}</span>
                    </div>
                  </div>
                </div>
                {selectedDocument.fileUrl && (
                  <a href={selectedDocument.fileUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-[13px] font-bold hover:bg-slate-50 transition-all shadow-sm">
                    <Download className="w-4 h-4" />
                    Mở file gốc
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-400 text-[13px]">Chưa có tài liệu nào được chọn.</div>
            )}
          </div>
        </div>
      </div>

      <CustomToast message={toast?.message ?? ""} isVisible={Boolean(toast)} onClose={() => setToast(null)} type={toast?.type === "error" ? "error" : "success"} />
    </div>
  );
}
