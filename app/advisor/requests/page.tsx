"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Clock, Calendar, Users, Info, ChevronDown } from "lucide-react";
import { AdvisorShell } from "@/components/advisor/advisor-shell";

type ConsultationRequest = {
  id: string;
  companyName: string;
  companyInitials: string;
  companyColor: string;
  status: "urgent" | "new" | "normal";
  stage: string;
  topic: string;
  description: string;
  consultationType: string;
  consultationIcon: "clock" | "calendar" | "users";
  consultationDetail: string;
  dateTime?: string;
  requesterName: string;
  requesterRole: string;
  requesterInitials: string;
  requesterColor: string;
  timeAgo: string;
  rate: string;
};

const requests: ConsultationRequest[] = [
  {
    id: "1",
    companyName: "FinTech AI",
    companyInitials: "FA",
    companyColor: "bg-teal-500",
    status: "urgent",
    stage: "Seed",
    topic: "FinTech",
    description: "Initial consultation on fundraising strategy for $2M seed round. Need guidance on valuation, pitch deck, and investor targeting.",
    consultationType: "1-hour consultation",
    consultationIcon: "clock",
    consultationDetail: "Feb 2, 2PM PST",
    requesterName: "Sarah Johnson",
    requesterRole: "CEO",
    requesterInitials: "SJ",
    requesterColor: "bg-blue-600",
    timeAgo: "2 hours ago",
    rate: "$250/hr",
  },
  {
    id: "2",
    companyName: "HealthTech Solutions",
    companyInitials: "HS",
    companyColor: "bg-purple-500",
    status: "new",
    stage: "Pre-seed",
    topic: "HealthTech",
    description: "Product-market fit guidance for our healthcare appointment scheduling app targeting small clinics.",
    consultationType: "3-month mentorship",
    consultationIcon: "users",
    consultationDetail: "Weekly sessions",
    requesterName: "Mike Rodriguez",
    requesterRole: "Founder",
    requesterInitials: "MR",
    requesterColor: "bg-purple-600",
    timeAgo: "5 hours ago",
    rate: "$200/hr",
  },
  {
    id: "3",
    companyName: "EduPlatform",
    companyInitials: "EP",
    companyColor: "bg-orange-500",
    status: "normal",
    stage: "Series A",
    topic: "EdTech",
    description: "Workshop facilitation for product team alignment on roadmap priorities and user research insights.",
    consultationType: "Workshop (2 hours)",
    consultationIcon: "users",
    consultationDetail: "Feb 5, 10AM PST",
    requesterName: "Lisa Wang",
    requesterRole: "CPO",
    requesterInitials: "LW",
    requesterColor: "bg-amber-700",
    timeAgo: "1 day ago",
    rate: "$300/hr",
  },
  {
    id: "4",
    companyName: "CloudSync Pro",
    companyInitials: "CS",
    companyColor: "bg-green-500",
    status: "urgent",
    stage: "Seed",
    topic: "B2B SaaS",
    description: "Emergency consultation needed on competitor analysis and pricing strategy pivot before investor meeting.",
    consultationType: "90-minute session",
    consultationIcon: "clock",
    consultationDetail: "Feb 1, 4PM PST",
    requesterName: "David Chen",
    requesterRole: "Founder",
    requesterInitials: "DC",
    requesterColor: "bg-green-600",
    timeAgo: "3 hours ago",
    rate: "$275/hr",
  },
  {
    id: "5",
    companyName: "GreenEnergy Tech",
    companyInitials: "GE",
    companyColor: "bg-emerald-500",
    status: "new",
    stage: "Pre-seed",
    topic: "CleanTech",
    description: "Market entry strategy for renewable energy solutions in Southeast Asia. Need advice on regulatory compliance and partnerships.",
    consultationType: "2-hour consultation",
    consultationIcon: "clock",
    consultationDetail: "Feb 3, 3PM PST",
    requesterName: "Emma Thompson",
    requesterRole: "CEO",
    requesterInitials: "ET",
    requesterColor: "bg-emerald-600",
    timeAgo: "6 hours ago",
    rate: "$225/hr",
  },
  {
    id: "6",
    companyName: "FoodieApp",
    companyInitials: "FA",
    companyColor: "bg-red-500",
    status: "normal",
    stage: "Seed",
    topic: "Consumer Tech",
    description: "User acquisition strategy and growth hacking techniques for food delivery platform. Focus on retention metrics.",
    consultationType: "Monthly mentorship",
    consultationIcon: "users",
    consultationDetail: "Bi-weekly sessions",
    requesterName: "James Wilson",
    requesterRole: "CMO",
    requesterInitials: "JW",
    requesterColor: "bg-red-600",
    timeAgo: "2 days ago",
    rate: "$180/hr",
  },
  {
    id: "7",
    companyName: "SecureVault",
    companyInitials: "SV",
    companyColor: "bg-indigo-500",
    status: "normal",
    stage: "Series A",
    topic: "Cybersecurity",
    description: "Technical architecture review for enterprise security platform. Need guidance on scalability and compliance standards.",
    consultationType: "4-hour workshop",
    consultationIcon: "users",
    consultationDetail: "Feb 6, 9AM PST",
    requesterName: "Alex Kumar",
    requesterRole: "CTO",
    requesterInitials: "AK",
    requesterColor: "bg-indigo-600",
    timeAgo: "3 days ago",
    rate: "$320/hr",
  },
];

export default function AdvisorRequestsPage() {
  const handleAccept = (id: string) => {
    console.log("Accept request:", id);
    // TODO: Implement accept logic
  };

  const handleDecline = (id: string) => {
    console.log("Decline request:", id);
    // TODO: Implement decline logic
  };

  const getStatusBadge = (status: string) => {
    if (status === "urgent") {
      return (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-lg" />
      );
    }
    if (status === "new") {
      return (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />
      );
    }
    return null;
  };

  const getStatusLabel = (status: string) => {
    if (status === "urgent") {
      return (
        <Badge className="bg-red-500 text-white border-0 hover:bg-red-500">
          URGENT
        </Badge>
      );
    }
    if (status === "new") {
      return (
        <Badge className="bg-blue-500 text-white border-0 hover:bg-blue-500">
          NEW
        </Badge>
      );
    }
    return null;
  };

  const getConsultationIcon = (icon: string) => {
    switch (icon) {
      case "clock":
        return <Clock className="w-4 h-4" />;
      case "calendar":
        return <Calendar className="w-4 h-4" />;
      case "users":
        return <Users className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <AdvisorShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Consultation Requests</h1>
          <p className="text-slate-600 mt-1">Manage your pending consultation requests</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">All Requests (7)</label>
            <Select className="w-[180px]">
              <option>All Requests (7)</option>
              <option>Pending (7)</option>
              <option>Accepted (0)</option>
              <option>Declined (0)</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">All Stages</label>
            <Select className="w-[180px]">
              <option>All Stages</option>
              <option>Pre-seed</option>
              <option>Seed</option>
              <option>Series A</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">All Topics</label>
            <Select className="w-[180px]">
              <option>All Topics</option>
              <option>FinTech</option>
              <option>HealthTech</option>
              <option>EdTech</option>
              <option>B2B SaaS</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Sort by: Most Recent</label>
            <Select className="w-[180px]">
              <option>Most Recent</option>
              <option>Oldest First</option>
              <option>Rate: High to Low</option>
              <option>Rate: Low to High</option>
            </Select>
          </div>
        </div>

        {/* Pending Requests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Pending Requests (7)</h2>
            <a href="#" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              View All
            </a>
          </div>

          <div className="space-y-4">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="border-slate-200 shadow-sm relative overflow-hidden"
              >
                {getStatusBadge(request.status)}
                <CardContent className="p-6 pl-7">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 space-y-4">
                      {/* Company Header */}
                      <div className="flex items-center gap-3">
                        {getStatusLabel(request.status)}
                        <Avatar className={`${request.companyColor} h-10 w-10`}>
                          <AvatarFallback className={`${request.companyColor} text-white font-semibold`}>
                            {request.companyInitials}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {request.companyName}
                        </h3>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-slate-600 border-slate-300">
                          {request.stage}
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 border-slate-300">
                          {request.topic}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {request.description}
                      </p>

                      {/* Consultation Details */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-blue-500">
                          {getConsultationIcon(request.consultationIcon)}
                          <span>{request.consultationType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-500">
                          <Calendar className="w-4 h-4" />
                          <span>{request.consultationDetail}</span>
                        </div>
                      </div>

                      {/* Requester Info */}
                      <div className="flex items-center gap-3">
                        <Avatar className={`${request.requesterColor} h-8 w-8`}>
                          <AvatarFallback className={`${request.requesterColor} text-white text-xs font-semibold`}>
                            {request.requesterInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {request.requesterName}, {request.requesterRole}
                          </p>
                          <p className="text-xs text-slate-500">{request.timeAgo}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-4">
                      {/* Rate */}
                      <div className="text-right">
                        <p className="text-blue-500 font-semibold text-lg">{request.rate}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleAccept(request.id)}
                          className="bg-teal-500 hover:bg-teal-600 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleDecline(request.id)}
                          variant="outline"
                          className="border-slate-300 hover:bg-slate-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdvisorShell>
  );
}
