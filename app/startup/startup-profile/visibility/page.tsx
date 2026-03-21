"use client";

import { useState } from "react";
import { Eye, EyeOff, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "Visible" | "Hidden" | "PendingApproval";

const STATUS_MAP = {
    Visible:         { label: "Hiển thị với nhà đầu tư",  desc: "Hồ sơ của bạn xuất hiện trong kết quả tìm kiếm. Nhà đầu tư có thể xem thông tin cơ bản và gửi yêu cầu kết nối.",          icon: Eye,    dot: "bg-emerald-500" },
    Hidden:          { label: "Ẩn khỏi nhà đầu tư",       desc: "Hồ sơ không hiển thị trong tìm kiếm. Nhà đầu tư sẽ không tìm thấy hoặc gửi kết nối đến bạn.",                              icon: EyeOff, dot: "bg-slate-400"   },
    PendingApproval: { label: "Đang chờ duyệt",            desc: "Hồ sơ đang chờ phê duyệt từ hệ thống. Sau khi được duyệt, bạn có thể bật hiển thị cho nhà đầu tư.",                         icon: Clock,  dot: "bg-amber-400"   },
};

export default function StartupVisibilityPage() {
    const [status, setStatus] = useState<Status>("Visible");
    const cfg = STATUS_MAP[status];
    const Icon = cfg.icon;
    const isPending = status === "PendingApproval";

    return (
        <div className="max-w-2xl space-y-5">
            {/* Current status banner */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-3">Trạng thái hiện tại</p>
                <div className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", cfg.dot)} />
                    <Icon className="w-4 h-4 text-slate-500" />
                    <div>
                        <p className="text-[14px] font-semibold text-[#0f172a]">{cfg.label}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5">{cfg.desc}</p>
                    </div>
                </div>
            </div>

            {/* Toggle options */}
            {!isPending && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-[13px] font-semibold text-slate-700">Thay đổi hiển thị</h3>
                        <p className="text-[12px] text-slate-400 mt-0.5">Kiểm soát việc nhà đầu tư có thể tìm thấy hồ sơ của bạn.</p>
                    </div>
                    <div className="p-4 space-y-2">
                        {(["Visible", "Hidden"] as Status[]).map(s => {
                            const c = STATUS_MAP[s];
                            const Ic = c.icon;
                            const active = status === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                                        active
                                            ? "bg-slate-900 border-slate-900 text-white"
                                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", active ? "bg-white/10" : "bg-slate-100")}>
                                        <Ic className={cn("w-4 h-4", active ? "text-white" : "text-slate-500")} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("text-[13px] font-medium", active ? "text-white" : "text-slate-700")}>
                                            {s === "Visible" ? "Hiển thị hồ sơ" : "Ẩn hồ sơ"}
                                        </p>
                                        <p className={cn("text-[11px] mt-0.5", active ? "text-white/60" : "text-slate-400")}>
                                            {s === "Visible" ? "Nhà đầu tư có thể tìm thấy và xem hồ sơ của bạn." : "Hồ sơ sẽ không xuất hiện trong tìm kiếm."}
                                        </p>
                                    </div>
                                    {active && <CheckCircle2 className="w-4 h-4 text-white/80 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Privacy note */}
            <div className="flex items-start gap-3 px-5 py-4 bg-slate-50 rounded-xl border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-[12px] font-medium text-slate-600">Quyền riêng tư được bảo vệ</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Khi hồ sơ ở trạng thái &quot;Hiển thị&quot;, nhà đầu tư chỉ xem được thông tin cơ bản. Tài liệu tài chính và thông tin KYC chỉ chia sẻ qua kết nối được phê duyệt.
                    </p>
                </div>
            </div>
        </div>
    );
}
