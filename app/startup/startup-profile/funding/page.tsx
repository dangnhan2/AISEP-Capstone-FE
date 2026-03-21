"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all";
const labelCls = "block text-[12px] font-medium text-slate-500 mb-1.5";

export default function StartupFundingPage() {
    const [form, setForm] = useState({ fundingStage: "", fundingNeeded: "", fundingRaised: "", valuation: "" });
    const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const raised = Number(form.fundingRaised) || 0;
    const needed = Number(form.fundingNeeded) || 0;
    const pct = needed > 0 ? Math.min(100, Math.round((raised / needed) * 100)) : 0;

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-[13px] font-semibold text-slate-700">Thông tin gọi vốn</h3>
                    <p className="text-[12px] text-slate-400 mt-0.5">Thông tin tài chính chính xác giúp AI của AISEP đánh giá startup tốt hơn.</p>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Giai đoạn gọi vốn <span className="text-red-400">*</span></label>
                            <select name="fundingStage" value={form.fundingStage} onChange={set} className={inputCls}>
                                <option value="">Chọn giai đoạn</option>
                                {["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"].map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Định giá công ty (USD)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">$</span>
                                <input name="valuation" type="number" placeholder="2,000,000" value={form.valuation} onChange={set} className={cn(inputCls, "pl-8")} />
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">Pre-money hoặc Post-money</p>
                        </div>
                        <div>
                            <label className={labelCls}>Số vốn cần huy động (USD) <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">$</span>
                                <input name="fundingNeeded" type="number" placeholder="500,000" value={form.fundingNeeded} onChange={set} className={cn(inputCls, "pl-8")} />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Số vốn đã huy động (USD)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">$</span>
                                <input name="fundingRaised" type="number" placeholder="100,000" value={form.fundingRaised} onChange={set} className={cn(inputCls, "pl-8")} />
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    {needed > 0 && (
                        <div className="pt-2">
                            <div className="flex justify-between items-center mb-1.5">
                                <p className="text-[12px] text-slate-500 font-medium">Tiến độ huy động</p>
                                <p className="text-[12px] font-semibold text-slate-700">{pct}%</p>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#e6cc4c] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-[10px] text-slate-400">${raised.toLocaleString()} đã huy động</span>
                                <span className="text-[10px] text-slate-400">Mục tiêu ${needed.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
