"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Camera, User, Briefcase, Globe, Linkedin, FileText,
  Sparkles, Check, ShieldCheck, KeyRound, AlertCircle,
  Loader2, CheckCircle2, Eye, EyeOff, CreditCard, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvisorShell } from "@/components/advisor/advisor-shell";
import { ChangePassword } from "@/services/auth/auth.api";
import {
  CreateAdvisorProfile,
  UpdateAdvisorProfile,
  GetAdvisorProfile,
  UpdateAdvisorAvailability,
} from "@/services/advisor/advisor.api";

/* ─── Constants ──────────────────────────────────────────────── */

const MOCK_INDUSTRIES = [
  { id: 1, name: "AI & Technology" },
  { id: 2, name: "Fintech" },
  { id: 3, name: "Healthcare" },
  { id: 4, name: "E-commerce" },
  { id: 5, name: "EdTech" },
  { id: 6, name: "ClimateTech" },
];

/* ─── Completeness ───────────────────────────────────────────── */

function calcCompleteness(f: {
  name: string; title: string;
  linkedInURL: string;
  industryFocus: number[]; bio: string; mentorshipPhilosophy: string;
  isAcceptingNewMentees: boolean; weeklyAvailableHours: number;
}) {
  const checks = [
    Boolean(f.name?.trim()),
    Boolean(f.title?.trim()),
    Boolean(f.linkedInURL?.trim()),
    f.industryFocus.length > 0,
    Boolean(f.bio?.trim()),
    Boolean(f.mentorshipPhilosophy?.trim()),
    !f.isAcceptingNewMentees || (f.weeklyAvailableHours > 0),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

/* ─── Sub-components ─────────────────────────────────────────── */

function SectionCard({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <p className="text-[14px] font-bold text-slate-800">{title}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

const inputClass = (hasError = false) => cn(
  "w-full h-11 px-4 rounded-xl border text-[13px] text-slate-700 placeholder:text-slate-300 outline-none transition-all bg-white",
  "focus:border-[#eec54e] focus:ring-2 focus:ring-[#eec54e]/20",
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  hasError ? "border-red-300 bg-red-50/40" : "border-slate-200"
);

/* ─── Main Component ─────────────────────────────────────────── */

export default function AdvisorProfileClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── State ─────────────────────────────────────────────────── */
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", title: "", bio: "", mentorshipPhilosophy: "",
    linkedInURL: "", industryFocus: [] as number[],
    sessionFormats: "Online", typicalSessionDuration: 60,
    weeklyAvailableHours: 5, maxConcurrentMentees: 2,
    responseTimeCommitment: "24h", isAcceptingNewMentees: false,
  });

  const [hasProfile, setHasProfile] = useState(false);

  const [profileCompletion, setProfileCompletion] = useState<number | null>(null);

  /* Password dialog */
  const [showPwDialog, setShowPwDialog] = useState(false);
  const [pwForm, setPwForm] = useState({ old: "", next: "", confirm: "" });
  const [pwShow, setPwShow] = useState({ old: false, next: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [isChangingPw, setIsChangingPw] = useState(false);

  const derivedCompleteness = calcCompleteness(form);
  const completeness = profileCompletion ?? derivedCompleteness;

  /* ── Load profile ──────────────────────────────────────────── */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await GetAdvisorProfile();
        const payload: any = res?.data ?? res;

        const isSuccess =
          typeof res?.isSuccess === "boolean"
            ? res.isSuccess
            : typeof res?.success === "boolean"
              ? res.success
              : Boolean(payload);

        if (isSuccess && payload) {
          // Existing profile
          setHasProfile(true);

          const d: any = payload;
          const items: any[] = Array.isArray(d.items) ? d.items : [];

          setForm({
            name: d.fullName ?? "",
            title: d.title ?? "",
            linkedInURL: d.linkedInURL ?? d.linkedInUrl ?? "",
            bio: d.bio ?? "",
            mentorshipPhilosophy: d.mentorshipPhilosophy ?? "",
            industryFocus: Array.isArray(d.industry) ? d.industry.map((i: any) => i.industryId) : [],
            sessionFormats: d.avalability?.sessionFormats ?? "Online",
            typicalSessionDuration: d.avalability?.typicalSessionDuration ?? 60,
            weeklyAvailableHours: d.avalability?.weeklyAvailableHours ?? 5,
            maxConcurrentMentees: d.avalability?.maxConcurrentMentees ?? 2,
            responseTimeCommitment: d.avalability?.responseTimeCommitment ?? "24h",
            isAcceptingNewMentees: d.avalability?.isAcceptingNewMentees ?? false,
          });

          const photoUrl = d.profilePhotoURL ?? d.profilePhotoUrl;
          if (photoUrl) setPhotoPreview(photoUrl);

          setProfileCompletion(null);
        } else {
          // No profile -> show empty form for update/create
          setHasProfile(false);
          setPhotoPreview(null);
          setProfileCompletion(null);
          setForm({
            name: "", title: "", bio: "", mentorshipPhilosophy: "",
            linkedInURL: "", industryFocus: [],
            sessionFormats: "Online", typicalSessionDuration: 60,
            weeklyAvailableHours: 5, maxConcurrentMentees: 2,
            responseTimeCommitment: "24h", isAcceptingNewMentees: false,
          });
        }
      } catch (err: any) {
        const status = err?.response?.status ?? err?.status;
        // 404/no-profile -> show empty form
        if (status === 404) {
          setHasProfile(false);
          setLoadError(false);
        } else {
          setLoadError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
    if (searchParams.get("tab") === "password") setShowPwDialog(true);
  }, []);

  /* ── Photo ─────────────────────────────────────────────────── */
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Save profile ──────────────────────────────────────────── */
  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Vui lòng nhập tên Advisor"); return; }
    if (!form.title.trim()) { toast.error("Vui lòng nhập chức vụ hiện tại"); return; }
    if (!form.linkedInURL.trim()) {
      toast.error("Vui lòng cung cấp liên kết LinkedIn");
      return;
    }
    if (form.industryFocus.length === 0) { toast.error("Vui lòng chọn ít nhất 1 lĩnh vực"); return; }
    if (!form.bio.trim()) { toast.error("Vui lòng nhập phần giới thiệu bản thân"); return; }
    if (!form.mentorshipPhilosophy.trim()) { toast.error("Vui lòng nhập triết lý cố vấn"); return; }
    setIsSaving(true);
    try {
      const payloadProfile: any = {
        fullName: form.name,
        title: form.title,
        bio: form.bio,
        linkedInURL: form.linkedInURL,
        mentorshipPhilosophy: form.mentorshipPhilosophy,
        advisorIndustryFocus: form.industryFocus.map(id => ({ industryId: id })),
      };
      if (profilePhoto) {
        payloadProfile.profilePhotoURL = profilePhoto;
      }

      if (hasProfile) {
        await UpdateAdvisorProfile(payloadProfile);
      } else {
        await CreateAdvisorProfile(payloadProfile);
        setHasProfile(true);
      }

      await UpdateAdvisorAvailability({
        sessionFormats: form.sessionFormats,
        typicalSessionDuration: form.typicalSessionDuration,
        weeklyAvailableHours: form.weeklyAvailableHours,
        maxConcurrentMentees: form.maxConcurrentMentees,
        responseTimeCommitment: form.responseTimeCommitment,
        isAcceptingNewMentees: form.isAcceptingNewMentees
      });

      toast.success("Lưu hồ sơ thành công");

      const refRes = await GetAdvisorProfile();
      const refData: any = refRes?.data ?? refRes;
      if (refRes?.isSuccess && refData) {
        const d: any = refData;
        setForm({
            name: d.fullName ?? "",
            title: d.title ?? "",
            linkedInURL: d.linkedInURL ?? d.linkedInUrl ?? "",
            bio: d.bio ?? "",
            mentorshipPhilosophy: d.mentorshipPhilosophy ?? "",
            industryFocus: Array.isArray(d.industry) ? d.industry.map((i: any) => i.industryId) : [],
            sessionFormats: d.avalability?.sessionFormats ?? form.sessionFormats,
            typicalSessionDuration: d.avalability?.typicalSessionDuration ?? form.typicalSessionDuration,
            weeklyAvailableHours: d.avalability?.weeklyAvailableHours ?? form.weeklyAvailableHours,
            maxConcurrentMentees: d.avalability?.maxConcurrentMentees ?? form.maxConcurrentMentees,
            responseTimeCommitment: d.avalability?.responseTimeCommitment ?? form.responseTimeCommitment,
            isAcceptingNewMentees: d.avalability?.isAcceptingNewMentees ?? form.isAcceptingNewMentees,
        });

        const photoUrl = d.profilePhotoURL ?? d.profilePhotoUrl;
        if (photoUrl) setPhotoPreview(photoUrl);
      }

      setProfilePhoto(null);
    } catch {
      toast.error("Lưu hồ sơ thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Change password ───────────────────────────────────────── */
  const handleChangePw = async () => {
    setPwError("");
    if (pwForm.next !== pwForm.confirm) { setPwError("Mật khẩu mới và xác nhận không khớp"); return; }
    setIsChangingPw(true);
    try {
      const res = await ChangePassword(pwForm.old, pwForm.next, pwForm.confirm);
      if (res.isSuccess) {
        toast.success("Đổi mật khẩu thành công");
        setShowPwDialog(false);
        setPwForm({ old: "", next: "", confirm: "" });
      } else {
        setPwError(res.message || "Đổi mật khẩu không thành công");
      }
    } catch {
      setPwError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsChangingPw(false);
    }
  };

  /* ── Loading skeleton ──────────────────────────────────────── */
  if (isLoading) {
    return (
      <AdvisorShell>
        <div className="flex items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#eec54e]" />
          <p className="text-[13px] text-slate-400 font-semibold">Đang tải hồ sơ...</p>
        </div>
      </AdvisorShell>
    );
  }

  /* ── Load error ──────────────────────────────────────────── */
  if (loadError) {
    return (
      <AdvisorShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-semibold text-slate-800">Không thể tải hồ sơ</p>
            <p className="text-[13px] text-slate-400 mt-1">Vui lòng kiểm tra kết nối và thử lại.</p>
          </div>
          <button
            onClick={() => { setLoadError(false); setIsLoading(true); window.location.reload(); }}
            className="px-5 py-2.5 bg-[#0f172a] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1e293b] transition-colors"
          >
            Thử lại
          </button>
        </div>
      </AdvisorShell>
    );
  }

  /* ── JSX ───────────────────────────────────────────────────── */
  return (
    <AdvisorShell>
      <div className="max-w-[1000px] mx-auto pb-16 animate-in fade-in duration-400">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-900">Hồ sơ Advisor</h1>
          <p className="text-[13px] text-slate-400 mt-1">Thông tin hiển thị công khai trên nền tảng AISEP.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT (2/3) ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic info */}
            <SectionCard title="Thông tin cơ bản" icon={User}>
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
                    {photoPreview
                      ? <img src={photoPreview} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-[22px] font-bold text-slate-400">
                          {form.name ? form.name.charAt(0).toUpperCase() : "?"}
                        </span>
                    }
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 h-9 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" /> Thay đổi ảnh
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1.5">JPG, PNG — tối đa 5MB</p>
                  <input type="file" ref={fileInputRef} onChange={handlePhoto} accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Họ và tên <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Nguyễn Văn A"
                      className={cn(inputClass(), "pl-10")} />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Chức vụ</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="CEO, Founder, Expert..."
                      className={cn(inputClass(), "pl-10")} />
                  </div>
                </div>



                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input value={form.linkedInURL} onChange={e => setForm(p => ({ ...p, linkedInURL: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      className={cn(inputClass(), "pl-10")} />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Bio */}
            <SectionCard title="Giới thiệu & Triết lý" icon={FileText}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Giới thiệu bản thân (Bio)
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tóm tắt kinh nghiệm và giá trị bạn mang lại cho Startup..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#eec54e] focus:ring-2 focus:ring-[#eec54e]/20 resize-none transition-all"
                  />
                  <p className="text-[11px] text-slate-300 text-right mt-1">{form.bio.length}/1000</p>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Triết lý cố vấn
                  </label>
                  <textarea
                    value={form.mentorshipPhilosophy}
                    onChange={e => setForm(p => ({ ...p, mentorshipPhilosophy: e.target.value }))}
                    placeholder="Bạn mong muốn hỗ trợ Startup như thế nào? Cách làm việc của bạn ra sao?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#eec54e] focus:ring-2 focus:ring-[#eec54e]/20 resize-none transition-all"
                  />
                  <p className="text-[11px] text-slate-300 text-right mt-1">{form.mentorshipPhilosophy.length}/1000</p>
                </div>
              </div>
            </SectionCard>
 
            {/* Lĩnh vực tư vấn */}
            <SectionCard title="Lĩnh vực tư vấn" icon={Sparkles}>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                    Các lĩnh vực hỗ trợ
                    <span className="text-slate-400 font-normal text-[12px] ml-1">— Chọn nhiều</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_INDUSTRIES.map(opt => {
                      const selected = form.industryFocus.includes(opt.id);
                      return (
                        <button 
                          key={opt.id} 
                          type="button" 
                          onClick={() => setForm(p => ({
                            ...p, 
                            industryFocus: selected 
                              ? p.industryFocus.filter(id => id !== opt.id)
                              : [...p.industryFocus, opt.id]
                          }))}
                          className={cn(
                            "px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all flex items-center gap-1.5",
                            selected 
                              ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm" 
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                          )}
                        >
                          {selected ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Availability */}
            <SectionCard title="Lịch trình hỗ trợ" icon={CreditCard}>
              <div className="space-y-6">
                {/* Accept Mentees Toggle */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[14px] font-bold text-slate-800">Đang nhận hỗ trợ (Open for Mentees)</p>
                      {form.isAcceptingNewMentees ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider animate-pulse">Đang mở</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Đang tắt</span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed">
                      Khi bật, Startup có thể tìm thấy bạn và gửi yêu cầu đặt lịch hỗ trợ trực tiếp.
                    </p>
                  </div>
                  
                  {/* Custom Toggle Switch */}
                  <button 
                    type="button"
                    onClick={() => setForm(p => ({ ...p, isAcceptingNewMentees: !p.isAcceptingNewMentees }))}
                    className={cn(
                      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#eec54e] focus:ring-offset-2",
                      form.isAcceptingNewMentees ? "bg-[#eec54e]" : "bg-slate-200"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        form.isAcceptingNewMentees ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Số giờ tối đa mỗi tuần</label>
                    <input 
                      type="number" min={0} max={100}
                      value={form.weeklyAvailableHours}
                      onChange={e => setForm(p => ({ ...p, weeklyAvailableHours: parseInt(e.target.value) || 0 }))}
                      className={inputClass()}
                      disabled={!form.isAcceptingNewMentees}
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Số lượng Mentee tối đa</label>
                    <input 
                      type="number" min={1} max={50}
                      value={form.maxConcurrentMentees}
                      onChange={e => setForm(p => ({ ...p, maxConcurrentMentees: parseInt(e.target.value) || 1 }))}
                      className={inputClass()}
                      disabled={!form.isAcceptingNewMentees}
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Thời lượng tiêu chuẩn (phút)</label>
                    <div className="flex flex-wrap gap-2">
                      {[30, 45, 60].map(d => {
                        const selected = form.typicalSessionDuration === d;
                        return (
                          <button
                            key={d} type="button"
                            onClick={() => setForm(p => ({ ...p, typicalSessionDuration: d }))}
                            disabled={!form.isAcceptingNewMentees}
                            className={cn(
                              "px-3.5 py-1.5 rounded-xl text-[12px] font-bold border transition-all",
                              selected ? "bg-[#171611] text-white border-[#171611] shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                            )}
                          >
                            {d}m
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Hình thức tương tác</label>
                    <div className="flex flex-wrap gap-2">
                      {["Online", "Offline", "Mixed"].map(f => {
                        const selected = form.sessionFormats === f;
                        return (
                          <button
                            key={f} type="button"
                            onClick={() => setForm(p => ({ ...p, sessionFormats: f }))}
                            disabled={!form.isAcceptingNewMentees}
                            className={cn(
                              "px-3.5 py-1.5 rounded-xl text-[12px] font-bold border transition-all",
                              selected ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                            )}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Save button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => router.push("/advisor")}
                className="px-5 h-10 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSave} disabled={isSaving}
                className="bg-[#0f172a] text-white text-[13px] font-bold px-6 h-10 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...</> : <><CheckCircle2 className="w-4 h-4" /> Lưu thay đổi</>}
              </button>
            </div>
          </div>

          {/* ── RIGHT (1/3) ─────────────────────────────────── */}
          <div className="space-y-5 lg:sticky lg:top-24 h-fit">

            {/* Completeness */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[14px] font-bold text-slate-800 mb-4">Mức độ hoàn thiện</p>

              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[12px] text-slate-500">
                  <span>Hồ sơ của bạn</span>
                  <span className={cn("font-bold", completeness === 100 ? "text-emerald-600" : "text-slate-700")}>{completeness}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", completeness === 100 ? "bg-emerald-500" : "bg-[#eec54e]")}
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-2">
                {[
                  { label: "Họ và tên", done: Boolean(form.name?.trim()) },
                  { label: "Chức vụ", done: Boolean(form.title?.trim()) },
                  { label: "Liên kết LinkedIn", done: Boolean(form.linkedInURL?.trim()) },
                  { label: "Lĩnh vực tư vấn", done: form.industryFocus.length > 0 },
                  { label: "Giới thiệu bản thân", done: Boolean(form.bio?.trim()) },
                  { label: "Triết lý cố vấn", done: Boolean(form.mentorshipPhilosophy?.trim()) },
                  { label: "Sẵn sàng hỗ trợ", done: !form.isAcceptingNewMentees || form.weeklyAvailableHours > 0 },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all",
                      item.done ? "bg-[#eec54e] border-[#eec54e]" : "border-slate-200"
                    )}>
                      {item.done && <Check className="w-2.5 h-2.5 text-[#171611]" />}
                    </div>
                    <span className={cn("text-[12px]", item.done ? "text-slate-600 font-semibold" : "text-slate-400")}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[14px] font-bold text-slate-800 mb-3">Thao tác nhanh</p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/advisor/kyc")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#eec54e]/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#eec54e]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-700">Xác thực KYC</p>
                    <p className="text-[11px] text-slate-400">Nhận badge Verified Advisor</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowPwDialog(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-700">Đổi mật khẩu</p>
                    <p className="text-[11px] text-slate-400">Cập nhật mật khẩu đăng nhập</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Password Dialog ──────────────────────────────────── */}
      {showPwDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl w-full max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-slate-900">Đổi mật khẩu</p>
                <p className="text-[12px] text-slate-400">Cập nhật mật khẩu đăng nhập của bạn</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Mật khẩu cũ", key: "old" as const, placeholder: "Nhập mật khẩu hiện tại" },
                { label: "Mật khẩu mới", key: "next" as const, placeholder: "Tối thiểu 8 ký tự" },
                { label: "Xác nhận mật khẩu mới", key: "confirm" as const, placeholder: "Nhập lại mật khẩu mới" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">{label}</label>
                  <div className="relative">
                    <input
                      type={pwShow[key] ? "text" : "password"}
                      value={pwForm[key]}
                      onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#eec54e] focus:ring-2 focus:ring-[#eec54e]/20 transition-all"
                    />
                    <button type="button" onClick={() => setPwShow(p => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                      {pwShow[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              {pwError && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-[12px] text-red-600">{pwError}</p>
                </div>
              )}

              <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50/60 rounded-xl">
                <AlertCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-600">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowPwDialog(false); setPwError(""); setPwForm({ old: "", next: "", confirm: "" }); }}
                className="flex-1 h-10 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-500 hover:bg-slate-50 transition-all">
                Hủy
              </button>
              <button
                onClick={handleChangePw}
                disabled={!pwForm.old || !pwForm.next || !pwForm.confirm || isChangingPw}
                className="flex-1 h-10 bg-[#0f172a] text-white text-[13px] font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isChangingPw ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang đổi...</> : "Đổi mật khẩu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdvisorShell>
  );
}
