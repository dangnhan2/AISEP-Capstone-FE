"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, FileText, IdCard, CheckCircle2, Trash2, X, Upload } from "lucide-react";

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all";
const labelCls = "block text-[12px] font-medium text-slate-500 mb-1.5";

interface DocStatus { name: string; size: string; state: "uploaded" | "uploading" | "empty"; progress?: number }

export default function StartupKYCPage() {
    const [mst, setMst] = useState("0101234567");
    const [rep, setRep] = useState("Nguyễn Văn Alpha");
    const [docs, setDocs] = useState<Record<string, DocStatus>>({
        gpkd: { name: "GPKD_TechAlpha.pdf", size: "2.4 MB", state: "uploaded" },
        cccd: { name: "", size: "", state: "empty" },
        charter: { name: "Dieu_le_Startup.pdf", size: "4.1 MB", state: "uploading", progress: 65 },
    });

    const DOC_DEFS = [
        { key: "gpkd",    label: "Giấy phép kinh doanh (GPKD)", required: true,  icon: FileText },
        { key: "cccd",    label: "CCCD người đại diện",          required: true,  icon: IdCard  },
        { key: "charter", label: "Điều lệ công ty",              required: false, icon: FileText },
    ];

    return (
        <div className="space-y-5">
            {/* Status banner */}
            <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 rounded-xl border border-amber-200/60">
                <ShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-[12px] font-medium text-amber-700">
                    Hồ sơ KYC chưa hoàn chỉnh. Vui lòng cung cấp đầy đủ thông tin pháp lý để tăng tính minh bạch với nhà đầu tư.
                </p>
            </div>

            {/* Business identity */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <h3 className="text-[13px] font-semibold text-slate-700">Thông tin định danh doanh nghiệp</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Mã số thuế (MST) <span className="text-red-400">*</span></label>
                        <input value={mst} onChange={e => setMst(e.target.value)} className={inputCls} placeholder="0101234567" />
                        <p className="text-[11px] text-slate-400 mt-1">Mã số doanh nghiệp 10 số theo giấy ĐKKD.</p>
                    </div>
                    <div>
                        <label className={labelCls}>Người đại diện pháp luật <span className="text-red-400">*</span></label>
                        <input value={rep} onChange={e => setRep(e.target.value)} className={inputCls} placeholder="Họ và tên đầy đủ" />
                        <p className="text-[11px] text-slate-400 mt-1">Ghi chính xác như trên giấy phép kinh doanh.</p>
                    </div>
                </div>
            </div>

            {/* Legal documents */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                        <h3 className="text-[13px] font-semibold text-slate-700">Tài liệu pháp lý</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Tải lên bản quét hoặc ảnh chụp rõ nét. PDF, JPG, PNG · Tối đa 10MB.</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    {DOC_DEFS.map(({ key, label, required, icon: Icon }) => {
                        const doc = docs[key];
                        return (
                            <div key={key} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className={labelCls + " !mb-0"}>
                                        {label}
                                        {required ? <span className="text-red-400 ml-0.5">*</span> : <span className="text-slate-400 ml-1">(Không bắt buộc)</span>}
                                    </label>
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">PDF · JPG · PNG</span>
                                </div>

                                {doc.state === "empty" ? (
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                            <Upload className="w-4.5 h-4.5 text-slate-400" />
                                        </div>
                                        <p className="text-[13px] font-medium text-slate-600">Kéo thả hoặc click để tải lên</p>
                                        <p className="text-[11px] text-slate-400">Tối đa 10MB</p>
                                    </div>
                                ) : (
                                    <div className={cn("border rounded-xl p-4 space-y-3", doc.state === "uploaded" ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50/50")}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", doc.state === "uploaded" ? "bg-[#fdfbe9]" : "bg-slate-100")}>
                                                <Icon className={cn("w-5 h-5", doc.state === "uploaded" ? "text-[#e6cc4c]" : "text-slate-400")} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-medium text-slate-700 truncate">{doc.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[11px] text-slate-400">{doc.size}</span>
                                                    {doc.state === "uploaded" && (
                                                        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                                                            <CheckCircle2 className="w-3 h-3" /> Đã tải lên
                                                        </span>
                                                    )}
                                                    {doc.state === "uploading" && (
                                                        <span className="text-[10px] font-medium text-[#e6cc4c] animate-pulse">
                                                            Đang tải lên {doc.progress}%...
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setDocs(p => ({ ...p, [key]: { ...p[key], state: "empty", name: "", size: "" } }))}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0"
                                            >
                                                {doc.state === "uploaded" ? <Trash2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                        {doc.state === "uploading" && (
                                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#e6cc4c] rounded-full transition-all" style={{ width: `${doc.progress}%` }} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="px-6 pb-5 flex items-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    Mọi thông tin được mã hóa và bảo mật theo chính sách AISEP. Chỉ dùng cho mục đích xác thực tính chính danh của Startup.
                </div>
            </div>
        </div>
    );
}
