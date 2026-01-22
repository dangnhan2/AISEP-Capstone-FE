"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { AdvisorShell } from "@/components/advisor/advisor-shell";

type Review = {
  id: string;
  companyName: string;
  rating: number;
  date: string;
  comment: string;
  response?: string;
};

const initialReviews: Review[] = [
  {
    id: "1",
    companyName: "Tech ABC",
    rating: 5,
    date: "15/12/2024",
    comment: "Tư vấn rất chi tiết và hữu ích. Giúp chúng tôi có định hướng rõ ràng hơn.",
  },
  {
    id: "2",
    companyName: "FinNext",
    rating: 5,
    date: "10/12/2024",
    comment: "Chuyên gia có kinh nghiệm sâu. Những góp ý rất thực tế và dễ áp dụng.",
  },
  {
    id: "3",
    companyName: "AI Solutions",
    rating: 4,
    date: "05/12/2024",
    comment: "Tư vấn tốt, nhưng có thể chi tiết hơn về một số phần.",
  },
];

const ratingDistribution = [
  { stars: 5, count: 68, percentage: 80 },
  { stars: 4, count: 15, percentage: 18 },
  { stars: 3, count: 2, percentage: 2 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 0, percentage: 0 },
];

export default function AdvisorFeedbackPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});
  const [isResponding, setIsResponding] = useState<Record<string, boolean>>({});

  const handleResponseChange = (reviewId: string, text: string) => {
    setResponseTexts((prev) => ({ ...prev, [reviewId]: text }));
  };

  const handleStartResponding = (reviewId: string) => {
    setIsResponding((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleCancelResponse = (reviewId: string) => {
    setIsResponding((prev) => ({ ...prev, [reviewId]: false }));
    setResponseTexts((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const handleSubmitResponse = (reviewId: string) => {
    const responseText = responseTexts[reviewId]?.trim();
    if (!responseText) return;

    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, response: responseText } : review
      )
    );
    setIsResponding((prev) => ({ ...prev, [reviewId]: false }));
    setResponseTexts((prev) => ({ ...prev, [reviewId]: "" }));
  };

  return (
    <AdvisorShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Đánh giá</h1>
          <p className="text-slate-600 mt-1">Feedback từ startup</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                <div className="text-6xl font-bold text-slate-900 mb-2">4.8</div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-6 h-6 fill-yellow-400/50 text-yellow-400/50" />
                </div>
                <p className="text-sm text-slate-600">85 đánh giá</p>
              </div>

              <div className="flex-1 space-y-3">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-8">
                      {item.stars}★
                    </span>
                    <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-8 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {review.companyName}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed">{review.comment}</p>

                  {review.response && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 mb-1">
                            Phản hồi của bạn
                          </p>
                          <p className="text-slate-700 leading-relaxed">{review.response}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!review.response && !isResponding[review.id] && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartResponding(review.id)}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Phản hồi
                      </Button>
                    </div>
                  )}

                  {isResponding[review.id] && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-900 block mb-2">
                          Viết phản hồi
                        </label>
                        <textarea
                          value={responseTexts[review.id] || ""}
                          onChange={(e) => handleResponseChange(review.id, e.target.value)}
                          placeholder="Nhập phản hồi của bạn..."
                          className="w-full min-h-[100px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitResponse(review.id)}
                          disabled={!responseTexts[review.id]?.trim()}
                        >
                          Gửi phản hồi
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelResponse(review.id)}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdvisorShell>
  );
}

