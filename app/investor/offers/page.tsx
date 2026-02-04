"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, FileText, Calendar, Edit, Trash2, X, Plus } from "lucide-react";
import { useState } from "react";

type OfferStatus = "pending" | "under-review" | "accepted" | "declined";

type Offer = {
  id: number;
  startup: string;
  description: string;
  amount: string;
  type: string;
  date: string;
  status: OfferStatus;
};

const offers: Offer[] = [
  {
    id: 1,
    startup: "Tech ABC",
    description: "Investment for Series A round with 5% equity stake",
    amount: "$50,000",
    type: "Equity Investment",
    date: "2026-02-01",
    status: "pending",
  },
  {
    id: 2,
    startup: "HealthAI Pro",
    description: "Convertible note with 20% discount and $5M valuation cap",
    amount: "$75,000",
    type: "Convertible Note",
    date: "2026-01-28",
    status: "under-review",
  },
  {
    id: 3,
    startup: "FinNext",
    description: "SAFE agreement with post-money valuation cap",
    amount: "$100,000",
    type: "SAFE Agreement",
    date: "2026-01-20",
    status: "accepted",
  },
];

export default function InvestorOffersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [form, setForm] = useState({
    startup: "",
    amount: "",
    type: "",
    description: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create offer:", form);
    setShowCreateModal(false);
    setForm({ startup: "", amount: "", type: "", description: "" });
  };

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setForm({
      startup: offer.startup,
      amount: offer.amount.replace("$", "").replace(",", ""),
      type: offer.type,
      description: offer.description,
    });
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update offer:", form);
    setShowEditModal(false);
    setSelectedOffer(null);
    setForm({ startup: "", amount: "", type: "", description: "" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa đề nghị này?")) {
      console.log("Delete offer:", id);
    }
  };

  const getStatusBadge = (status: OfferStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 px-3 py-1">
            Pending
          </Badge>
        );
      case "under-review":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 px-3 py-1">
            Under Review
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 px-3 py-1">
            Accepted
          </Badge>
        );
      case "declined":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 px-3 py-1">
            Declined
          </Badge>
        );
    }
  };

  return (
    <InvestorShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Investment Offers</h1>
            <p className="text-slate-600 mt-1">Quản lý các đề nghị đầu tư của bạn</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-11 px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo đề nghị mới
          </Button>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header with Startup name and Status */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">{offer.startup}</h3>
                      {getStatusBadge(offer.status)}
                    </div>

                    {/* Description */}
                    <p className="text-slate-600">{offer.description}</p>

                    {/* Details */}
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{offer.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{offer.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{offer.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Tạo đề nghị đầu tư mới</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleCreate} className="space-y-5">
                {/* Chọn Startup */}
                <div className="space-y-2">
                  <Label htmlFor="startup" className="text-sm font-medium text-slate-900">
                    Chọn Startup
                  </Label>
                  <select
                    id="startup"
                    value={form.startup}
                    onChange={(e) => handleChange("startup", e.target.value)}
                    className="w-full h-11 px-3 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn startup...</option>
                    <option value="Tech ABC">Tech ABC</option>
                    <option value="HealthAI Pro">HealthAI Pro</option>
                    <option value="FinNext">FinNext</option>
                    <option value="EduTech Pro">EduTech Pro</option>
                  </select>
                </div>

                {/* Số tiền đầu tư */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-slate-900">
                    Số tiền đầu tư (USD)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    placeholder="50000"
                    className="h-11 border-slate-300"
                    required
                  />
                </div>

                {/* Loại đầu tư */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium text-slate-900">
                    Loại đầu tư
                  </Label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full h-11 px-3 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn loại đầu tư...</option>
                    <option value="Equity Investment">Equity Investment</option>
                    <option value="Convertible Note">Convertible Note</option>
                    <option value="SAFE Agreement">SAFE Agreement</option>
                  </select>
                </div>

                {/* Mô tả */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-slate-900">
                    Mô tả
                  </Label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Mô tả điều khoản và điều kiện..."
                    className="w-full min-h-[120px] px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  >
                    Tạo đề nghị
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Chỉnh sửa đề nghị</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedOffer(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Startup */}
                <div className="space-y-2">
                  <Label htmlFor="edit-startup" className="text-sm font-medium text-slate-900">
                    Startup
                  </Label>
                  <Input
                    id="edit-startup"
                    type="text"
                    value={form.startup}
                    onChange={(e) => handleChange("startup", e.target.value)}
                    className="h-11 border-slate-300"
                    required
                    readOnly
                  />
                </div>

                {/* Số tiền đầu tư */}
                <div className="space-y-2">
                  <Label htmlFor="edit-amount" className="text-sm font-medium text-slate-900">
                    Số tiền đầu tư (USD)
                  </Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    className="h-11 border-slate-300"
                    required
                  />
                </div>

                {/* Loại đầu tư */}
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-sm font-medium text-slate-900">
                    Loại đầu tư
                  </Label>
                  <select
                    id="edit-type"
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full h-11 px-3 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Equity Investment">Equity Investment</option>
                    <option value="Convertible Note">Convertible Note</option>
                    <option value="SAFE Agreement">SAFE Agreement</option>
                  </select>
                </div>

                {/* Mô tả */}
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-sm font-medium text-slate-900">
                    Mô tả
                  </Label>
                  <textarea
                    id="edit-description"
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="w-full min-h-[120px] px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedOffer(null);
                    }}
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
      )}
    </InvestorShell>
  );
}


