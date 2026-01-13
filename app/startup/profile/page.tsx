"use client";

import { useState } from "react";
import { StartupShell } from "@/components/startup/startup-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sectors = ["AI & Machine Learning", "Fintech", "HealthTech", "EdTech", "E-commerce"];
const stages = ["Pre-seed", "Seed", "Series A", "Series B+"];
const teamSizes = ["1-5", "5-10", "10-20", "20+"];

export default function StartupProfilePage() {
  const [form, setForm] = useState({
    name: "Tech Startup ABC",
    sector: "AI & Machine Learning",
    stage: "Seed",
    teamSize: "5-10",
    description: "Startup phát triển giải pháp AI cho doanh nghiệp",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit logic
    console.log("Profile data:", form);
  };

  return (
    <StartupShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Hồ sơ Startup</h1>
          <p className="text-slate-600">Quản lý thông tin và hồ sơ startup</p>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Tên startup</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nhập tên startup"
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Lĩnh vực</Label>
                <select
                  id="sector"
                  value={form.sector}
                  onChange={(e) => handleChange("sector", e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {sectors.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Giai đoạn</Label>
                <select
                  id="stage"
                  value={form.stage}
                  onChange={(e) => handleChange("stage", e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {stages.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Quy mô team</Label>
                <select
                  id="teamSize"
                  value={form.teamSize}
                  onChange={(e) => handleChange("teamSize", e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {teamSizes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Mô tả ngắn gọn về startup"
                  className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </StartupShell>
  );
}

