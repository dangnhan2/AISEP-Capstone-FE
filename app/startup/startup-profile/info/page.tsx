"use client";

import { useState, useRef } from "react";
import { Building2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRY_OPTIONS = ["SaaS", "Fintech", "HealthTech", "EdTech", "E-commerce", "AgriTech", "CleanTech", "PropTech", "LogiTech", "FoodTech", "AI/ML", "Blockchain", "IoT", "Cybersecurity", "Media & Entertainment", "Other"];
const STAGE_OPTIONS = ["Ý tưởng (Idea)", "Tiền khởi nghiệp (Pre-seed)", "Sản phẩm thử nghiệm (MVP)", "Giai đoạn sớm (Early Stage)", "Tăng trưởng (Growth)", "Mở rộng (Expansion)"];
const COUNTRY_OPTIONS = [{ value: "VN", label: "Việt Nam" }, { value: "SG", label: "Singapore" }, { value: "US", label: "Hoa Kỳ" }, { value: "JP", label: "Nhật Bản" }, { value: "KR", label: "Hàn Quốc" }, { value: "TH", label: "Thái Lan" }, { value: "ID", label: "Indonesia" }];

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all";
const labelCls = "block text-[12px] font-medium text-slate-500 mb-1.5";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-[13px] font-semibold text-slate-700">{title}</h3>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

export default function StartupInfoPage() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const [form, setForm] = useState({
        companyName: "TechAlpha Co.", oneLiner: "Giải pháp AI toàn diện cho doanh nghiệp SMEs",
        description: "Chúng tôi cung cấp các giải pháp trí tuệ nhân tạo giúp tự động hóa quy trình vận hành và tối ưu hóa chi phí cho các doanh nghiệp vừa và nhỏ tại khu vực Đông Nam Á.",
        industry: "SaaS", subIndustry: "Artificial Intelligence", stage: "Sản phẩm thử nghiệm (MVP)",
        foundedDate: "2023-01-15", teamSize: "12",
        address: "Toà nhà Innovation, Công viên phần mềm Quang Trung",
        country: "VN", website: "https://techalpha.ai", linkedInURL: "https://linkedin.com/company/techalpha",
        productUrl: "", demoUrl: "", contactEmail: "contact@techalpha.ai", contactPhone: "+84 909 123 456",
    });

    const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    return (
        <div className="space-y-5">
            {/* Logo */}
            <FormSection title="Logo công ty">
                <div className="flex items-center gap-6">
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="relative w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer hover:border-slate-400 transition-all group flex-shrink-0"
                    >
                        {logo
                            ? <img src={logo} alt="logo" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-7 h-7 text-slate-300 group-hover:text-slate-400 transition-colors" /></div>
                        }
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[12px] font-medium hover:bg-slate-700 transition-colors">
                            Chọn ảnh
                        </button>
                        <p className="text-[11px] text-slate-400 mt-1.5">PNG, JPG, WEBP · Tối đa 5MB · Khuyến nghị 400×400px</p>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setLogo(URL.createObjectURL(f)); }} />
                </div>
            </FormSection>

            {/* General */}
            <FormSection title="Thông tin chung">
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Tên công ty <span className="text-red-400">*</span></label>
                        <input name="companyName" value={form.companyName} onChange={set} className={inputCls} placeholder="Tên chính thức của startup" />
                    </div>
                    <div>
                        <label className={labelCls}>Tagline / One-liner <span className="text-red-400">*</span></label>
                        <input name="oneLiner" value={form.oneLiner} onChange={set} className={inputCls} placeholder="Mô tả startup trong 1 câu" maxLength={120} />
                        <p className="text-[11px] text-slate-400 mt-1">{form.oneLiner.length}/120</p>
                    </div>
                    <div>
                        <label className={labelCls}>Mô tả chi tiết <span className="text-red-400">*</span></label>
                        <textarea name="description" value={form.description} onChange={set} rows={4} className={cn(inputCls, "resize-none")} placeholder="Giới thiệu sản phẩm, giải pháp và tầm nhìn..." />
                    </div>
                </div>
            </FormSection>

            {/* Industry & Stage */}
            <FormSection title="Ngành & Giai đoạn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Ngành nghề <span className="text-red-400">*</span></label>
                        <select name="industry" value={form.industry} onChange={set} className={inputCls}>
                            <option value="">Chọn ngành</option>
                            {INDUSTRY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Ngành phụ</label>
                        <input name="subIndustry" value={form.subIndustry} onChange={set} className={inputCls} placeholder="Ví dụ: AI, Blockchain" />
                    </div>
                    <div>
                        <label className={labelCls}>Giai đoạn <span className="text-red-400">*</span></label>
                        <select name="stage" value={form.stage} onChange={set} className={inputCls}>
                            <option value="">Chọn giai đoạn</option>
                            {STAGE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Ngày thành lập <span className="text-red-400">*</span></label>
                        <input name="foundedDate" type="date" value={form.foundedDate} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Quy mô team <span className="text-red-400">*</span></label>
                        <input name="teamSize" type="number" value={form.teamSize} onChange={set} className={inputCls} placeholder="Số nhân sự" min={1} />
                    </div>
                </div>
            </FormSection>

            {/* Location & Links */}
            <FormSection title="Địa điểm & Liên kết">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className={labelCls}>Địa chỉ văn phòng <span className="text-red-400">*</span></label>
                        <input name="address" value={form.address} onChange={set} className={inputCls} placeholder="Số nhà, đường, quận/huyện..." />
                    </div>
                    <div>
                        <label className={labelCls}>Quốc gia <span className="text-red-400">*</span></label>
                        <select name="country" value={form.country} onChange={set} className={inputCls}>
                            {COUNTRY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Website <span className="text-red-400">*</span></label>
                        <input name="website" type="url" value={form.website} onChange={set} className={inputCls} placeholder="https://example.com" />
                    </div>
                    <div>
                        <label className={labelCls}>LinkedIn</label>
                        <input name="linkedInURL" type="url" value={form.linkedInURL} onChange={set} className={inputCls} placeholder="https://linkedin.com/company/..." />
                    </div>
                    <div>
                        <label className={labelCls}>Link sản phẩm</label>
                        <input name="productUrl" type="url" value={form.productUrl} onChange={set} className={inputCls} placeholder="https://product.example.com" />
                    </div>
                    <div>
                        <label className={labelCls}>Link demo</label>
                        <input name="demoUrl" type="url" value={form.demoUrl} onChange={set} className={inputCls} placeholder="https://demo.example.com" />
                    </div>
                </div>
            </FormSection>

            {/* Contact */}
            <FormSection title="Thông tin liên hệ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Email liên hệ <span className="text-red-400">*</span></label>
                        <input name="contactEmail" type="email" value={form.contactEmail} onChange={set} className={inputCls} placeholder="contact@startup.com" />
                    </div>
                    <div>
                        <label className={labelCls}>Số điện thoại</label>
                        <input name="contactPhone" type="tel" value={form.contactPhone} onChange={set} className={inputCls} placeholder="+84 xxx xxx xxx" />
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
