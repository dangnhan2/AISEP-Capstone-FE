"use client";

import { useState } from "react";
import { AdvisorShell } from "@/components/advisor/advisor-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

const specializations = [
  "AI & Technology",
  "Business Strategy",
  "Marketing & Growth",
  "Finance & Funding",
  "Product Development",
  "Legal & Compliance",
];

export default function AdvisorProfilePage() {
  const [form, setForm] = useState({
    fullName: "Nguyễn Văn A",
    specialization: "AI & Technology",
    experience: "15+ năm",
    consultationAreas: "AI, Machine Learning, Business Strategy",
    consultationFee: "$150/giờ",
    introduction: "Chuyên gia công nghệ với hơn 15 năm kinh nghiệm trong lĩnh vực AI và phát triển sản phẩm",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit logic
    console.log("Advisor profile data:", form);
  };

  return (
    <AdvisorShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hồ sơ Chuyên gia</h1>
          <p className="text-slate-600 mt-1">Quản lý thông tin và chuyên môn</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-900 font-medium">
                  Họ và tên
                </Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="h-12 border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-slate-900 font-medium">
                  Chuyên môn chính
                </Label>
                <div className="relative">
                  <select
                    id="specialization"
                    value={form.specialization}
                    onChange={(e) => handleChange("specialization", e.target.value)}
                    className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 appearance-none"
                  >
                    {specializations.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-slate-900 font-medium">
                  Kinh nghiệm
                </Label>
                <Input
                  id="experience"
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  placeholder="Ví dụ: 15+ năm"
                  className="h-12 border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultationAreas" className="text-slate-900 font-medium">
                  Lĩnh vực tư vấn
                </Label>
                <Input
                  id="consultationAreas"
                  value={form.consultationAreas}
                  onChange={(e) => handleChange("consultationAreas", e.target.value)}
                  placeholder="Ví dụ: AI, Machine Learning, Business Strategy"
                  className="h-12 border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultationFee" className="text-slate-900 font-medium">
                  Chi phí tư vấn
                </Label>
                <Input
                  id="consultationFee"
                  value={form.consultationFee}
                  onChange={(e) => handleChange("consultationFee", e.target.value)}
                  placeholder="Ví dụ: $150/giờ"
                  className="h-12 border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="introduction" className="text-slate-900 font-medium">
                  Giới thiệu
                </Label>
                <textarea
                  id="introduction"
                  value={form.introduction}
                  onChange={(e) => handleChange("introduction", e.target.value)}
                  placeholder="Giới thiệu về bản thân và kinh nghiệm của bạn"
                  className="min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 resize-none"
                  required
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdvisorShell>
  );
}

