"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X, Camera, Link2, UserPlus, Pencil } from "lucide-react";

interface TeamMember {
    id?: string;
    name: string;
    roles: string[];
    description: string;
    title: string;
    status: string;
    avatar: string;
    linkedin: string;
}

interface TeamMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (member: TeamMember) => void;
    member?: TeamMember | null;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all";
const labelCls = "block text-[12px] font-medium text-slate-500 mb-1.5";

const ROLES = ["Founder", "Co-founder", "Board Member", "Investor"];

export function TeamMemberModal({ isOpen, onClose, onSave, member }: TeamMemberModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setForm(p => ({ ...p, avatar: url }));
    };

    const [form, setForm] = useState<TeamMember>({
        name: "", roles: [], description: "", title: "",
        status: "Toàn thời gian", avatar: "", linkedin: ""
    });

    useEffect(() => {
        setForm(member ?? {
            name: "", roles: [], description: "", title: "",
            status: "Toàn thời gian", avatar: "", linkedin: ""
        });
    }, [member, isOpen]);

    const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const toggleRole = (role: string) =>
        setForm(p => ({
            ...p,
            roles: p.roles.includes(role) ? p.roles.filter(r => r !== role) : [...p.roles, role]
        }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.12)] w-full max-w-xl mx-4 overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            {member ? <Pencil className="w-4 h-4 text-slate-600" /> : <UserPlus className="w-4 h-4 text-slate-600" />}
                        </div>
                        <h2 className="text-[15px] font-semibold text-[#0f172a] tracking-tight">
                            {member ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">

                    {/* Avatar + Name + Title */}
                    <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <label className={labelCls}>Ảnh đại diện</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-[72px] h-[72px] rounded-xl bg-slate-100 border border-slate-200 border-dashed flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative group overflow-hidden"
                            >
                                {form.avatar
                                    ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    : <Camera className="w-5 h-5 text-slate-400" />
                                }
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Name + Title */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <label className={labelCls}>Họ và tên <span className="text-red-400">*</span></label>
                                <input name="name" value={form.name} onChange={set} className={inputCls} placeholder="Nhập họ tên đầy đủ" required />
                            </div>
                            <div>
                                <label className={labelCls}>Chức danh / Vị trí <span className="text-red-400">*</span></label>
                                <input name="title" value={form.title} onChange={set} className={inputCls} placeholder="VD: CEO, CTO, Head of Product..." required />
                            </div>
                        </div>
                    </div>

                    {/* Status + LinkedIn */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Loại nhân sự</label>
                            <select name="status" value={form.status} onChange={set} className={inputCls}>
                                <option>Toàn thời gian</option>
                                <option>Bán thời gian</option>
                                <option>Cố vấn</option>
                                <option>Thực tập sinh</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>LinkedIn URL</label>
                            <div className="relative">
                                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input name="linkedin" value={form.linkedin} onChange={set} className={cn(inputCls, "pl-9")} placeholder="https://linkedin.com/in/..." />
                            </div>
                        </div>
                    </div>

                    {/* Roles */}
                    <div>
                        <label className={labelCls}>Vai trò đặc biệt</label>
                        <div className="flex flex-wrap gap-2">
                            {ROLES.map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => toggleRole(role)}
                                    className={cn(
                                        "px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all border",
                                        form.roles.includes(role)
                                            ? "bg-[#0f172a] text-white border-[#0f172a]"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className={labelCls}>Tiểu sử ngắn gọn</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={set}
                            rows={3}
                            className={cn(inputCls, "resize-none")}
                            placeholder="Giới thiệu kinh nghiệm, học vấn hoặc thành tựu nổi bật..."
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-5 py-2.5 rounded-xl bg-[#0f172a] text-white text-[13px] font-medium hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        {member ? "Cập nhật" : "Lưu thành viên"}
                    </button>
                </div>
            </div>
        </div>
    );
}
