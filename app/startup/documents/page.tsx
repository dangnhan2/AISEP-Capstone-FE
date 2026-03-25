"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import { cn } from "@/lib/utils";
import { UploadDocumentModal } from "@/components/startup/upload-document-modal";
import {
    Search, Upload, FolderOpen, ShieldCheck, Clock, HardDrive,
    FileText, FileSpreadsheet, FileArchive, FileCode,
    Shield, RefreshCcw, AlertTriangle, CheckCircle2, XCircle,
    Eye, Download, Lock, Users, UserCheck, Pencil, Trash2,
    ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, ExternalLink,
    Info, AlertCircle,
} from "lucide-react";

import { MOCK_DOCS, Doc, BlockchainStatus, Visibility, DocType } from "@/services/startup/documents.mock";

type SortKey = "updatedAt" | "name" | "type" | "blockchainStatus" | "version";


/* ─── Config ──────────────────────────────────────────────── */
function fileIconProps(name: string): { Icon: React.ElementType; cls: string } {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "pdf")                          return { Icon: FileText,        cls: "text-red-500 bg-red-50 border-red-100" };
    if (["xlsx","xls","csv"].includes(ext))     return { Icon: FileSpreadsheet, cls: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (ext === "pptx")                         return { Icon: FileText,        cls: "text-orange-500 bg-orange-50 border-orange-100" };
    if (ext === "zip")                          return { Icon: FileArchive,     cls: "text-violet-500 bg-violet-50 border-violet-100" };
    return                                             { Icon: FileCode,        cls: "text-blue-500 bg-blue-50 border-blue-100" };
}

const BC: Record<BlockchainStatus, {
    label: string; cls: string; Icon: React.ElementType; spin?: boolean; hint?: string; cta?: string;
}> = {
    not_submitted: { label: "Chưa gửi",     cls: "bg-slate-100 text-slate-500 border-slate-200",       Icon: Shield },
    pending:       { label: "Chờ xác nhận", cls: "bg-amber-50 text-amber-600 border-amber-100",         Icon: RefreshCcw, spin: true },
    recorded:      { label: "Đã ghi nhận",  cls: "bg-emerald-50 text-emerald-600 border-emerald-100",   Icon: CheckCircle2 },
    matched:       { label: "Khớp hash",    cls: "bg-teal-50 text-teal-600 border-teal-100",            Icon: ShieldCheck },
    mismatch:      { label: "Hash lệch",    cls: "bg-red-50 text-red-600 border-red-100",               Icon: AlertTriangle, hint: "File có thể đã bị thay đổi sau khi ghi nhận", cta: "Kiểm tra on-chain" },
    failed:        { label: "Thất bại",     cls: "bg-rose-50 text-rose-600 border-rose-100",            Icon: XCircle, hint: "Giao dịch blockchain không thành công", cta: "Gửi lại hash" },
};

const VIS: Record<Visibility, { label: string; cls: string; Icon: React.ElementType }> = {
    private:   { label: "Riêng tư",     cls: "bg-slate-100 text-slate-600 border-slate-200",   Icon: Lock },
    investors: { label: "Nhà đầu tư",   cls: "bg-blue-50 text-blue-600 border-blue-100",       Icon: Users },
    advisors:  { label: "Cố vấn",       cls: "bg-violet-50 text-violet-600 border-violet-100", Icon: UserCheck },
    both:      { label: "NĐT & Cố vấn", cls: "bg-indigo-50 text-indigo-600 border-indigo-100", Icon: Users },
};

const SORT_OPTS: { value: SortKey; label: string }[] = [
    { value: "updatedAt",        label: "Mới cập nhật" },
    { value: "name",             label: "Tên A–Z" },
    { value: "type",             label: "Loại tài liệu" },
    { value: "blockchainStatus", label: "Trạng thái blockchain" },
    { value: "version",         label: "Phiên bản mới nhất" },
];

function sortDocs(docs: Doc[], key: SortKey): Doc[] {
    return [...docs].sort((a, b) => {
        switch (key) {
            case "name":             return a.name.localeCompare(b.name);
            case "type":             return a.type.localeCompare(b.type);
            case "blockchainStatus": return a.blockchainStatus.localeCompare(b.blockchainStatus);
            case "version": {
                const parseVer = (v: string) => parseFloat(v.replace(/[^0-9.]/g, "")) || 0;
                return parseVer(b.version) - parseVer(a.version);
            }
            default: {
                const parse = (s: string) => { const [d,m,y] = s.split("/"); return new Date(+y,+m-1,+d).getTime(); };
                return parse(b.updatedAt) - parse(a.updatedAt);
            }
        }
    });
}

/* ─── Toast ───────────────────────────────────────────────── */
function Toast({ msg, type = "info", onClose }: { msg: string; type?: "info"|"success"|"error"; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
    return (
        <div className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] text-[13px] font-medium pointer-events-none whitespace-nowrap",
            type === "success" ? "bg-emerald-600 text-white" :
            type === "error"   ? "bg-red-600 text-white" :
                                 "bg-[#0f172a] text-white"
        )}>
            {type === "success" ? <CheckCircle2 className="w-4 h-4" /> :
             type === "error"   ? <AlertCircle  className="w-4 h-4" /> :
                                  <Info          className="w-4 h-4" />}
            {msg}
        </div>
    );
}

/* ─── FSelect ─────────────────────────────────────────────── */
function FSelect({ value, onChange, options, labels }: {
    value: string; onChange: (v: string) => void; options: string[]; labels: string[];
}) {
    return (
        <div className="relative flex-shrink-0">
            <select value={value} onChange={e => onChange(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 cursor-pointer transition-all whitespace-nowrap">
                {options.map((o, i) => <option key={o} value={o}>{labels[i]}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>
    );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function StartupDocumentsPage() {
    const router = useRouter();
    const [localDocs, setLocalDocs]       = useState<Doc[]>(MOCK_DOCS);
    const [search, setSearch]             = useState("");
    const [typeFilter, setTypeFilter]     = useState("all");
    const [visFilter, setVisFilter]       = useState("all");
    const [bcFilter, setBcFilter]         = useState("all");
    const [sortBy, setSortBy]             = useState<SortKey>("updatedAt");
    const [showUpload, setShowUpload]     = useState(false);
    const [menuState, setMenuState]       = useState<{ docId: string; x: number; y: number } | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [toast, setToast]               = useState<{ msg: string; type?: "info"|"success"|"error" } | null>(null);
    const [page, setPage]                 = useState(1);
    const PAGE_SIZE = 10;

    // Close dropdown on outside click
    useEffect(() => {
        if (!menuState) return;
        const close = () => { setMenuState(null); setDeleteConfirmId(null); };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [menuState]);

    const showToast = (msg: string, type: "info"|"success"|"error" = "info") => setToast({ msg, type });

    const filtered = localDocs.filter(d => {
        const q = search.toLowerCase();
        return (
            (!q || d.name.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q))) &&
            (typeFilter === "all" || d.type === typeFilter) &&
            (visFilter  === "all" || d.visibility === visFilter) &&
            (bcFilter   === "all" || d.blockchainStatus === bcFilter)
        );
    });
    const sorted    = sortDocs(filtered, sortBy);
    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const docs      = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const protectedCount = localDocs.filter(d => d.blockchainStatus === "recorded" || d.blockchainStatus === "matched").length;
    const pendingCount   = localDocs.filter(d => d.blockchainStatus === "pending").length;

    const openMenu = (e: React.MouseEvent, docId: string) => {
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setDeleteConfirmId(null);
        setMenuState({ docId, x: rect.right - 188, y: rect.bottom + 6 });
    };

    const handleDelete = (docId: string) => {
        setLocalDocs(prev => prev.filter(d => d.id !== docId));
        setMenuState(null);
        setDeleteConfirmId(null);
        showToast("Đã xóa tài liệu", "success");
    };

    const handleBcAction = (doc: Doc) => {
        if (doc.blockchainStatus === "mismatch") {
            showToast("Đang kiểm tra hash trên mạng Ethereum Sepolia...", "info");
        } else if (doc.blockchainStatus === "failed") {
            setLocalDocs(prev => prev.map(d => d.id === doc.id ? { ...d, blockchainStatus: "pending" } : d));
            showToast("Đã gửi lại yêu cầu ghi nhận blockchain", "success");
        }
    };

    return (
        <StartupShell>
            <div className="max-w-[1100px] mx-auto space-y-5 pb-20">

                {/* Header */}
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <h1 className="text-[22px] font-semibold text-[#0f172a] tracking-[-0.02em]">Tài liệu & IP</h1>
                        <p className="text-[13px] text-slate-500 mt-1">Quản lý tài liệu và bảo vệ tài sản trí tuệ qua blockchain.</p>
                    </div>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] text-white rounded-xl text-[13px] font-medium hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <Upload className="w-3.5 h-3.5" /> Tải lên tài liệu
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { Icon: FolderOpen,  label: "Tổng tài liệu", value: String(localDocs.length), sub: "+2 tuần này" },
                        { Icon: ShieldCheck, label: "Đã bảo vệ IP",  value: String(protectedCount),   sub: localDocs.length ? `${Math.round(protectedCount / localDocs.length * 100)}% tổng số` : "—" },
                        { Icon: Clock,       label: "Chờ xác nhận",  value: String(pendingCount),     sub: "Trên blockchain" },
                        { Icon: HardDrive,   label: "Dung lượng",    value: "2.4 GB",                 sub: "/ 5 GB" },
                    ].map(({ Icon, label, value, sub }) => (
                        <div key={label} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 py-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                                </div>
                                <span className="text-[11px] text-slate-500">{label}</span>
                            </div>
                            <p className="text-[22px] font-semibold text-[#0f172a] leading-none">{value}</p>
                            <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Filters + Sort */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-4 py-3 flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            className="w-full pl-9 pr-3 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 transition-all placeholder:text-slate-400"
                            placeholder="Tìm tên tài liệu, tags..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <FSelect value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }}
                        options={["all","Pitch Deck","Tài chính","Pháp lý","Kỹ thuật","Khác"]}
                        labels={["Loại: Tất cả","Pitch Deck","Tài chính","Pháp lý","Kỹ thuật","Khác"]} />
                    <FSelect value={visFilter} onChange={v => { setVisFilter(v); setPage(1); }}
                        options={["all","private","investors","advisors","both"]}
                        labels={["Hiển thị: Tất cả","Riêng tư","Nhà đầu tư","Cố vấn","NĐT & Cố vấn"]} />
                    <FSelect value={bcFilter} onChange={v => { setBcFilter(v); setPage(1); }}
                        options={["all","not_submitted","pending","recorded","matched","mismatch","failed"]}
                        labels={["Blockchain: Tất cả","Chưa gửi","Chờ xác nhận","Đã ghi nhận","Khớp hash","Hash lệch","Thất bại"]} />
                    <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
                    <div className="relative flex-shrink-0">
                        <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
                            className="appearance-none pl-7 pr-7 py-2 text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 cursor-pointer transition-all">
                            {SORT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                {["Tài liệu","Loại","Hiển thị","Phiên bản","Cập nhật","Blockchain",""].map((h, i) => (
                                    <th key={i} className={cn("px-5 py-3.5 text-[10px] font-medium text-slate-400 uppercase tracking-widest", i === 6 ? "text-right" : "text-left")}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {docs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <FolderOpen className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                        <p className="text-[13px] text-slate-400">Không tìm thấy tài liệu phù hợp</p>
                                    </td>
                                </tr>
                            ) : docs.map(doc => {
                                const fi  = fileIconProps(doc.name);
                                const bc  = BC[doc.blockchainStatus];
                                const vis = VIS[doc.visibility];
                                const isError = doc.blockchainStatus === "mismatch" || doc.blockchainStatus === "failed";

                                return (
                                    <tr key={doc.id} className="group hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0", fi.cls)}>
                                                    <fi.Icon className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <Link href={`/startup/documents/${doc.id}`}
                                                        className="text-[13px] font-medium text-[#0f172a] hover:underline underline-offset-2 line-clamp-1 block">
                                                        {doc.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className="text-[11px] text-slate-400">{doc.size} · {doc.uploader}</span>
                                                        {doc.tags.slice(0, 2).map(t => (
                                                            <span key={t} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{t}</span>
                                                        ))}
                                                        {doc.tags.length > 2 && <span className="text-[10px] text-slate-400">+{doc.tags.length - 2}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">{doc.type}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md border whitespace-nowrap", vis.cls)}>
                                                <vis.Icon className="w-3 h-3" /> {vis.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-[12px] font-medium text-slate-600 whitespace-nowrap">{doc.version}</td>
                                        <td className="px-4 py-4 text-[12px] text-slate-500 whitespace-nowrap">{doc.updatedAt}</td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap", bc.cls)} title={bc.hint}>
                                                    <bc.Icon className={cn("w-3 h-3 flex-shrink-0", bc.spin && "animate-spin")} />
                                                    {bc.label}
                                                </span>
                                                {doc.txHashShort && <p className="text-[10px] text-slate-400 font-mono mt-1 pl-0.5">{doc.txHashShort}</p>}
                                                {doc.lastChecked  && <p className="text-[10px] text-slate-400 mt-0.5 pl-0.5">{doc.lastChecked}</p>}
                                                {isError && bc.cta && (
                                                    <button
                                                        onClick={() => handleBcAction(doc)}
                                                        className="mt-1.5 pl-0.5 flex items-center gap-1 text-[10px] font-medium text-red-600 hover:text-red-700 transition-colors"
                                                    >
                                                        <ExternalLink className="w-2.5 h-2.5" /> {bc.cta}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/startup/documents/${doc.id}`}>
                                                    <span className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all" title="Xem chi tiết">
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </span>
                                                </Link>
                                                <button
                                                    onClick={() => showToast(`Đang tải xuống ${doc.name}...`)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                                                    title="Tải xuống"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={e => openMenu(e, doc.id)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                                                    title="Thêm thao tác"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                                                        <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[12px] text-slate-400">Hiển thị {docs.length} trong {filtered.length} tài liệu</p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={cn("w-7 h-7 flex items-center justify-center rounded-lg text-[12px] transition-all",
                                        page === p ? "bg-[#0f172a] text-white font-medium" : "text-slate-500 hover:bg-slate-100")}>
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row actions dropdown (fixed-positioned) */}
            {menuState && (() => {
                const menuDoc = localDocs.find(d => d.id === menuState.docId);
                if (!menuDoc) return null;
                const isConfirmingDelete = deleteConfirmId === menuState.docId;

                return (
                    <div
                        className="fixed z-[70] bg-white border border-slate-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1 w-[188px]"
                        style={{ left: menuState.x, top: menuState.y }}
                        onClick={e => e.stopPropagation()}
                    >
                        {isConfirmingDelete ? (
                            <div className="px-3.5 py-3 space-y-2.5">
                                <p className="text-[12px] text-slate-600 font-medium">Xóa tài liệu này?</p>
                                <p className="text-[11px] text-slate-400 leading-relaxed">Thao tác này không thể hoàn tác.</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="flex-1 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-500 hover:bg-slate-50 transition-colors"
                                    >Hủy</button>
                                    <button
                                        onClick={() => handleDelete(menuState.docId)}
                                        className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-[12px] font-medium hover:bg-red-600 transition-colors"
                                    >Xóa ngay</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link href={`/startup/documents/${menuState.docId}`}>
                                    <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors text-left">
                                        <Eye className="w-3.5 h-3.5 text-slate-400" /> Xem chi tiết
                                    </button>
                                </Link>
                                <button
                                    onClick={() => { setMenuState(null); router.push(`/startup/documents/${menuState.docId}`); }}
                                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors text-left"
                                >
                                    <Pencil className="w-3.5 h-3.5 text-slate-400" /> Sửa metadata
                                </button>
                                <button
                                    onClick={() => { setMenuState(null); setShowUpload(true); }}
                                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors text-left"
                                >
                                    <Upload className="w-3.5 h-3.5 text-slate-400" /> Tải phiên bản mới
                                </button>
                                <button
                                    onClick={() => { setMenuState(null); router.push(`/startup/documents/${menuState.docId}`); }}
                                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors text-left"
                                >
                                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Xem trạng thái blockchain
                                </button>
                                <div className="my-1 border-t border-slate-100" />
                                <button
                                    onClick={() => setDeleteConfirmId(menuState.docId)}
                                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors text-left"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Xóa tài liệu
                                </button>
                            </>
                        )}
                    </div>
                );
            })()}

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            <UploadDocumentModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
        </StartupShell>
    );
}
