"use client";

import { StartupShell } from "@/components/startup/startup-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
};

const notifications: Notification[] = [
  {
    id: "1",
    title: "Báo cáo AI mới đã sẵn sàng",
    description: "Startup Potential Score của bạn đã được cập nhật",
    time: "2 giờ trước",
  },
  {
    id: "2",
    title: "Xác thực blockchain thành công",
    description: 'Tài liệu "Pitch Deck 2024.pdf" đã được xác thực',
    time: "5 giờ trước",
  },
  {
    id: "3",
    title: "Nhà đầu tư mới quan tâm",
    description: "XYZ Capital đã gửi lời đề nghị hợp tác",
    time: "1 ngày trước",
  },
];

export default function NotificationsPage() {
  return (
    <StartupShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
          <p className="text-slate-600 mt-1">Theo dõi các cập nhật quan trọng</p>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className="border-slate-200 bg-slate-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Bell Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {notification.description}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-sm text-slate-500">
                    {notification.time}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StartupShell>
  );
}

