"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, ShieldCheck } from "lucide-react";

const logs = [
  { time: "10:32", actor: "admin@aisep.vn", action: "LOCK_USER", target: "user.abc@mail.com", status: "warning" },
  { time: "09:15", actor: "system", action: "AI_EVAL_COMPLETED", target: "Startup Beta", status: "healthy" },
  { time: "08:47", actor: "admin@aisep.vn", action: "ROLE_ASSIGNED", target: "advisor_role → tuan", status: "healthy" },
  { time: "08:21", actor: "system", action: "BLOCKCHAIN_SYNC", target: "Block #198432", status: "healthy" },
];

function statusClass(status: string) {
  return status === "healthy"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";
}

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  return (
    <AdminShell>
      <div className="px-8 py-7 space-y-6 pb-16 animate-in fade-in duration-400">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[13px] font-semibold text-amber-600 uppercase tracking-[0.24em]">Audit Logs</p>
            <h1 className="text-3xl font-semibold text-slate-950">Activity & Compliance</h1>
            <p className="max-w-2xl text-sm text-slate-500 mt-2">Duyệt lịch sử thay đổi và kiểm tra audit trail cho toàn bộ hệ thống.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Download CSV</Button>
            <Button>Refresh logs</Button>
          </div>
        </div>

        <Card className="border-slate-200">
          <CardContent>
            <div className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr_0.8fr] items-end">
              <div>
                <Label htmlFor="search">Search audit</Label>
                <div className="mt-2 relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by actor, action or target"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="type">Log type</Label>
                <Select id="type" value={type} onChange={(event) => setType(event.target.value)} className="mt-2">
                  <option value="all">All events</option>
                  <option value="admin">Admin actions</option>
                  <option value="system">System events</option>
                </Select>
              </div>
              <div>
                <Label className="opacity-0">Action</Label>
                <Button className="w-full">Apply filter</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-700" /><CardTitle className="text-lg">Latest audit entries</CardTitle></div>
            <CardDescription>Hiển thị 20 bản ghi mới nhất với trạng thái và nguồn gốc.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {logs.map((log) => (
                  <tr key={`${log.time}-${log.action}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{log.time}</td>
                    <td className="px-4 py-3">{log.actor}</td>
                    <td className="px-4 py-3">{log.action}</td>
                    <td className="px-4 py-3">{log.target}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(log.status)}`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-slate-700" /><CardTitle className="text-lg">Audit readiness</CardTitle></div>
            <CardDescription>Chuẩn bị báo cáo và chuỗi truy xuất nguồn gốc cho compliance review.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Retention</p>
              <p className="text-2xl font-semibold text-slate-900 mt-2">90 days</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Immutable logs</p>
              <p className="text-2xl font-semibold text-slate-900 mt-2">Enabled</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Report cadence</p>
              <p className="text-2xl font-semibold text-slate-900 mt-2">Weekly</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
