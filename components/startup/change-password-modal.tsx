"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Lock, X, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const inputCls = (hasError: boolean) =>
    cn(
        "w-full bg-slate-50 border rounded-xl px-4 py-2.5 pr-11 text-[13px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all",
        hasError ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/10" : "border-slate-200"
    );

const POLICY = [
    { rule: (p: string) => p.length >= 8,       label: "Ít nhất 8 ký tự" },
    { rule: (p: string) => /[A-Z]/.test(p),      label: "Có chữ hoa" },
    { rule: (p: string) => /[0-9]/.test(p),      label: "Có chữ số" },
];

function PasswordField({
    label, name, value, onChange, placeholder, error, hint,
}: {
    label: string; name: string; value: string;
    onChange: (v: string) => void; placeholder: string;
    error?: string; hint?: React.ReactNode;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            <label className="block text-[12px] font-medium text-slate-500">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={inputCls(!!error)}
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                </p>
            )}
            {hint}
        </div>
    );
}

export function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
    const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" });
    const [errors, setErrors] = useState<Partial<typeof form>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setForm({ current: "", newPwd: "", confirm: "" });
            setErrors({});
            setSubmitting(false);
        }
    }, [isOpen]);

    const validate = () => {
        const errs: Partial<typeof form> = {};
        if (!form.current) errs.current = "Vui lòng nhập mật khẩu hiện tại.";
        if (!form.newPwd) errs.newPwd = "Vui lòng nhập mật khẩu mới.";
        else if (form.newPwd.length < 8) errs.newPwd = "Mật khẩu phải có ít nhất 8 ký tự.";
        if (!form.confirm) errs.confirm = "Vui lòng xác nhận mật khẩu mới.";
        else if (form.confirm !== form.newPwd) errs.confirm = "Mật khẩu xác nhận không khớp.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            onSuccess();
        }, 700);
    };

    const policyChecks = POLICY.map(p => ({ ...p, passed: p.rule(form.newPwd) }));
    const canSubmit = form.current && form.newPwd && form.confirm && !submitting;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.12)] w-full max-w-md mx-4 overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-slate-600" />
                        </div>
                        <h2 className="text-[15px] font-semibold text-[#0f172a]">Đổi mật khẩu</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <PasswordField
                        label="Mật khẩu hiện tại"
                        name="current"
                        value={form.current}
                        onChange={v => { setForm(p => ({ ...p, current: v })); setErrors(e => ({ ...e, current: undefined })); }}
                        placeholder="Nhập mật khẩu hiện tại"
                        error={errors.current}
                    />

                    <PasswordField
                        label="Mật khẩu mới"
                        name="newPwd"
                        value={form.newPwd}
                        onChange={v => { setForm(p => ({ ...p, newPwd: v })); setErrors(e => ({ ...e, newPwd: undefined })); }}
                        placeholder="Tối thiểu 8 ký tự"
                        error={errors.newPwd}
                        hint={
                            form.newPwd ? (
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    {policyChecks.map(({ label, passed }) => (
                                        <span key={label} className={cn("flex items-center gap-1 text-[11px]", passed ? "text-emerald-600" : "text-slate-400")}>
                                            <CheckCircle2 className="w-3 h-3" /> {label}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[11px] text-slate-400 mt-0.5">Tối thiểu 8 ký tự, bao gồm chữ hoa và chữ số.</p>
                            )
                        }
                    />

                    <PasswordField
                        label="Xác nhận mật khẩu mới"
                        name="confirm"
                        value={form.confirm}
                        onChange={v => { setForm(p => ({ ...p, confirm: v })); setErrors(e => ({ ...e, confirm: undefined })); }}
                        placeholder="Nhập lại mật khẩu mới"
                        error={errors.confirm}
                    />
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
                        disabled={!canSubmit}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all shadow-sm",
                            canSubmit
                                ? "bg-[#0f172a] text-white hover:bg-slate-800"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        {submitting ? "Đang lưu..." : "Cập nhật mật khẩu"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Keep SuccessModal export for backward compatibility (no longer used)
export function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    return null;
}
