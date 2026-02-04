"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Tag, DollarSign, CheckCircle2, MessageSquare, AlertCircle, Phone, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Sample data - in real app this would come from API based on ID
const offerData: Record<string, any> = {
  "1": {
    id: 1,
    startup: "TechVision AI",
    logo: "🤖",
    category: "AI/ML, SaaS",
    location: "San Francisco, CA",
    status: "counter-offer",
    statusLabel: "COUNTER-OFFER",
    responseNeeded: true,
    sentDate: "Jan 10, 2024",
    daysAgo: 5,
    valuation: "$5.0M",
    valuationType: "Pre-money",
    roundSize: "$2.5M",
    roundType: "Target raise",
    expiration: "2 days",
    expirationDate: "Jan 24, 2024",
    offerId: "#OFF.2024.018",
    originalOffer: {
      amount: "$250,000",
      equity: "5%",
    },
    counterOffer: {
      amount: "$300,000",
      equity: "5%",
      note: "same",
    },
    negotiationHistory: [
      {
        type: "counter",
        date: "Jan 13, 2024",
        time: "11:45 AM",
        title: "TechVision AI proposed: $300,000 for 5% equity",
        description: "Based on our updated projections and recent market traction with 3 enterprise clients signed in Q4, we believe a $300K investment better reflects our current position and growth trajectory. We're excited to partner with Catalyst Ventures and believe this valuation is fair for both parties.",
      },
    ],
    alertMessage: "TechVision AI has sent a counter-offer of $300,000 for 5% equity. You have 2 days to respond before this offer expires.",
  },
  "4": {
    id: 4,
    startup: "DataStream Analytics",
    logo: "📊",
    category: "Data/AI, Analytics",
    location: "Seattle, WA",
    status: "declined",
    statusLabel: "DECLINED",
    sentDate: "Dec 28, 2023",
    daysAgo: 18,
    declinedDate: "Jan 4, 2024",
    declinedDaysAgo: 7,
    valuation: "$6.67M",
    valuationType: "Post-money",
    roundSize: "$3.0M",
    roundType: "Series A",
    offerId: "#OFF.2023.146",
    originalOffer: {
      amount: "$400,000",
      equity: "6%",
    },
    declineReason: {
      primary: "Valuation mismatch",
      feedback: "Thank you for your interest in DataStream Analytics. After careful consideration, we've decided to decline your offer at this time. While we appreciate the proposed investment amount, we believe our current traction and market position justify a higher valuation. We're open to future discussions as our metrics continue to improve.",
    },
    declineMessage: "DataStream Analytics declined your investment offer on Jan 4, 2024. They provided feedback about their decision and remain open to future discussions.",
  },
};

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;
  const offer = offerData[offerId];

  if (!offer) {
    return (
      <InvestorShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Offer not found</h2>
          <Link href="/investor/offers">
            <Button className="mt-4">Back to Offers</Button>
          </Link>
        </div>
      </InvestorShell>
    );
  }

  const isDeclined = offer.status === "declined";
  const isCounter = offer.status === "counter-offer";

  return (
    <InvestorShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/investor/offers" className="hover:text-blue-600">
            💰 Offers
          </Link>
          <span>/</span>
          <span>Offer to {offer.startup}</span>
        </div>

        {/* Back Button */}
        <Link href="/investor/offers">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Offers
          </Button>
        </Link>

        {/* Main Offer Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl">
                  {offer.logo}
                </div>

                {/* Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-3">Offer to {offer.startup}</h1>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      Seed Round
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      {offer.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Tag className="w-4 h-4" />
                      {offer.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      isDeclined ? "bg-red-500" : "bg-cyan-500"
                    } text-white px-4 py-1.5 text-[11px] font-bold uppercase rounded-full`}>
                      {offer.statusLabel}
                    </Badge>
                    {offer.responseNeeded && (
                      <Badge className="bg-orange-500 text-white px-4 py-1.5 text-[11px] font-bold uppercase rounded-full">
                        ● Response Needed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">Offer {offer.offerId}</div>
                <div className="text-4xl font-bold text-slate-900 mb-1">
                  {offer.originalOffer.amount}
                </div>
                <div className="text-lg text-slate-600">for {offer.originalOffer.equity} equity</div>

                {isCounter && offer.counterOffer && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="text-xs text-slate-500 uppercase font-medium mb-1">
                      Counter-Offer Received
                    </div>
                    <div className="text-3xl font-bold text-cyan-600 mb-1">
                      {offer.counterOffer.amount}
                    </div>
                    <div className="text-sm text-slate-600">
                      for {offer.counterOffer.equity} equity {offer.counterOffer.note && `(${offer.counterOffer.note})`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Offer Details Grid */}
            <div className="grid grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-2">
                  {isDeclined ? "Declined" : "Sent Date"}
                </div>
                <div className="text-lg font-bold">{isDeclined ? offer.declinedDate : offer.sentDate}</div>
                <div className="text-sm text-slate-600">
                  {isDeclined ? `${offer.declinedDaysAgo} days response` : `${offer.daysAgo} days ago`}
                </div>
              </div>

              {!isDeclined && (
                <>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-medium mb-2">Valuation</div>
                    <div className="text-lg font-bold">{offer.valuation}</div>
                    <div className="text-sm text-slate-600">{offer.valuationType}</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 uppercase font-medium mb-2">Round Size</div>
                    <div className="text-lg font-bold">{offer.roundSize}</div>
                    <div className="text-sm text-slate-600">{offer.roundType}</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 uppercase font-medium mb-2">Expires In</div>
                    <div className="text-lg font-bold text-red-600">{offer.expiration}</div>
                    <div className="text-sm text-slate-600">{offer.expirationDate}</div>
                  </div>
                </>
              )}

              {isDeclined && (
                <>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-medium mb-2">Valuation</div>
                    <div className="text-lg font-bold">{offer.valuation}</div>
                    <div className="text-sm text-slate-600">{offer.valuationType}</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 uppercase font-medium mb-2">Status</div>
                    <div className="text-lg font-bold text-red-600">Closed</div>
                    <div className="text-sm text-slate-600">Deal ended</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alert Message */}
        {offer.alertMessage && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-orange-800">Counter-Offer Received - Response Required</div>
              <div className="text-sm text-orange-700 mt-1">{offer.alertMessage}</div>
            </div>
          </div>
        )}

        {/* Declined Message */}
        {isDeclined && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-white text-3xl">✕</div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Offer Declined by Startup</h2>
              <p className="text-slate-600 mb-6">{offer.declineMessage}</p>
              <div className="flex items-center justify-center gap-3">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Send New Offer
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Startup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Negotiation History / Decline Reason */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">
                  {isDeclined ? "Decline Reason & Feedback" : "Negotiation History"}
                </h2>

                {isDeclined && offer.declineReason ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-medium mb-2">Primary Reason</div>
                      <Badge className="bg-red-100 text-red-700 px-4 py-2 text-sm">
                        {offer.declineReason.primary}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-medium mb-2">Feedback from Startup</div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-700 leading-relaxed">{offer.declineReason.feedback}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {offer.negotiationHistory?.map((item: any, index: number) => (
                      <div key={index} className="relative pl-8 pb-6 border-l-2 border-blue-200 last:border-0 last:pb-0">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-50 text-blue-700 px-3 py-1">Counter-Offer Received</Badge>
                          <span className="text-xs text-slate-500">{item.date} at {item.time}</span>
                        </div>
                        <div className="font-semibold text-blue-600 mb-2">{item.title}</div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-slate-700 leading-relaxed italic">"{item.description}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {isDeclined ? "What's Next?" : "Respond to Counter-Offer"}
                </h2>

                {isDeclined ? (
                  <div className="space-y-3">
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Send New Offer
                    </Button>
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Startup
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Similar Startups
                    </Button>
                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="font-semibold text-sm mb-3">More Actions</h3>
                      <div className="space-y-2">
                        <Button variant="link" className="w-full justify-start text-blue-600 p-0">
                          Add to Watchlist
                        </Button>
                        <Button variant="link" className="w-full justify-start text-blue-600 p-0">
                          Download Offer Details
                        </Button>
                        <Button variant="link" className="w-full justify-start text-red-600 p-0">
                          Archive Offer
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept Counter-Offer ($300K)
                    </Button>
                    <Link href={`/investor/offers/${offerId}/counter`} className="block">
                      <Button className="w-full bg-cyan-500 text-white hover:bg-cyan-600">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Send Counter-Counter-Offer
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                      <Phone className="w-4 h-4 mr-2" />
                      Request Discussion Call
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <div className="pt-4 border-t border-slate-200">
                      <Button variant="link" className="w-full justify-start text-red-600 p-0">
                        Decline Counter-Offer
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </InvestorShell>
  );
}
