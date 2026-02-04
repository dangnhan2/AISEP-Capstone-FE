"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Sparkles, Eye, Mail, Globe, CheckCircle, X } from "lucide-react";
import { useState } from "react";

type Recommendation = {
  id: number;
  name: string;
  initials: string;
  category: string;
  stage: string;
  location: string;
  aiScore: number;
  matchLevel: string;
  matchColor: string;
  reason: string;
  about: string;
  founded: string;
  teamSize: string;
  totalFunding: string;
  currentInvestors: string;
  email: string;
  website: string;
  keyHighlights: string[];
};

const recommendations: Recommendation[] = [
  {
    id: 1,
    name: "FinNext",
    initials: "FN",
    category: "Fintech",
    stage: "Series A",
    location: "Ho Chi Minh City",
    aiScore: 9.2,
    matchLevel: "Excellent Match",
    matchColor: "bg-green-500",
    reason:
      "Strong product-market fit in digital banking for SMEs. Experienced founding team from banking sector.",
    about:
      "Digital banking platform for SMEs providing payment, financial management, and credit services.",
    founded: "2022",
    teamSize: "25 people",
    totalFunding: "$3.2M",
    currentInvestors: "ABC Ventures, XYZ Capital",
    email: "contact@finnext.com",
    website: "www.finnext.com",
    keyHighlights: [
      "500+ active business customers",
      "Growing 40% MoM",
      "Partnership with 3 major banks",
      "Regulatory compliance achieved",
    ],
  },
  {
    id: 2,
    name: "HealthAI Pro",
    initials: "HP",
    category: "Healthcare Tech",
    stage: "Seed",
    location: "Hanoi",
    aiScore: 8.8,
    matchLevel: "Very Good Match",
    matchColor: "bg-cyan-500",
    reason:
      "FDA-approved AI algorithm for medical imaging. Strong hospital partnerships and high accuracy rate.",
    about:
      "AI-powered medical imaging platform for early disease detection and diagnosis support.",
    founded: "2023",
    teamSize: "18 people",
    totalFunding: "$2.1M",
    currentInvestors: "MedTech Ventures, Health Capital",
    email: "info@healthaipro.com",
    website: "www.healthaipro.com",
    keyHighlights: [
      "FDA-approved algorithm",
      "Partnership with 15 hospitals",
      "95% accuracy rate",
      "Processing 10K+ scans monthly",
    ],
  },
  {
    id: 3,
    name: "Tech ABC",
    initials: "TA",
    category: "AI & ML",
    stage: "Seed",
    location: "Da Nang",
    aiScore: 8.5,
    matchLevel: "Good Match",
    matchColor: "bg-cyan-400",
    reason:
      "Innovative AI analytics platform with proven traction. Strong technical team with 50+ paying customers.",
    about:
      "AI-powered analytics platform helping businesses make data-driven decisions.",
    founded: "2023",
    teamSize: "12 people",
    totalFunding: "$1.5M",
    currentInvestors: "Tech Ventures, Innovation Fund",
    email: "hello@techabc.com",
    website: "www.techabc.com",
    keyHighlights: [
      "50+ paying customers",
      "20% MoM revenue growth",
      "Strong technical team",
      "Enterprise clients in 5 countries",
    ],
  },
  {
    id: 4,
    name: "EduTech Pro",
    initials: "EP",
    category: "EdTech",
    stage: "Pre-Seed",
    location: "Ho Chi Minh City",
    aiScore: 8.2,
    matchLevel: "Good Match",
    matchColor: "bg-pink-500",
    reason:
      "Growing EdTech market with innovative approach. Strong early traction with schools and students.",
    about:
      "Online learning platform connecting students with expert tutors for personalized education.",
    founded: "2024",
    teamSize: "8 people",
    totalFunding: "$800K",
    currentInvestors: "EduVentures, Seed Capital",
    email: "contact@edutechpro.com",
    website: "www.edutechpro.com",
    keyHighlights: [
      "10K+ active students",
      "Partnership with 50+ schools",
      "4.8/5 user rating",
      "Expanding to 3 new cities",
    ],
  },
];

export default function AIRecommendationsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<Recommendation | null>(null);

  return (
    <InvestorShell>
      <div className="space-y-6">{/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Recommendations</h1>
          <p className="text-slate-600 mt-1">
            Startup được AI gợi ý dựa trên portfolio và preferences
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-4xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm startup..."
            className="pl-12 h-12 border-slate-300"
          />
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <Card 
              key={rec.id} 
              className="hover:shadow-lg transition-shadow relative"
              onMouseEnter={() => setHoveredCard(rec.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6">
                {/* Eye Icon on Hover */}
                {hoveredCard === rec.id && (
                  <div 
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setSelectedStartup(rec)}
                  >
                    <Eye className="w-5 h-5 text-slate-600" />
                  </div>
                )}

                {/* Header with Logo and Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">{rec.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-slate-900 mb-2">
                      {rec.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <span>{rec.category}</span>
                      <span>•</span>
                      <span>{rec.stage}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{rec.location}</span>
                    </div>
                  </div>
                </div>

                {/* Match Badge */}
                <div className="mb-4">
                  <Badge className={`${rec.matchColor} text-white hover:${rec.matchColor} border-0 px-3 py-1.5 text-sm font-semibold`}>
                    <Sparkles className="w-4 h-4 mr-1" />
                    {rec.aiScore}/10 • {rec.matchLevel}
                  </Badge>
                </div>

                {/* Why recommended */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Why recommended for you
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Startup Detail Modal */}
      {selectedStartup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {selectedStartup.initials}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    {selectedStartup.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                      {selectedStartup.category}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">
                      {selectedStartup.stage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedStartup.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 relative">
                  <div className="bg-green-500 text-white rounded-md px-4 py-2 flex flex-col items-center">
                    <div className="text-2xl font-bold leading-tight">{selectedStartup.aiScore}</div>
                    <div className="text-xs font-normal">AI-Score</div>
                  </div>
                  <button
                    onClick={() => setSelectedStartup(null)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-transparent hover:bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* About */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">About</h3>
                <p className="text-slate-600 leading-relaxed">{selectedStartup.about}</p>
              </div>

              {/* Why AI recommends */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-semibold text-purple-900">
                    Why AI recommends this startup
                  </h3>
                </div>
                <p className="text-slate-700 leading-relaxed">{selectedStartup.reason}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Founded</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {selectedStartup.founded}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Team Size</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {selectedStartup.teamSize}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Total Funding</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {selectedStartup.totalFunding}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Current Investors</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {selectedStartup.currentInvestors}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                  <div className="text-slate-900">{selectedStartup.email}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </div>
                  <a
                    href={`https://${selectedStartup.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedStartup.website}
                  </a>
                </div>
              </div>

              {/* Key Highlights */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Key Highlights
                </h3>
                <div className="space-y-2">
                  {selectedStartup.keyHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200">
              <Button
                onClick={() => setSelectedStartup(null)}
                variant="outline"
                className="w-full h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </InvestorShell>
  );
}
