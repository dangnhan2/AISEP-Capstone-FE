"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CounterCounterOfferPage() {
  const params = useParams();
  const offerId = params.id as string;
  const [amount, setAmount] = useState("275000");
  const [equity, setEquity] = useState("5");
  const [preMoney, setPreMoney] = useState("5200000");
  const [perShare, setPerShare] = useState("55.00");

  // Calculate difference
  const originalAmount = 250000;
  const counterAmount = 300000;
  const yourAmount = parseInt(amount);
  const difference = yourAmount - counterAmount;
  const percentDiff = ((difference / counterAmount) * 100).toFixed(1);

  return (
    <InvestorShell>
      <div className="space-y-6 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/investor/offers" className="hover:text-blue-600">
            💰 Offers
          </Link>
          <span>/</span>
          <Link href={`/investor/offers/${offerId}`} className="hover:text-blue-600">
            Offer to TechVision AI
          </Link>
          <span>/</span>
          <span>Send Counter-Counter-Offer</span>
        </div>

        {/* Back Button */}
        <Link href={`/investor/offers/${offerId}`}>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Offer Details
          </Button>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Send Counter-Counter-Offer</h1>
          <p className="text-slate-600">
            Propose alternative terms in response to TechVision AI's counter-offer of $300,000
          </p>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-blue-800">Responding to Their Counter-Offer</div>
            <div className="text-sm text-blue-700 mt-1">
              TechVision AI proposed $300,000 for 5% equity. You can propose your own terms below. Your counter-counter-offer will restart the negotiation with 7 days for their response.
            </div>
          </div>
        </div>

        {/* Offer Comparison */}
        <Card className="border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Offer Comparison</h2>
              <p className="text-sm text-slate-600">See how your counter-counter-offer compares to previous proposals</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Your Original Offer */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500 uppercase font-medium mb-3">Your Original Offer</div>
                <div className="text-4xl font-bold mb-1">$250,000</div>
                <div className="text-lg text-slate-600 mb-4">5% equity</div>
                <div className="space-y-1 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>$5.0M pre-money</span>
                  </div>
                  <div className="flex justify-between">
                    <span>$2.50 per share</span>
                  </div>
                </div>
              </div>

              {/* Their Counter-Offer */}
              <div className="bg-cyan-50 p-6 rounded-lg border-2 border-cyan-400">
                <div className="text-xs text-cyan-700 uppercase font-medium mb-3">Their Counter-Offer</div>
                <div className="text-4xl font-bold text-cyan-600 mb-1">$300,000</div>
                <div className="text-lg text-cyan-700 mb-4">5% equity</div>
                <div className="space-y-1 text-sm text-cyan-700">
                  <div className="flex justify-between">
                    <span>$6.0M pre-money</span>
                  </div>
                  <div className="flex justify-between">
                    <span>$3.00 per share</span>
                  </div>
                </div>
              </div>

              {/* Your Counter-Counter */}
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-400">
                <div className="text-xs text-blue-700 uppercase font-medium mb-3">Your Counter-Counter</div>
                <div className="text-4xl font-bold text-blue-600 mb-1">${parseInt(amount).toLocaleString()}</div>
                <div className="text-lg text-blue-700 mb-4">{equity}% equity</div>
                <div className="space-y-1 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>${parseInt(preMoney).toLocaleString()} pre-money</span>
                  </div>
                  <div className="flex justify-between">
                    <span>${perShare}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Difference Analysis */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <div className="text-sm text-slate-600 mb-2">Your Offer vs Their Counter</div>
              <div className={`text-3xl font-bold ${difference < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${Math.abs(difference).toLocaleString()} ({percentDiff}%)
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {difference < 0 ? 'A middle-ground proposal' : 'Above their counter-offer'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Counter-Offer Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Your Counter-Counter-Offer Terms</h2>

                <div className="space-y-6">
                  {/* Investment Amount */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Investment Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <Input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                        className="pl-7 text-lg font-semibold"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">The amount you're willing to invest</p>
                  </div>

                  {/* Equity Percentage */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Equity Percentage</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={equity}
                        onChange={(e) => setEquity(e.target.value)}
                        className="pr-7 text-lg font-semibold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Equity stake you're requesting</p>
                  </div>

                  {/* Valuation Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Pre-Money Valuation</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <Input
                          type="text"
                          value={preMoney}
                          onChange={(e) => setPreMoney(e.target.value.replace(/[^0-9]/g, ""))}
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Price Per Share</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <Input
                          type="text"
                          value={perShare}
                          onChange={(e) => setPerShare(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Offer Valid Until */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Offer Valid Until</Label>
                    <Input type="date" defaultValue="2024-01-31" />
                    <p className="text-xs text-slate-500 mt-1">Standard negotiation period is 7 days</p>
                  </div>

                  {/* Additional Terms */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Justification / Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
                    </Label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm min-h-[120px]"
                      placeholder="Explain your reasoning for this counter-offer..."
                      defaultValue="We appreciate your updated proposal and the traction you've demonstrated. Based on comparable deals in the AI/ML space and current market conditions, we believe $275K represents a fair middle ground that values both your growth and our investment partnership. We're excited to move forward together."
                    />
                  </div>

                  {/* Investment Terms Summary */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-sm mb-3">Investment Terms Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Investment Type</div>
                        <div className="font-semibold">SAFE Note</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Valuation Cap</div>
                        <div className="font-semibold">${parseInt(preMoney).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Discount Rate</div>
                        <div className="font-semibold">20%</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Pro-rata Rights</div>
                        <div className="font-semibold">Included</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary & Actions */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Offer Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Your Investment</span>
                    <span className="font-bold">${parseInt(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Equity Stake</span>
                    <span className="font-bold">{equity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pre-Money Val.</span>
                    <span className="font-bold">${parseInt(preMoney).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Post-Money Val.</span>
                    <span className="font-bold">${(parseInt(preMoney) + parseInt(amount)).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Valid Until</span>
                      <span className="font-bold">Jan 31, 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2 text-green-800">💡 Negotiation Tip</h3>
                <p className="text-sm text-green-700">
                  Your offer is 8.3% below their counter-offer, showing willingness to meet in the middle. This demonstrates good faith while maintaining your valuation discipline.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full bg-green-600 text-white hover:bg-green-700 py-6 text-base">
                📤 Send Counter-Counter-Offer
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
              <Link href={`/investor/offers/${offerId}`}>
                <Button variant="ghost" className="w-full text-slate-600">
                  Cancel
                </Button>
              </Link>
            </div>

            <div className="text-xs text-slate-500 text-center">
              By sending this offer, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Investment Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </InvestorShell>
  );
}
