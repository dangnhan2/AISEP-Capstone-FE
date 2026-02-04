"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, MapPin, Eye } from "lucide-react";
import { useState } from "react";

type StartupItem = {
  id: number;
  name: string;
  description: string;
  logo: string;
  initials: string;
  category: string;
  stage: string;
  location: string;
  valuation: string;
  aiScore: number;
  watchlisted?: boolean;
};

const startups: StartupItem[] = [
  {
    id: 1,
    name: "Tech ABC",
    description: "AI-powered analytics platform",
    logo: "/api/placeholder/400/300",
    initials: "TA",
    category: "AI & Technology",
    stage: "Seed",
    location: "Ho Chi Minh City",
    valuation: "$8M",
    aiScore: 8.5,
    watchlisted: true,
  },
  {
    id: 2,
    name: "FinNext",
    description: "Digital banking for SMEs",
    logo: "/api/placeholder/400/300",
    initials: "FN",
    category: "Fintech",
    stage: "Series A",
    location: "Hanoi",
    valuation: "$25M",
    aiScore: 9.2,
  },
  {
    id: 3,
    name: "HealthAI Pro",
    description: "AI medical diagnosis assistant",
    logo: "/api/placeholder/400/300",
    initials: "HP",
    category: "Healthcare",
    stage: "Seed",
    location: "Da Nang",
    valuation: "$10M",
    aiScore: 8.8,
    watchlisted: true,
  },
];

const categories = [
  "All Categories",
  "AI & Machine Learning",
  "FinTech",
  "HealthTech",
  "EdTech",
];

const stages = ["All Stages", "Pre-Seed", "Seed", "Series A", "Series B"];

export default function InvestorStartupsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả lĩnh vực");
  const [selectedStage, setSelectedStage] = useState("Tất cả giai đoạn");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <InvestorShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Khám phá Startup</h1>
          <p className="text-slate-600 mt-1">Tìm kiếm và đánh giá các startup tiềm năng</p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm startup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-slate-300"
            />
          </div>
          <select
            className="px-4 h-12 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>Tất cả lĩnh vực</option>
            <option>AI & Machine Learning</option>
            <option>FinTech</option>
            <option>HealthTech</option>
            <option>EdTech</option>
          </select>
          <select
            className="px-4 h-12 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            <option>Tất cả giai đoạn</option>
            <option>Pre-Seed</option>
            <option>Seed</option>
            <option>Series A</option>
            <option>Series B</option>
          </select>
        </div>

        {/* Startup Cards Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
          {startups.map((startup) => (
            <Card key={startup.id} className="hover:shadow-lg transition-shadow relative">
              {/* Heart Icon */}
              <button
                className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center ${
                  startup.watchlisted
                    ? "text-red-500"
                    : "text-slate-400 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    startup.watchlisted ? "fill-current" : ""
                  }`}
                />
              </button>

              <CardContent className="p-6">
                {/* Logo and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">{startup.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-slate-900 mb-1">
                      {startup.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {startup.description}
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs px-3 py-1 font-medium">
                    {startup.category}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs px-3 py-1 font-medium">
                    {startup.stage}
                  </Badge>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{startup.location}</span>
                </div>

                {/* Valuation */}
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                  <span className="text-base">🔥</span>
                  <span>Valuation: <span className="font-semibold">{startup.valuation}</span></span>
                </div>

                {/* AI Evaluation */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">AI Evaluation</span>
                    <span className="text-lg font-bold text-blue-600">{startup.aiScore}/10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                      style={{ width: `${startup.aiScore * 10}%` }}
                    />
                  </div>
                </div>

                {/* View Details Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  <Eye className="w-4 h-4 mr-2" />
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </InvestorShell>
  );
}


