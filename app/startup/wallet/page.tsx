"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { StartupShell } from "@/components/startup/startup-shell";
import { Cashout } from "@/services/payment/payment.api";
import {
  CreateWallet,
  ETransactionStatus,
  ETransactionType,
  GetWalletInfo,
  GetWalletTransactions,
  ITransactionInfo,
  IWalletInfo,
  UpdateWallet,
} from "@/services/wallet/wallet.api";
import { GetBankOptions, IBankOption } from "@/services/external/external.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  RefreshCcw,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const transactionTypeLabel: Record<number, string> = {
  [ETransactionType.Deposit]: "Nạp tiền",
  [ETransactionType.Withdrawal]: "Rút tiền",
  [ETransactionType.Refund]: "Hoàn tiền",
};

const transactionStatusLabel: Record<number, string> = {
  [ETransactionStatus.Pending]: "Đang chờ",
  [ETransactionStatus.Completed]: "Hoàn thành",
  [ETransactionStatus.Failed]: "Thất bại",
};

function formatCurrency(amount: number | null | undefined) {
  const safeValue = Number.isFinite(amount) ? Number(amount) : 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(safeValue);
}

function formatDate(dateInput: string | null | undefined) {
  if (!dateInput) return "--";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeTypeLabel(typeValue: ITransactionInfo["type"]) {
  const asNumber = typeof typeValue === "number" ? typeValue : Number(typeValue);
  if (!Number.isNaN(asNumber) && transactionTypeLabel[asNumber]) {
    return transactionTypeLabel[asNumber];
  }
  return String(typeValue ?? "Unknown");
}

function normalizeStatusLabel(statusValue: ITransactionInfo["status"]) {
  const asNumber = typeof statusValue === "number" ? statusValue : Number(statusValue);
  if (!Number.isNaN(asNumber) && transactionStatusLabel[asNumber]) {
    return transactionStatusLabel[asNumber];
  }
  return String(statusValue ?? "Unknown");
}

function statusBadgeClass(statusValue: ITransactionInfo["status"]) {
  const asNumber = typeof statusValue === "number" ? statusValue : Number(statusValue);
  if (asNumber === ETransactionStatus.Completed) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
  if (asNumber === ETransactionStatus.Pending) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }
  if (asNumber === ETransactionStatus.Failed) {
    return "bg-rose-100 text-rose-700 border-rose-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function StartupWalletPage() {
  const [walletInfo, setWalletInfo] = useState<IWalletInfo | null>(null);
  const [transactions, setTransactions] = useState<ITransactionInfo[]>([]);
  const [banks, setBanks] = useState<IBankOption[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [cashoutLoadingId, setCashoutLoadingId] = useState<number | null>(null);
  const [cashoutError, setCashoutError] = useState<string | null>(null);
  const [cashoutSuccess, setCashoutSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noWallet, setNoWallet] = useState(false);
  const [bankDraft, setBankDraft] = useState({ bin: "", accountNumber: "" });
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [bankInfoMessage, setBankInfoMessage] = useState<string | null>(null);
  const [bankInfoError, setBankInfoError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchTransactions = useCallback(
    async (walletId: number, nextPage: number, nextTypeFilter: string, nextStatusFilter: string) => {
      setIsLoadingTransactions(true);
      try {
        const typeValue = nextTypeFilter === "all" ? undefined : Number(nextTypeFilter);
        const statusValue = nextStatusFilter === "all" ? undefined : Number(nextStatusFilter);

        const res = await GetWalletTransactions(walletId, {
          page: nextPage,
          pageSize: PAGE_SIZE,
          transactionType: typeValue as ETransactionType,
          transactionStatus: statusValue as ETransactionStatus,
        });

        const envelope = res as unknown as IBackendRes<IPagingData<ITransactionInfo>>;
        setTransactions(envelope.data?.items ?? []);
        setTotalPages(envelope.data?.paging?.totalPages ?? 1);
      } catch (err) {
        console.error(err);
        setError("Không thể tải lịch sử giao dịch.");
      } finally {
        setIsLoadingTransactions(false);
      }
    },
    [],
  );

  const loadWallet = useCallback(async () => {
    setIsLoadingWallet(true);
    try {
      const envelope = (await GetWalletInfo()) as IBackendRes<IWalletInfo>;
      if (envelope.data?.walletId) {
        setWalletInfo(envelope.data);
        setNoWallet(false);
        return envelope.data;
      }
      setNoWallet(true);
      return null;
    } catch (err) {
        console.error(err);
        setNoWallet(true);
        return null;
    } finally {
      setIsLoadingWallet(false);
    }
  }, []);

  useEffect(() => {
    loadWallet().then((w) => {
        if (w?.walletId) {
            fetchTransactions(w.walletId, page, typeFilter, statusFilter);
        }
    });
  }, [loadWallet, fetchTransactions, page, typeFilter, statusFilter]);

  useEffect(() => {
    GetBankOptions().then(setBanks).finally(() => setIsLoadingBanks(false));
  }, []);

  const selectedBankForDraft = useMemo(
    () => banks.find((bank) => bank.bin === bankDraft.bin),
    [banks, bankDraft.bin],
  );

  const handleSaveBankInfo = async () => {
    const bin = bankDraft.bin;
    const accountNumber = bankDraft.accountNumber;
    const bankName = selectedBankForDraft?.shortName || "";

    if (!bin || !accountNumber) {
        setBankInfoError("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    setIsSavingBank(true);
    try {
      const res = noWallet
        ? await CreateWallet(accountNumber, bin, bankName)
        : await UpdateWallet(accountNumber, bin, bankName);
      
      if (res.success) {
        setBankInfoMessage("Lưu thông tin thành công.");
        const w = await loadWallet();
        if (w?.walletId) fetchTransactions(w.walletId, page, typeFilter, statusFilter);
      } else {
        setBankInfoError(res.message || "Lỗi khi lưu thông tin.");
      }
    } catch (err) {
      setBankInfoError("Lỗi hệ thống.");
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleCashout = async (tx: ITransactionInfo) => {
    setCashoutLoadingId(tx.transactionID);
    try {
      const res = await Cashout(tx.transactionID);
      if (res.success) {
        setCashoutSuccess("Đã gửi yêu cầu rút tiền.");
        loadWallet();
      } else {
        setCashoutError(res.message || "Lỗi khi rút tiền.");
      }
    } catch (err) {
      setCashoutError("Lỗi hệ thống.");
    } finally {
      setCashoutLoadingId(null);
    }
  };

  return (
    <StartupShell>
      <div className="max-w-[1100px] mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900">Ví của tôi</h1>
          <p className="text-sm text-slate-500">Quản lý số dư hoàn tiền từ các tranh chấp và thực hiện rút tiền về ngân hàng.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Số dư khả dụng</p>
                        <h2 className="text-3xl font-bold">{formatCurrency(walletInfo?.balance)}</h2>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <Wallet className="w-6 h-6 text-[#eec54e]" />
                    </div>
                </div>
                <div className="flex gap-6">
                    <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Tổng hoàn tiền</p>
                        <p className="text-sm font-bold text-emerald-400">{formatCurrency(walletInfo?.totalRefunded)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Tổng đã rút</p>
                        <p className="text-sm font-bold text-slate-200">{formatCurrency(walletInfo?.totalWithdrawn)}</p>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ngân hàng thụ hưởng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Ngân hàng</Label>
                        <select 
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none"
                            value={bankDraft.bin}
                            onChange={(e) => setBankDraft(prev => ({ ...prev, bin: e.target.value }))}
                        >
                            <option value="">Chọn ngân hàng</option>
                            {banks.map(b => <option key={b.bin} value={b.bin}>{b.shortName}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Số tài khoản</Label>
                        <input 
                            type="text"
                            placeholder="Nhập STK..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none"
                            value={bankDraft.accountNumber}
                            onChange={(e) => setBankDraft(prev => ({ ...prev, accountNumber: e.target.value }))}
                        />
                    </div>
                </div>
                <Button 
                    className="w-full bg-[#eec54e] text-slate-900 hover:bg-[#e6cc4c] rounded-xl font-bold"
                    onClick={handleSaveBankInfo}
                    disabled={isSavingBank}
                >
                    {isSavingBank ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {noWallet ? "Tạo ví & Lưu thông tin" : "Cập nhật thông tin ngân hàng"}
                </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-bold text-slate-800">Lịch sử giao dịch</CardTitle>
                    <div className="flex gap-2">
                        <select 
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">Loại giao dịch</option>
                            <option value={String(ETransactionType.Refund)}>Hoàn tiền</option>
                            <option value={String(ETransactionType.Withdrawal)}>Rút tiền</option>
                        </select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {isLoadingTransactions ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[#eec54e]" />
                        <p className="text-sm text-slate-400">Đang tải giao dịch...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-2">
                        <RefreshCcw className="w-8 h-8 text-slate-200" />
                        <p className="text-sm text-slate-400">Chưa có giao dịch nào.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/30">
                                <TableHead className="text-[11px] font-bold uppercase pl-6">ID</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase">Loại</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase">Trạng thái</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase">Thời gian</TableHead>
                                <TableHead className="text-right text-[11px] font-bold uppercase pr-6">Số tiền</TableHead>
                                <TableHead className="text-right pr-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(tx => (
                                <TableRow key={tx.transactionID}>
                                    <TableCell className="pl-6 font-mono text-xs">#{tx.transactionID}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {Number(tx.type) === ETransactionType.Refund ? (
                                                <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-500" />
                                            ) : (
                                                <ArrowUpFromLine className="w-3.5 h-3.5 text-slate-400" />
                                            )}
                                            <span className="text-[13px] font-medium">{normalizeTypeLabel(tx.type)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn("rounded-md border-none px-2 py-0.5 text-[11px] font-bold", statusBadgeClass(tx.status))}>
                                            {normalizeStatusLabel(tx.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[12px] text-slate-500">{formatDate(tx.createdAt)}</TableCell>
                                    <TableCell className={cn("text-right font-bold pr-6", Number(tx.type) === ETransactionType.Refund ? "text-emerald-600" : "text-slate-900")}>
                                        {Number(tx.type) === ETransactionType.Refund ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        {Number(tx.type) === ETransactionType.Refund && Number(tx.status) === ETransactionStatus.Completed && (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-8 text-[11px] font-bold rounded-lg border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                onClick={() => handleCashout(tx)}
                                                disabled={cashoutLoadingId === tx.transactionID}
                                            >
                                                Rút về ngân hàng
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
      </div>
    </StartupShell>
  );
}
