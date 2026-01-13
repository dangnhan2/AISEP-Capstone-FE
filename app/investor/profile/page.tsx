"use client";

import { useState } from "react";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const focusSectors = ["AI & Machine Learning", "Fintech", "HealthTech", "ClimateTech", "SaaS"];
const ticketSizes = ["< 100k USD", "100k - 500k USD", "500k - 1M USD", "> 1M USD"];
const riskProfiles = ["Bảo thủ", "Cân bằng", "Tăng trưởng mạnh"];

export default function InvestorProfilePage() {
  const [form, setForm] = useState({
    name: "Investor ABC",
    organization: "ABC Capital",
    focusSector: "AI & Machine Learning",
    ticketSize: "100k - 500k USD",
    riskProfile: "Cân bằng",
    bio: "Nhà đầu tư tập trung vào các startup AI giai đoạn Seed - Series A.",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit logic
    console.log("Investor profile data:", form);
  };

  return (
    <InvestorShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Hồ sơ nhà đầu tư</h1>
          <p className="text-slate-600">
            Quản lý thông tin và ưu tiên đầu tư của bạn để AI gợi ý chính xác hơn
          </p>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Tên nhà đầu tư</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Tổ chức / Quỹ</Label>
                <Input
                  id="organization"
                  value={form.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  placeholder="Tên quỹ hoặc công ty"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusSector">Lĩnh vực quan tâm chính</Label>
                <select
                  id="focusSector"
                  value={form.focusSector}
                  onChange={(e) => handleChange("focusSector", e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {focusSectors.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketSize">Khoản đầu tư điển hình</Label>
                <select
                  id="ticketSize"
                  value={form.ticketSize}
                  onChange={(e) => handleChange("ticketSize", e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {ticketSizes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskProfile">Mức độ chấp nhận rủi ro</Label>
                <select
                  id="riskProfile"
                  value={form.riskProfile}
                  onChange={(e) => handleChange("riskProfile", e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {riskProfiles.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Giới thiệu ngắn</Label>
                <textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Chia sẻ về chiến lược, kinh nghiệm và cách bạn hỗ trợ startup"
                  className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </InvestorShell>
  );
}


