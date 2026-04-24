"use client";

import { useEffect, useState } from "react";
import { StartupShell } from "@/components/startup/startup-shell";
import { CheckCircle2, Lock, Shield, ShieldCheck, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChangePasswordModal } from "@/components/startup/change-password-modal";
import { GetMe } from "@/services/user/user.api";

/* ─── SectionCard component (consistent with investor/advisor) ── */
function SectionCard({ title, icon: Icon, description, children, id }: {
    title: string;
    icon: React.ElementType;
    description?: string;
    children: React.ReactNode;
    id?: string;
}) {
    return (
        <div id={id} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden scroll-mt-24">
            <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                        <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[15px] font-bold text-slate-800">{title}</p>
                </div>
                {description && <p className="text-[12px] text-slate-400 ml-9">{description}</p>}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function StartupSettingsPage() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [userInfo, setUserInfo] = useState<IUser | null>(null);
    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);

    useEffect(() => {
        let isDisposed = false;

        GetMe()
            .then((res) => {
                if (!isDisposed && res && (res.success || res.isSuccess) && res.data) {
                    setUserInfo(res.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                if (!isDisposed) {
                    setIsLoadingUserInfo(false);
                }
            });

        return () => {
            isDisposed = true;
        };
    }, []);

    return (
        <StartupShell>
            <div className="max-w-[760px] mx-auto space-y-5 pb-20">

                {/* ── Page header ── */}
                <div className="mb-6">
                    <h1 className="text-[22px] font-semibold text-slate-800 tracking-[-0.02em]">Cài đặt tài khoản</h1>
                    <p className="text-[13px] text-slate-500 mt-1">Quản lý mật khẩu và bảo mật tài khoản startup của bạn.</p>
                </div>

                {/* ── Account Info card ── */}
                <SectionCard title="Thông tin tài khoản" icon={User} description="Trạng thái tài khoản và thông tin đăng nhập hệ thống.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[12px] font-medium text-slate-400 uppercase tracking-wider">Địa chỉ Email</p>
                            <div className="flex items-center gap-2">
                                <p className="text-[14px] font-semibold text-slate-700">{userInfo?.email ?? "—"}</p>
                                {userInfo?.emailVerified && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        Đã xác minh
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[12px] font-medium text-slate-400 uppercase tracking-wider">Vai trò tài khoản</p>
                            <p className="text-[14px] font-semibold text-slate-700 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                {userInfo?.userType ? `${userInfo.userType} (Startup)` : "Startup"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[12px] font-medium text-slate-400 uppercase tracking-wider">Trạng thái</p>
                            <span className={cn(
                                "inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold",
                                isLoadingUserInfo
                                    ? "bg-slate-100 text-slate-500"
                                    : !userInfo
                                        ? "bg-slate-100 text-slate-500"
                                        : userInfo.isActive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-red-50 text-red-700"
                            )}>
                                {isLoadingUserInfo
                                    ? "Đang tải..."
                                    : !userInfo
                                        ? "Chưa xác định"
                                        : userInfo.isActive
                                            ? "Đang hoạt động (Active)"
                                            : "Không hoạt động (Inactive)"}
                            </span>
                        </div>
                    </div>
                </SectionCard>

                {/* ── Security card ── */}
                <SectionCard title="Bảo mật" icon={Shield} description="Quản lý mật khẩu và bảo vệ tài khoản.">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                                <Lock className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[13px] font-medium text-slate-700">Mật khẩu đăng nhập</p>
                                <p className="text-[12px] text-slate-400 mt-0.5">Cập nhật mật khẩu định kỳ để tăng tính bảo mật cho tài khoản.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all whitespace-nowrap"
                        >
                            Đổi mật khẩu <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    </div>
                </SectionCard>

                {/* ── Footer ── */}
                <div className="pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                    <span>AISEP Startup Platform</span>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-slate-600 transition-colors">Điều khoản</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Chính sách bảo mật</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Hỗ trợ</a>
                    </div>
                </div>
            </div>

            {/* ── Change Password Modal ── */}
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSuccess={() => {
                    setShowPasswordModal(false);
                    toast.success("Mật khẩu đã được cập nhật thành công.");
                }}
            />

        </StartupShell>
    );
}
