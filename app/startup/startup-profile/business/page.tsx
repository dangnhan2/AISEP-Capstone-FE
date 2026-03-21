"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const MARKET_SCOPE = ["B2B", "B2C", "B2G", "B2B2C"];
const PRODUCT_STATUS = ["Concept", "Prototype", "MVP", "Beta", "Launched", "Scaling"];
const NEEDS = ["Funding", "Mentorship", "Talent", "Partnership", "Market Access", "Technical Support", "Legal Advisory"];

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all resize-none";
const labelCls = "block text-[12px] font-medium text-slate-500 mb-1.5";

function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-[13px] font-semibold text-slate-700">{title}</h3>
                {description && <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

export default function StartupBusinessPage() {
    const [form, setForm] = useState({
        problemStatement: "Các doanh nghiệp SME tại Đông Nam Á đang lãng phí hàng triệu giờ nhân công vào các tác vụ lặp đi lặp lại, thiếu công cụ tự động hóa phù hợp.",
        solutionSummary: "Nền tảng AI plug-and-play giúp SMEs tự động hóa quy trình mà không cần đội ngũ kỹ thuật, triển khai trong 30 phút.",
        marketScope: "B2B", productStatus: "MVP",
    });
    const [needs, setNeeds] = useState<string[]>(["Funding", "Partnership", "Market Access"]);

    const set = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    const toggle = (n: string) => setNeeds(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);

    return (
        <div className="space-y-5">
            <FormSection title="Vấn đề & Giải pháp" description="Mô tả rõ vấn đề bạn đang giải quyết và cách tiếp cận của startup.">
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Vấn đề đang giải quyết</label>
                        <textarea name="problemStatement" value={form.problemStatement} onChange={set} rows={3} className={inputCls} placeholder="Vấn đề mà startup đang giải quyết trên thị trường..." maxLength={500} />
                        <p className="text-[11px] text-slate-400 mt-1">{form.problemStatement.length}/500</p>
                    </div>
                    <div>
                        <label className={labelCls}>Tóm tắt giải pháp</label>
                        <textarea name="solutionSummary" value={form.solutionSummary} onChange={set} rows={3} className={inputCls} placeholder="Giải pháp của bạn giải quyết vấn đề trên như thế nào..." maxLength={500} />
                        <p className="text-[11px] text-slate-400 mt-1">{form.solutionSummary.length}/500</p>
                    </div>
                </div>
            </FormSection>

            <FormSection title="Thị trường & Sản phẩm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Phạm vi thị trường</label>
                        <select name="marketScope" value={form.marketScope} onChange={set} className={inputCls.replace("resize-none", "")}>
                            <option value="">Chọn phạm vi</option>
                            {MARKET_SCOPE.map(o => <option key={o}>{o}</option>)}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">Mô hình kinh doanh chính của startup.</p>
                    </div>
                    <div>
                        <label className={labelCls}>Trạng thái sản phẩm</label>
                        <select name="productStatus" value={form.productStatus} onChange={set} className={inputCls.replace("resize-none", "")}>
                            <option value="">Chọn trạng thái</option>
                            {PRODUCT_STATUS.map(o => <option key={o}>{o}</option>)}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">Sản phẩm đang ở giai đoạn nào.</p>
                    </div>
                </div>
            </FormSection>

            <FormSection title="Nhu cầu hiện tại" description="Chọn những gì startup đang cần hỗ trợ nhất.">
                <div className="flex flex-wrap gap-2">
                    {NEEDS.map(n => {
                        const active = needs.includes(n);
                        return (
                            <button
                                key={n}
                                type="button"
                                onClick={() => toggle(n)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[13px] font-medium transition-all border",
                                    active
                                        ? "bg-[#0f172a] text-white border-[#0f172a] shadow-sm"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                                )}
                            >
                                {n}
                            </button>
                        );
                    })}
                </div>
                {needs.length > 0 && (
                    <p className="text-[11px] text-slate-400 mt-3">Đã chọn {needs.length} nhu cầu</p>
                )}
            </FormSection>
        </div>
    );
}
