"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StartupShell } from "@/components/startup/startup-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const industries = ["AI & Technology", "Fintech", "Healthcare", "E-commerce", "EdTech", "ClimateTech"];
const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"];
const visibilityOptions = ["Public - Visible to all", "Investors only", "Private - Only me"];

export default function StartupProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "Tech Startup ABC",
    description: "AI-powered analytics platform for businesses",
    industry: "AI & Technology",
    stage: "Seed",
    email: "contact@techstartup.com",
    teamSize: "15",
    representative: "Nguyễn Văn A",
    representativePhone: "0901234567",
    projectFileUrl: "https://example.com/project-file.pdf",
    fileVisibility: "Public - Visible to all",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile data:", form);
    // TODO: handle submit logic
    router.push("/startup");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <StartupShell>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Startup Profile</h1>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  T
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 h-9 text-sm"
                >
                  Change Logo
                </Button>
              </div>

              {/* Startup Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Startup Name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-10 border-slate-300 text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
                />
              </div>

              {/* Industry and Stage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="industry" className="text-sm font-medium text-slate-700">
                    Industry
                  </Label>
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {industries.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stage" className="text-sm font-medium text-slate-700">
                    Stage
                  </Label>
                  <select
                    id="stage"
                    value={form.stage}
                    onChange={(e) => handleChange("stage", e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {stages.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email and Team Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-10 border-slate-300 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="teamSize" className="text-sm font-medium text-slate-700">
                    Team Size
                  </Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={form.teamSize}
                    onChange={(e) => handleChange("teamSize", e.target.value)}
                    className="h-10 border-slate-300 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Representative and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="representative" className="text-sm font-medium text-slate-700">
                    Representative
                  </Label>
                  <Input
                    id="representative"
                    value={form.representative}
                    onChange={(e) => handleChange("representative", e.target.value)}
                    className="h-10 border-slate-300 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="representativePhone" className="text-sm font-medium text-slate-700">
                    Representative Phone
                  </Label>
                  <Input
                    id="representativePhone"
                    type="tel"
                    value={form.representativePhone}
                    onChange={(e) => handleChange("representativePhone", e.target.value)}
                    className="h-10 border-slate-300 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Project File URL */}
              <div className="space-y-1.5">
                <Label htmlFor="projectFileUrl" className="text-sm font-medium text-slate-700">
                  Project File URL
                </Label>
                <Input
                  id="projectFileUrl"
                  type="url"
                  value={form.projectFileUrl}
                  onChange={(e) => handleChange("projectFileUrl", e.target.value)}
                  className="h-10 border-slate-300 text-sm"
                />
              </div>

              {/* File Visibility */}
              <div className="space-y-1.5">
                <Label htmlFor="fileVisibility" className="text-sm font-medium text-slate-700">
                  File Visibility
                </Label>
                <select
                  id="fileVisibility"
                  value={form.fileVisibility}
                  onChange={(e) => handleChange("fileVisibility", e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {visibilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-10 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </StartupShell>
  );
}

