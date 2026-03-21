"use client";

import { StartupShell } from "@/components/startup/startup-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star, MessageSquare, Send, Calendar, Briefcase, Users,
  BadgeCheck, CheckCircle2, Info, Lock
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { MentorshipRequestModal } from "@/components/startup/mentorship-request-modal";
import { useRouter, notFound } from "next/navigation";
import { cn } from "@/lib/utils";

const formatVND = (n: number) => n.toLocaleString('vi-VN') + '₫';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ADVISORS = [
  {
    id: 1,
    name: "Nguyễn Minh Quân",
    title: "Head of Product · TechGlobal",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY2B_40T_b8ifCFhZYE9RUfdodTMIq4hkMeAvPfCxdek8AhcikuKD11XDhYpXmtyvdSlnne2UWZDbdEO4TMXf17yrSsltdyX2-bBHPjbzbTxFQNPTgQkflvmeFd6QdGRvx0WBDDS0vnBvv-defpdnEB2zPF8-sAiLMhhfWCHe6M2UpyMAwTRdjcu8xSEmKOJ3aGlWMMK40SM6ThVvCpVFz_jvRfcX6dDBi4rDUGiVvfrUIHpezyewWd_4dYD9EbKusdQxomMZQhk",
    rating: 4.9,
    reviewCount: 124,
    completedSessions: 120,
    yearsOfExperience: 10,
    expertise: ["Product Strategy", "SaaS", "Go-to-market"],
    domainTags: ["SaaS", "B2B"],
    isVerified: true,
    availabilityHint: "Thứ 3, Thứ 5",
    hourlyRate: 2000000,
    supportedDurations: [30, 60, 90],
    suitableFor: ["Product-Market Fit", "Chiến lược tăng trưởng", "Go-to-market", "SaaS Scaling", "User Research"],
    biography: "Hơn 10 năm kinh nghiệm trong lĩnh vực quản lý sản phẩm Tech. Đã từng dẫn dắt các dự án quy mô lớn tại các tập đoàn đa quốc gia và startup unicorns. Với sứ mệnh giúp các startup SaaS Việt Nam vươn ra thị trường quốc tế, Quân đã mentored 50+ startup qua các giai đoạn từ idea validation đến Series A.",
    philosophy: "Tập trung vào giá trị cốt lõi của sản phẩm và trải nghiệm người dùng là chìa khóa để thành công bền vững.",
    ratingBreakdown: [
      { score: 5, count: 98 },
      { score: 4, count: 18 },
      { score: 3, count: 6 },
      { score: 2, count: 1 },
      { score: 1, count: 1 },
    ],
    experience: [
      { year: "2021 - Hiện tại", role: "Head of Product", company: "TechGlobal", desc: "Dẫn dắt đội ngũ 50+ người, xây dựng hệ sinh thái sản phẩm SaaS phục vụ 2M+ doanh nghiệp vừa và nhỏ." },
      { year: "2018 - 2021", role: "Senior Product Manager", company: "Unicorn App", desc: "Phụ trách mảng tăng trưởng người dùng, đạt 10 triệu người dùng hàng tháng." },
      { year: "2014 - 2018", role: "Product Manager", company: "NextGen Digital", desc: "Xây dựng MVP và dẫn dắt go-to-market cho 3 sản phẩm B2B SaaS thành công." },
    ],
    skills: [
      { label: "Product Strategy", value: 95 },
      { label: "SaaS Development", value: 88 },
      { label: "Growth Hacking", value: 80 },
    ],
    reviews: [
      { author: "CEO · FoodHub", stage: "Startup Vòng hạt giống", rating: 5, text: "Kiến thức chuyên môn rất sâu rộng, những lời khuyên thực tế giúp chúng tôi tối ưu hóa được 20% chi phí vận hành ngay trong tháng đầu tiên." },
      { author: "CTO · SafeDrive", stage: "Series A", rating: 5, text: "Cố vấn xuất sắc! Nguyễn Minh Quân đã giúp chúng tôi định hình lại roadmap sản phẩm và cải thiện retention rate từ 60% lên 82% chỉ trong 2 quý." },
    ],
  },
  {
    id: 2,
    name: "Trần Thu Hà",
    title: "Investment Director · VCFund",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkeJpKLH89dtH6jy4p8OtegH6mL83JYobMLHvAQeMV-R-JV6ohyzLx5hQ2sZ387P-fztgR4sHa7EhmwJgbBTLxFVFskQsJI0Gohh4EB7LYt7pPNPIzVeMrNhIypAV8fJEz96dPqr4r8kUGO2XeJO1lDMfCEq0VHu2jl5963wBzE9lbl2WoMzmqdPjjGz-t_FAE1IFgbbvm8uMyf_V-UtsjIaqHKgVh5bF0DB5TQdrgyJ8kdtGF1397AobYsJYg8zAxOXwFyWtd32Q",
    rating: 5.0,
    reviewCount: 85,
    completedSessions: 85,
    yearsOfExperience: 12,
    expertise: ["Fundraising", "Financial Strategy"],
    domainTags: ["FinTech", "VC"],
    isVerified: true,
    availabilityHint: "Thứ 2, Thứ 4, Thứ 6",
    hourlyRate: 2500000,
    supportedDurations: [30, 60, 90],
    suitableFor: ["Gọi vốn", "Pitch Deck", "Term Sheet", "Financial Modeling", "Investor Relations"],
    biography: "12 năm kinh nghiệm trong lĩnh vực đầu tư mạo hiểm và tài chính khởi nghiệp. Đã tham gia vào hơn 40 thương vụ đầu tư với tổng giá trị vượt $200M. Chuyên gia hàng đầu trong việc giúp startup chuẩn bị hồ sơ gọi vốn và đàm phán term sheet.",
    philosophy: "Một pitch deck xuất sắc không chỉ kể câu chuyện hay, mà còn phải thuyết phục bằng con số và tầm nhìn rõ ràng.",
    ratingBreakdown: [
      { score: 5, count: 82 },
      { score: 4, count: 3 },
      { score: 3, count: 0 },
      { score: 2, count: 0 },
      { score: 1, count: 0 },
    ],
    experience: [
      { year: "2019 - Hiện tại", role: "Investment Director", company: "VCFund", desc: "Quản lý danh mục đầu tư $150M vào các startup FinTech giai đoạn Seed–Series B." },
      { year: "2015 - 2019", role: "Investment Manager", company: "Asia Capital", desc: "Thực hiện due diligence và đàm phán cho 20+ thương vụ." },
      { year: "2012 - 2015", role: "Financial Analyst", company: "Big4 Consulting", desc: "Tư vấn tài chính cho 30+ doanh nghiệp từ khởi nghiệp đến IPO." },
    ],
    skills: [
      { label: "Fundraising Strategy", value: 98 },
      { label: "Financial Modeling", value: 90 },
      { label: "Investor Relations", value: 85 },
    ],
    reviews: [
      { author: "CEO · PaySmart", stage: "Seed Round", rating: 5, text: "Nhờ sự hỗ trợ của Trần Thu Hà, chúng tôi đã gọi vốn thành công $2M Seed round trong vòng 3 tháng." },
      { author: "Founder · GreenCredit", stage: "Series A", rating: 5, text: "Pitch deck được cố vấn cải thiện hoàn toàn, tỷ lệ chuyển đổi với investor tăng gấp 3 lần." },
    ],
  },
  {
    id: 3,
    name: "Phạm Thành Long",
    title: "CTO & Co-founder · AI-Soft",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd7t5ciDWV2eTaJsfniBll5lOH1FpM75D-rNgvvVbqucB9qLvuvCqdD2n7NevngnBF0iNuRrvyppt6TSVePvhTgOoUFPXs3COh1SFpjFFfpRM7AvqpVQYWIKMeh8ZaAHBQXX7A9LfSgc9hJLF86zECFTAuBW7cVPKthlob2LHXSFNJoAt5LewaefZBVBDzh253xnffFoI4o3adtsf5g77DpJi4MsoGYiv14LMA-ivJZaM5n2tz_QhJaAEUCzsxPuiFm3f6b9lC-GA",
    rating: 4.8,
    reviewCount: 210,
    completedSessions: 210,
    yearsOfExperience: 15,
    expertise: ["Engineering", "AI/ML"],
    domainTags: ["AI", "Deep Tech"],
    isVerified: true,
    availabilityHint: "Thứ 3, Thứ 6",
    hourlyRate: 3000000,
    supportedDurations: [30, 60, 90],
    suitableFor: ["Kỹ thuật", "AI Strategy", "Tuyển CTO", "Technical Architecture", "Team Building"],
    biography: "15 năm kinh nghiệm trong lĩnh vực kỹ thuật phần mềm và AI. Co-founder của AI-Soft, startup AI hàng đầu Đông Nam Á. Chuyên gia trong việc xây dựng đội ngũ kỹ thuật từ 0, thiết kế kiến trúc hệ thống scale và ứng dụng AI vào sản phẩm.",
    philosophy: "Kỹ thuật tốt không chỉ là code sạch, mà là giải pháp đúng cho bài toán đúng, được xây dựng bởi đội ngũ mạnh.",
    ratingBreakdown: [
      { score: 5, count: 165 },
      { score: 4, count: 35 },
      { score: 3, count: 8 },
      { score: 2, count: 2 },
      { score: 1, count: 0 },
    ],
    experience: [
      { year: "2018 - Hiện tại", role: "CTO & Co-founder", company: "AI-Soft", desc: "Xây dựng đội kỹ thuật 120+ người, phát triển platform AI phục vụ 500+ doanh nghiệp." },
      { year: "2014 - 2018", role: "Principal Engineer", company: "Google Vietnam", desc: "Dẫn dắt dự án ML infrastructure cho Google Maps khu vực Đông Nam Á." },
      { year: "2009 - 2014", role: "Senior Software Engineer", company: "VNG Corporation", desc: "Xây dựng hệ thống backend scale 10M+ users/ngày." },
    ],
    skills: [
      { label: "AI/ML Architecture", value: 96 },
      { label: "Engineering Leadership", value: 90 },
      { label: "System Design", value: 88 },
    ],
    reviews: [
      { author: "CTO · HealthAI", stage: "Series A", rating: 5, text: "Long giúp chúng tôi redesign toàn bộ ML pipeline, latency giảm 70% và accuracy tăng 15%." },
      { author: "CEO · DriveBot", stage: "Seed Round", rating: 4, text: "Mentor tuyệt vời về technical strategy. Rất thực tế và đi thẳng vào vấn đề." },
    ],
  },
  {
    id: 4,
    name: "Lê Hồng Nhung",
    title: "Growth Lead · FastDelivery",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaiDXjuR0ngcu2gjH7wWIYdvc0Z64rZ4uKjXIuRusn_lY1IEWFYzwMyeYzlUPSUHnBTt6mDDuv0eJ8SL71wy7SaD-05KoaTWJzurSlnJClIIJsgTS--Cv40ApHR5shEQ7SeCpNxnp5xtIwWuRCBa4OUemqewQ9q0w2DqIrWm50zdbyWm-9sYgEnRGt14BdHMznN22ho7LmUpoRO43UFNRR-WvdR3xEiHq7wURyqtcS5fcDxxd6ZjMEG9GhQRcdPpl6nwaJ4uRrLE",
    rating: 4.7,
    reviewCount: 45,
    completedSessions: 45,
    yearsOfExperience: 7,
    expertise: ["Growth Hacking", "Marketing"],
    domainTags: ["E-commerce", "Consumer"],
    isVerified: true,
    availabilityHint: "Thứ 2, Thứ 5",
    hourlyRate: 1500000,
    supportedDurations: [30, 60],
    suitableFor: ["Tăng trưởng người dùng", "Marketing", "E-commerce", "Acquisition Strategy", "Retention"],
    biography: "7 năm kinh nghiệm growth hacking và marketing cho các startup consumer tech. Đã scale 3 startup từ 0 đến Series B. Chuyên sâu về data-driven marketing, viral loops và community-led growth.",
    philosophy: "Growth không phải là hack tricks, mà là xây dựng vòng lặp tự nhiên từ giá trị thật sự mà sản phẩm mang lại.",
    ratingBreakdown: [
      { score: 5, count: 32 },
      { score: 4, count: 10 },
      { score: 3, count: 2 },
      { score: 2, count: 1 },
      { score: 1, count: 0 },
    ],
    experience: [
      { year: "2021 - Hiện tại", role: "Growth Lead", company: "FastDelivery", desc: "Tăng trưởng MAU từ 100K lên 3M trong 18 tháng, CAC giảm 45%." },
      { year: "2018 - 2021", role: "Head of Growth", company: "StyleHub", desc: "Xây dựng growth team từ đầu, đạt Series B với $15M ARR." },
      { year: "2017 - 2018", role: "Growth Manager", company: "FoodGo", desc: "Triển khai referral program, tăng 200% new users trong 6 tháng." },
    ],
    skills: [
      { label: "Growth Strategy", value: 92 },
      { label: "Data Analytics", value: 85 },
      { label: "Paid Acquisition", value: 78 },
    ],
    reviews: [
      { author: "CEO · FashionBox", stage: "Seed Round", rating: 5, text: "Nhung giúp chúng tôi tìm ra growth loop thực sự hiệu quả, CAC giảm một nửa chỉ trong 2 tháng." },
      { author: "CMO · GroceryNow", stage: "Series A", rating: 4, text: "Tư vấn thực tế, hands-on và rất nhiệt tình. Highly recommend!" },
    ],
  },
  {
    id: 5,
    name: "Võ Minh Tuấn",
    title: "Founder & Legal Counsel · StartupLaw",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd7t5ciDWV2eTaJsfniBll5lOH1FpM75D-rNgvvVbqucB9qLvuvCqdD2n7NevngnBF0iNuRrvyppt6TSVePvhTgOoUFPXs3COh1SFpjFFfpRM7AvqpVQYWIKMeh8ZaAHBQXX7A9LfSgc9hJLF86zECFTAuBW7cVPKthlob2LHXSFNJoAt5LewaefZBVBDzh253xnffFoI4o3adtsf5g77DpJi4MsoGYiv14LMA-ivJZaM5n2tz_QhJaAEUCzsxPuiFm3f6b9lC-GA",
    rating: 4.6,
    reviewCount: 32,
    completedSessions: 38,
    yearsOfExperience: 14,
    expertise: ["Legal/Compliance", "Corporate Governance"],
    domainTags: ["Legal", "Finance"],
    isVerified: false,
    availabilityHint: "Thứ 4, Thứ 6",
    hourlyRate: 2200000,
    supportedDurations: [60, 90],
    suitableFor: ["Pháp lý", "Tuân thủ", "M&A", "IP Protection", "Corporate Structure"],
    biography: "14 năm kinh nghiệm pháp lý với trọng tâm đầu tư mạo hiểm, M&A và tuân thủ doanh nghiệp. Founder của StartupLaw, công ty tư vấn pháp lý hàng đầu cho startup Việt Nam.",
    philosophy: "Pháp lý không phải rào cản mà là nền tảng để startup phát triển bền vững và tự tin mở rộng.",
    ratingBreakdown: [
      { score: 5, count: 20 },
      { score: 4, count: 9 },
      { score: 3, count: 2 },
      { score: 2, count: 1 },
      { score: 1, count: 0 },
    ],
    experience: [
      { year: "2018 - Hiện tại", role: "Founder & Legal Counsel", company: "StartupLaw", desc: "Tư vấn pháp lý cho 100+ startup trong các thương vụ đầu tư và M&A." },
      { year: "2013 - 2018", role: "Senior Associate", company: "Baker McKenzie Vietnam", desc: "Tham gia đàm phán hơn 30 thương vụ M&A trị giá trên $500M." },
      { year: "2010 - 2013", role: "Legal Associate", company: "VILAF", desc: "Tư vấn tuân thủ pháp lý cho các FDI và doanh nghiệp trong nước." },
    ],
    skills: [
      { label: "M&A Legal Advisory", value: 93 },
      { label: "Investment Law", value: 90 },
      { label: "Compliance", value: 85 },
    ],
    reviews: [
      { author: "CEO · TechBridge", stage: "Series A", rating: 5, text: "Tuấn giúp chúng tôi navigate phức tạp pháp lý của một thương vụ cross-border M&A rất chuyên nghiệp." },
      { author: "Founder · CleanEnergy", stage: "Seed Round", rating: 4, text: "Rất giỏi giải thích những điều khoản phức tạp theo cách dễ hiểu." },
    ],
  },
  {
    id: 6,
    name: "Bùi Thị Lan Anh",
    title: "Former COO · Gojek Vietnam",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkeJpKLH89dtH6jy4p8OtegH6mL83JYobMLHvAQeMV-R-JV6ohyzLx5hQ2sZ387P-fztgR4sHa7EhmwJgbBTLxFVFskQsJI0Gohh4EB7LYt7pPNPIzVeMrNhIypAV8fJEz96dPqr4r8kUGO2XeJO1lDMfCEq0VHu2jl5963wBzE9lbl2WoMzmqdPjjGz-t_FAE1IFgbbvm8uMyf_V-UtsjIaqHKgVh5bF0DB5TQdrgyJ8kdtGF1397AobYsJYg8zAxOXwFyWtd32Q",
    rating: 4.9,
    reviewCount: 67,
    completedSessions: 72,
    yearsOfExperience: 11,
    expertise: ["Operations", "Scaling"],
    domainTags: ["Logistics", "Marketplace"],
    isVerified: true,
    availabilityHint: "Thứ 2, Thứ 6",
    hourlyRate: 1800000,
    supportedDurations: [30, 60, 90],
    suitableFor: ["Vận hành", "Mở rộng quy mô", "OKRs", "COO Office", "Process Design"],
    biography: "11 năm kinh nghiệm vận hành tại các startup hàng đầu Đông Nam Á. Cựu COO của Gojek Vietnam, đã dẫn dắt công ty từ 200 nhân viên lên 2,000+ nhân viên trong 3 năm. Chuyên gia xây dựng hệ thống vận hành, OKRs và văn hóa công ty.",
    philosophy: "Vận hành xuất sắc là kết quả của hệ thống rõ ràng, con người đúng vị trí và văn hóa minh bạch.",
    ratingBreakdown: [
      { score: 5, count: 55 },
      { score: 4, count: 10 },
      { score: 3, count: 2 },
      { score: 2, count: 0 },
      { score: 1, count: 0 },
    ],
    experience: [
      { year: "2019 - 2023", role: "COO", company: "Gojek Vietnam", desc: "Scale operations từ 200 lên 2,000+ nhân sự, 15 thành phố, $200M GMV/năm." },
      { year: "2015 - 2019", role: "Head of Operations", company: "Grab Vietnam", desc: "Xây dựng cơ sở hạ tầng vận hành cho dịch vụ giao đồ ăn và logistics." },
      { year: "2013 - 2015", role: "Operations Manager", company: "Lazada Vietnam", desc: "Tối ưu fulfillment process, giảm delivery time 40%." },
    ],
    skills: [
      { label: "Operations Strategy", value: 95 },
      { label: "Organizational Design", value: 88 },
      { label: "OKR Implementation", value: 85 },
    ],
    reviews: [
      { author: "CEO · MoveX", stage: "Series B", rating: 5, text: "Lan Anh giúp chúng tôi thiết kế lại toàn bộ cơ cấu tổ chức, hiệu quả vận hành tăng 40%." },
      { author: "COO · FreshMart", stage: "Series A", rating: 5, text: "Kiến thức về operations và scaling cực kỳ sâu và thực tiễn. Rất đáng để đầu tư thời gian." },
    ],
  },
];

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

  const mentor = ADVISORS.find(a => a.id === parseInt(id));
  if (!mentor) notFound();

  // Mock: advisor ID 1 has an accepted mentorship session with this startup
  const hasActiveMentorship = mentor.id === 1;

  const totalReviews = mentor.ratingBreakdown.reduce((s, b) => s + b.count, 0);

  return (
    <StartupShell>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">

        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative size-36 rounded-2xl overflow-hidden border-4 border-white shadow-xl shadow-amber-500/10 flex-shrink-0">
              <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5 text-center md:text-left">
              <div className="space-y-1.5">
                <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                  <h1 className="text-[28px] font-black text-slate-900 tracking-tight">{mentor.name}</h1>
                  {mentor.isVerified && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl text-[11px] font-semibold">
                      <BadgeCheck className="w-3.5 h-3.5" /> Đã xác minh
                    </span>
                  )}
                </div>
                <p className="text-[15px] font-semibold text-slate-400">{mentor.title}</p>
                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start mt-2">
                  {mentor.expertise.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium text-slate-600">{tag}</span>
                  ))}
                  {mentor.domainTags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg text-[11px] font-medium text-amber-700">{tag}</span>
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
                    <p className="text-[16px] font-bold text-slate-900 leading-none">{mentor.rating}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{mentor.reviewCount} đánh giá</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-6 border-x border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-slate-900 leading-none">{mentor.completedSessions}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Phiên hoàn thành</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-slate-900 leading-none">{mentor.yearsOfExperience} năm</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Kinh nghiệm</p>
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
                  <p className="text-[14px] text-slate-600 leading-relaxed">{mentor.biography}</p>
                </section>

                {/* Philosophy */}
                <section className="space-y-3 pt-8 border-t border-slate-50">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Triết lý hướng dẫn</h3>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative">
                    <MessageSquare className="absolute -top-2 -left-2 w-7 h-7 text-[#eec54e]/20" />
                    <p className="text-[14px] text-slate-700 font-semibold italic">"{mentor.philosophy}"</p>
                  </div>
                </section>

                {/* Rating Summary */}
                <section className="space-y-4 pt-8 border-t border-slate-50">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Đánh giá & Xếp hạng</h3>
                  <div className="flex items-center gap-8">
                    <div className="text-center flex-shrink-0">
                      <p className="text-[48px] font-black text-slate-900 leading-none">{mentor.rating}</p>
                      <StarRow rating={mentor.rating} />
                      <p className="text-[12px] text-slate-400 mt-1">{mentor.reviewCount} đánh giá</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[...mentor.ratingBreakdown].reverse().map(({ score, count }) => (
                        <div key={score} className="flex items-center gap-3">
                          <span className="text-[12px] text-slate-400 w-8 text-right">{score}⭐</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-amber-400 h-2 rounded-full transition-all"
                              style={{ width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : "0%" }}
                            />
                          </div>
                          <span className="text-[12px] text-slate-400 w-5">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Experience */}
                <section className="space-y-6 pt-8 border-t border-slate-50">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Kinh nghiệm & Thành tựu</h3>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:left-[11px] before:w-0.5 before:bg-slate-100">
                    {mentor.experience.map((item, idx) => (
                      <div key={idx} className="relative pl-10 space-y-1">
                        <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#eec54e] shadow-sm z-10" />
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">{item.year}</span>
                        <h4 className="text-[15px] font-bold text-slate-900">{item.role}</h4>
                        <p className="text-[13px] font-semibold text-slate-400">{item.company}</p>
                        <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Suitable For */}
                <section className="space-y-4 pt-8 border-t border-slate-50">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Phù hợp với</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.suitableFor.map(f => (
                      <span key={f} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-[12px] font-medium border border-amber-100">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </section>

              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="rounded-2xl border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Đánh giá từ Startup</h3>
                <div className="space-y-4">
                  {mentor.reviews.map((review, idx) => (
                    <div key={idx} className="p-5 bg-white border border-slate-100 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[14px] font-bold text-slate-500">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-900 leading-none mb-0.5">{review.author}</p>
                            <p className="text-[11px] text-slate-400">{review.stage}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] text-slate-600 italic leading-relaxed">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="rounded-2xl border-amber-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Phí tư vấn</h4>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md text-[10px] font-bold text-emerald-600">Đã thanh toán</span>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-[32px] font-black text-slate-900 leading-none">{formatVND(mentor.hourlyRate)}</span>
                  <span className="text-[13px] text-slate-400 mb-1">/giờ</span>
                </div>

                <div className="space-y-2">
                  {mentor.supportedDurations.map(d => {
                    const price = Math.round(mentor.hourlyRate * d / 60);
                    return (
                      <div key={d} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                        <span className="text-[12px] font-semibold text-slate-600">{d} phút</span>
                        <span className="text-[13px] font-bold text-slate-900">{formatVND(price)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50/50 border border-amber-100/60 rounded-xl">
                  <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-700 leading-relaxed">Bạn chỉ thanh toán sau khi lịch hẹn được xác nhận.</p>
                </div>

                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full h-11 rounded-xl bg-[#0f172a] text-white text-[13px] font-bold hover:bg-slate-700 transition-all"
                >
                  Đặt lịch tư vấn
                </button>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className="rounded-2xl border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <h4 className="text-[13px] font-bold text-slate-900 text-center pb-4 border-b border-slate-50 italic">Thông tin tư vấn</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phiên hoàn thành</span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900">{mentor.completedSessions}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lịch rảnh</span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900">{mentor.availabilityHint}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Kinh nghiệm</span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900">{mentor.yearsOfExperience} năm</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                        <BadgeCheck className="w-3.5 h-3.5 text-teal-500" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Xác minh</span>
                    </div>
                    <span className={cn("text-[13px] font-bold", mentor.isVerified ? "text-teal-600" : "text-slate-400")}>
                      {mentor.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </span>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="rounded-2xl border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] pb-4 border-b border-slate-50">Chuyên môn chính</h4>
                <div className="space-y-4">
                  {mentor.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-slate-700">{skill.label}</span>
                        <span className="text-[13px] font-bold text-[#eec54e]">{skill.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#eec54e] rounded-full transition-all duration-700"
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal */}
        <MentorshipRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          mentor={{ name: mentor.name, avatar: mentor.avatar, title: mentor.title, hourlyRate: mentor.hourlyRate, supportedDurations: mentor.supportedDurations }}
        />

        {/* Toast */}
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </StartupShell>
  );
}
