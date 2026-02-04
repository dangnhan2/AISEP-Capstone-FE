"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, Trash2, Heart, Send, Clock, Bell } from "lucide-react";
import { useState } from "react";

type WatchlistItem = {
  id: number;
  name: string;
  description: string;
  logo: string;
  stage: string;
  category: string;
  location: string;
  aiScore: number;
  verification: "VERIFIED" | "PENDING";
  lastActivity: string;
  fundingNeeds: string;
  addedDate: string;
  notifications: boolean;
};

const watchlistItems: WatchlistItem[] = [
  {
    id: 1,
    name: "Tech ABC",
    description: "AI-Powered Analytics Platform",
    logo: "/api/placeholder/400/300",
    stage: "Seed",
    category: "Artificial Intelligence",
    location: "Vietnam",
    aiScore: 8.7,
    verification: "VERIFIED",
    lastActivity: "New document uploaded (2h ago)",
    fundingNeeds: "$500K",
    addedDate: "2026-01-15",
    notifications: true,
  },
  {
    id: 2,
    name: "HealthAI Pro",
    description: "AI Medical Diagnosis Assistant",
    logo: "/api/placeholder/400/300",
    stage: "Seed",
    category: "Healthcare",
    location: "Vietnam",
    aiScore: 9.1,
    verification: "VERIFIED",
    lastActivity: "AI re-evaluated (1d ago)",
    fundingNeeds: "$2.5M",
    addedDate: "2026-01-10",
    notifications: true,
  },
];

export default function InvestorWatchlistPage() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [items, setItems] = useState(watchlistItems);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleRemoveFromWatchlist = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa startup này khỏi watchlist?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleToggleNotifications = (id: number) => {
    setItems(items.map((item) => 
      item.id === id ? { ...item, notifications: !item.notifications } : item
    ));
  };

  return (
    <InvestorShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Watchlist</h1>
          <p className="text-slate-600 mt-1">Startup bạn đang theo dõi</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant={showHistory ? "default" : "outline"}
              onClick={() => setShowHistory(!showHistory)}
              className={showHistory ? "bg-blue-600 text-white" : "border-slate-300 text-slate-700"}
            >
              <Clock className="w-4 h-4 mr-2" />
              {showHistory ? "Hiện watchlist hiện tại" : "Xem lịch sử watchlist"}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Watchlist Cards */}
        {!showHistory ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWatchlist(item.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:text-red-600"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                  <button
                    onClick={() => handleToggleNotifications(item.id)}
                    className={`absolute top-4 left-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center ${
                      item.notifications ? "text-blue-600" : "text-slate-400"
                    } hover:text-blue-700`}
                    title={item.notifications ? "Tắt thông báo" : "Bật thông báo"}
                  >
                    <Bell className={`w-5 h-5 ${item.notifications ? "fill-current" : ""}`} />
                  </button>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs px-3 py-1">
                      {item.category}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs px-3 py-1">
                      {item.stage}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Chi tiết
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Gửi đề nghị
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Lịch sử Watchlist</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded overflow-hidden">
                        <img src={item.logo} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-600">Đã thêm: {new Date(item.addedDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {item.category}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Đang theo dõi
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </InvestorShell>
  );
}


