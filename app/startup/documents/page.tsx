"use client";

import { StartupShell } from "@/components/startup/startup-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye, Edit, Trash2, Shield } from "lucide-react";

type DocumentItem = {
  name: string;
  updateDate: string;
  type: string;
  typeColor: string;
  fileHash: string;
  transactionHash: string;
  blockNumber: string;
};

const documents: DocumentItem[] = [
  {
    name: "Business Plan 2026",
    updateDate: "2026-02-01",
    type: "Business Document",
    typeColor: "bg-blue-100 text-blue-700",
    fileHash: "0xabc123...def456",
    transactionHash: "0x789xyz...012abc",
    blockNumber: "15234567",
  },
  {
    name: "Patent Application",
    updateDate: "2026-01-28",
    type: "IP Document",
    typeColor: "bg-purple-100 text-purple-700",
    fileHash: "0xdef789...ghi012",
    transactionHash: "0x345uvw...678rst",
    blockNumber: "15234520",
  },
  {
    name: "Financial Report Q4 2025",
    updateDate: "2026-01-15",
    type: "Financial Document",
    typeColor: "bg-blue-100 text-blue-700",
    fileHash: "0xjkl345...mno678",
    transactionHash: "0x901efg...234hij",
    blockNumber: "15234400",
  },
];

export default function StartupDocumentsPage() {
  return (
    <StartupShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Document & IP</h1>
            <p className="text-slate-600">Quản lý tài liệu và sở hữu trí tuệ</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Document Name</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Update Date</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Type</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">File Hash</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Transaction Hash</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Block Number</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{doc.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{doc.updateDate}</td>
                  <td className="px-6 py-4">
                    <Badge className={`${doc.typeColor} hover:${doc.typeColor} border-0 font-normal text-xs`}>
                      {doc.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{doc.fileHash}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{doc.transactionHash}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{doc.blockNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-blue-50 rounded-md transition-colors" title="View">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-md transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      <button className="p-2 hover:bg-purple-50 rounded-md transition-colors" title="Verify">
                        <Shield className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {documents.map((doc, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                <Badge className={`${doc.typeColor} hover:${doc.typeColor} border-0 font-normal text-xs shrink-0`}>
                  {doc.type}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Update Date:</span>
                  <span className="text-slate-900">{doc.updateDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Block Number:</span>
                  <span className="text-slate-900">{doc.blockNumber}</span>
                </div>
                <div>
                  <div className="text-slate-600 mb-1">File Hash:</div>
                  <div className="text-slate-900 font-mono text-xs break-all">{doc.fileHash}</div>
                </div>
                <div>
                  <div className="text-slate-600 mb-1">Transaction Hash:</div>
                  <div className="text-slate-900 font-mono text-xs break-all">{doc.transactionHash}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                <button className="p-2 hover:bg-blue-50 rounded-md transition-colors" title="View">
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-2 hover:bg-green-50 rounded-md transition-colors" title="Edit">
                  <Edit className="w-4 h-4 text-green-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
                <button className="p-2 hover:bg-purple-50 rounded-md transition-colors" title="Verify">
                  <Shield className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StartupShell>
  );
}

