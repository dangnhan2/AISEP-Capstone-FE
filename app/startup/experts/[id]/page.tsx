'use client'

import { StartupShell } from "@/components/startup/startup-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star, MessageSquare, Send, Calendar, Briefcase, Users,
  BadgeCheck, Lock
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { MentorshipRequestModal } from "@/components/startup/mentorship-request-modal";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GetAdvisorProfileById } from "@/services/advisor/advisor.api";

// ─── Toast Component ──────────────────────────────────────────────────────────

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 bg-[#0f172a] text-white text-[13px] font-medium rounded-xl shadow-lg pointer-events-none">
      {msg}
    </div>
  );
}

// ─── Star Row ─────────────────────────────────────────────────────────────────

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5 my-1">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          className={cn(
            "w-4 h-4",
            s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"
          )}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExpertProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [mentor, setMentor] = useState<IAdvisorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisor = async () => {
      try {
        const res = await GetAdvisorProfileById(parseInt(id));
        if (res.data) {
          setMentor(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdvisor();
  }, [id]);

  if (isLoading) {
    return (
      <StartupShell>
        <div className="flex items-center justify-center h-screen">
          <div className="text-slate-500 font-medium animate-pulse">Đang tải hồ sơ chuyên gia...</div>
        </div>
      </StartupShell>
    );
  }

  if (!mentor) {
    return (
      <StartupShell>
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <div className="text-slate-500 font-medium">Không tìm thấy thông tin cố vấn.</div>
          <Button variant="outline" onClick={() => router.push("/startup/experts")}>
            Quay lại danh sách
          </Button>
        </div>
      </StartupShell>
    );
  }

  const hasActiveMentorship = false; // logic would require checking start up mentorship status

  return (
    <StartupShell>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">

        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative size-36 rounded-2xl overflow-hidden border-4 border-white shadow-xl shadow-amber-500/10 flex-shrink-0">
              <img src={mentor.profilePhotoURL || "https://placehold.co/150x150"} alt={mentor.fullName} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5 text-center md:text-left">
              <div className="space-y-1.5">
                <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                  <h1 className="text-[28px] font-black text-slate-900 tracking-tight">{mentor.fullName}</h1>
                  {mentor.profileStatus === "Approved" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl text-[11px] font-semibold">
                      <BadgeCheck className="w-3.5 h-3.5" /> Đã xác minh
                    </span>
                  )}
                </div>
                <p className="text-[15px] font-semibold text-slate-400">{mentor.title}</p>
                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start mt-2">
                  {mentor.industry?.map(tag => (
                    <span key={tag.industryId} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium text-slate-600">
                      {tag.industry || `Industry ${tag.industryId}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-slate-900 leading-none">{mentor.averageRating?.toFixed(1) || "5.0"}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Đánh giá trung bình</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-6 border-l border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-slate-900 leading-none">{mentor.totalMentees || 0}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Mentees</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="h-11 px-6 rounded-xl bg-[#fdf8e6] text-slate-900 border border-[#eec54e]/30 hover:bg-[#eec54e] transition-all font-semibold text-[13px] shadow-sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Yêu cầu tư vấn ngay
                </Button>
                {hasActiveMentorship ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/startup/messaging")}
                    className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-semibold text-[13px] hover:bg-slate-50 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Gửi tin nhắn
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="h-11 px-6 rounded-xl border-slate-200 text-slate-400 font-semibold text-[13px] cursor-not-allowed opacity-60"
                    title="Cần có phiên tư vấn được chấp nhận để nhắn tin"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Nhắn tin
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <CardContent className="p-8 space-y-10">

                {/* Biography */}
                <section className="space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Giới thiệu Chuyên gia</h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-wrap">{mentor.bio}</p>
                </section>

                {/* Philosophy */}
                {mentor.mentorshipPhilosophy && (
                  <section className="space-y-3 pt-8 border-t border-slate-50">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Triết lý hướng dẫn</h3>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative">
                      <MessageSquare className="absolute -top-2 -left-2 w-7 h-7 text-[#eec54e]/20" />
                      <p className="text-[14px] text-slate-700 font-semibold italic">"{mentor.mentorshipPhilosophy}"</p>
                    </div>
                  </section>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="rounded-2xl border-amber-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sẵn sàng kết nối</h4>
                  {mentor.avalability?.isAcceptingNewMentees ? (
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md text-[10px] font-bold text-emerald-600">Đang nhận mentee</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-bold text-slate-500">Kín lịch</span>
                  )}
                </div>

                <div className="space-y-2 text-[13px] text-slate-600">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400">Hình thức</span>
                    <span className="font-semibold text-slate-800">{mentor.avalability?.sessionFormats || "Trực tuyến"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400">Thời lượng phiên</span>
                    <span className="font-semibold text-slate-800">{mentor.avalability?.typicalSessionDuration || 60} phút</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  disabled={!mentor.avalability?.isAcceptingNewMentees}
                  className="w-full h-11 rounded-xl bg-[#0f172a] text-white text-[13px] font-bold hover:bg-slate-700 disabled:opacity-50 transition-all mt-4"
                >
                  Gửi yêu cầu ngay
                </button>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className="rounded-2xl border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <h4 className="text-[13px] font-bold text-slate-900 text-center pb-4 border-b border-slate-50 italic">Thông tin chung</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mentees</span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900">{mentor.totalMentees || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lịch rảnh (tuần)</span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900">{mentor.avalability?.weeklyAvailableHours || 0} giờ</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                        <BadgeCheck className="w-3.5 h-3.5 text-teal-500" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Xác minh</span>
                    </div>
                    <span className={cn("text-[13px] font-bold", mentor.profileStatus === "Approved" ? "text-teal-600" : "text-slate-400")}>
                      {mentor.profileStatus === "Approved" ? "Đã xác minh" : "Chờ xác minh"}
                    </span>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal */}
        <MentorshipRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          mentor={{
            id: mentor.advisorID,
            name: mentor.fullName,
            avatar: mentor.profilePhotoURL || "https://placehold.co/150x150",
            title: mentor.title,
            hourlyRate: 0,
            supportedDurations: mentor.avalability?.typicalSessionDuration ? [mentor.avalability.typicalSessionDuration] : [30, 60]
          }}
        />

        {/* Toast */}
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </StartupShell>
  );
}
