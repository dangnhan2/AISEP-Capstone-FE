"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, User, Edit2, Trash2 } from "lucide-react";
import { TeamMemberModal } from "@/components/startup/team-member-modal";

interface TeamMember { id?: string; name: string; roles: string[]; description: string; title: string; status: string; avatar: string; linkedin: string; }

const VALIDATION_OPTIONS = [
    { value: "", label: "Chọn trạng thái" },
    { value: "Not Validated", label: "Chưa xác thực" },
    { value: "In Progress", label: "Đang xác thực" },
    { value: "Validated", label: "Đã xác thực" },
];

const INITIAL: TeamMember[] = [
    { id: "1", name: "Nguyễn Văn An", roles: ["Founder"], description: "Hơn 10 năm kinh nghiệm trong lĩnh vực Fintech. Cựu giám đốc sản phẩm tại tập đoàn đa quốc gia.", title: "CEO & Co-founder", status: "Toàn thời gian", avatar: "", linkedin: "https://linkedin.com" },
    { id: "2", name: "Trần Thị Bình", roles: [], description: "Chuyên gia AI/ML với nhiều công bố khoa học quốc tế. Từng làm việc tại Silicon Valley.", title: "CTO", status: "Toàn thời gian", avatar: "", linkedin: "" },
];

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all";
const labelCls = "block text-[12px] font-medium text-slate-500 mb-1.5";

export default function StartupTeamPage() {
    const [team, setTeam] = useState<TeamMember[]>(INITIAL);
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState<TeamMember | null>(null);
    const [validation, setValidation] = useState("In Progress");
    const [metrics, setMetrics] = useState("MRR $8K · 450 MAU · tăng trưởng 18%/tháng · churn 4%");

    const openAdd = () => { setSelected(null); setModal(true); };
    const openEdit = (m: TeamMember) => { setSelected(m); setModal(true); };
    const remove = (id: string) => setTeam(p => p.filter(m => m.id !== id));
    const save = (d: TeamMember) => {
        if (selected) setTeam(p => p.map(m => m.id === selected.id ? { ...d, id: m.id } : m));
        else setTeam(p => [...p, { ...d, id: Math.random().toString(36).slice(2) }]);
        setModal(false);
    };

    return (
        <div className="space-y-5 pb-20">
            {/* Team table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-[13px] font-semibold text-slate-700">Đội ngũ sáng lập & nhân sự chủ chốt</h3>
                        <p className="text-[12px] text-slate-400 mt-0.5">Hồ sơ có ≥ 2 founder thường được nhà đầu tư đánh giá cao hơn.</p>
                    </div>
                    <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f172a] text-white text-[12px] font-medium hover:bg-slate-800 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Thêm thành viên
                    </button>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Thành viên</th>
                            <th className="px-6 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Chức danh</th>
                            <th className="px-6 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">LinkedIn</th>
                            <th className="px-6 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {team.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {m.avatar ? <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-slate-400" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[13px] font-medium text-slate-700">{m.name}</p>
                                                {m.roles.map(r => (
                                                    <span key={r} className="px-1.5 py-0.5 bg-[#fdfbe9] text-[#171611] text-[10px] font-medium rounded-md border border-[#e6cc4c]/25">{r}</span>
                                                ))}
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{m.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-[13px] font-medium text-slate-700">{m.title}</p>
                                    <p className="text-[11px] text-slate-400">{m.status}</p>
                                </td>
                                <td className="px-6 py-4">
                                    {m.linkedin ? (
                                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                            <svg className="w-3.5 h-3.5 fill-blue-600" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                        </a>
                                    ) : (
                                        <span className="text-[12px] text-slate-300">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => openEdit(m)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => m.id && remove(m.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Validation & Metrics */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-[13px] font-semibold text-slate-700">Xác thực & Chỉ số traction</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className={labelCls}>Trạng thái xác thực</label>
                        <select value={validation} onChange={e => setValidation(e.target.value)} className={inputCls}>
                            {VALIDATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">Mức độ xác thực dữ liệu kinh doanh từ bên thứ ba hoặc hệ thống AISEP.</p>
                    </div>
                    <div>
                        <label className={labelCls}>Tóm tắt chỉ số (Metric Summary)</label>
                        <textarea
                            value={metrics}
                            onChange={e => setMetrics(e.target.value)}
                            rows={2}
                            className={cn(inputCls, "resize-none font-mono")}
                            placeholder="VD: MRR $15K · 2000 MAU · tăng trưởng 20%/tháng · churn 3%..."
                            maxLength={300}
                        />
                        <p className="text-[11px] text-slate-400 mt-1">{metrics.length}/300</p>
                    </div>
                </div>
            </div>

            <TeamMemberModal isOpen={modal} onClose={() => setModal(false)} onSave={save} member={selected} />
        </div>
    );
}
