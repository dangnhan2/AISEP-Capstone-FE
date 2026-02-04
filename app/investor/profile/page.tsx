"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InvestorShell } from "@/components/investor/investor-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";

const focusSectors = [
  "AI & Technology",
  "Fintech", 
  "HealthTech", 
  "ClimateTech", 
  "SaaS",
  "E-commerce",
  "EdTech"
];

export default function InvestorProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "Nguyễn Văn A",
    description: "Nhà đầu tư với 10+ năm kinh nghiệm trong lĩnh vực công nghệ và AI",
    focusSector: "AI & Technology",
    achievements: "Đầu tư thành công vào 25+ startups, 8 exits, Former Partner tại XYZ Ventures",
    email: "investor@example.com",
    representative: "Nguyễn Văn A",
    phone: "0901234567",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Investor profile data:", form);
    // TODO: handle submit logic
    router.push("/investor");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <InvestorShell>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Hồ sơ Investor</h1>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar Section */}
              <div className="flex items-center gap-4 pb-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  N
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 h-9"
                >
                  Thay đổi ảnh
                </Button>
              </div>

              {/* Tên Investor */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-slate-900">
                  Tên Investor
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-11 border-slate-300"
                  required
                />
              </div>

              {/* Mô tả */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium text-slate-900">
                  Mô tả
                </Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[90px] w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
                />
              </div>

              {/* Lĩnh vực quan tâm */}
              <div className="space-y-1.5">
                <Label htmlFor="focusSector" className="text-sm font-medium text-slate-900">
                  Lĩnh vực quan tâm
                </Label>
                <select
                  id="focusSector"
                  value={form.focusSector}
                  onChange={(e) => handleChange("focusSector", e.target.value)}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {focusSectors.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thành tích */}
              <div className="space-y-1.5">
                <Label htmlFor="achievements" className="text-sm font-medium text-slate-900">
                  Thành tích
                </Label>
                <textarea
                  id="achievements"
                  value={form.achievements}
                  onChange={(e) => handleChange("achievements", e.target.value)}
                  className="min-h-[90px] w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="h-11 border-slate-300"
                  required
                />
              </div>

              {/* Người đại diện */}
              <div className="space-y-1.5">
                <Label htmlFor="representative" className="text-sm font-medium text-slate-900">
                  Người đại diện
                </Label>
                <Input
                  id="representative"
                  value={form.representative}
                  onChange={(e) => handleChange("representative", e.target.value)}
                  className="h-11 border-slate-300"
                  required
                />
              </div>

              {/* Số điện thoại người đại diện */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-900">
                  Số điện thoại người đại diện
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="h-11 border-slate-300"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </InvestorShell>
  );
}


