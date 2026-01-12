"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "nhan@gmail.com";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      // Focus the last filled input or the last input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      // Handle OTP verification here
      console.log("OTP Code:", otpCode);
      // Navigate to reset password page
      router.push("/auth/reset-password");
    }
  };

  const handleResend = () => {
    // Handle resend OTP logic here
    console.log("Resending OTP to:", email);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      <Card className="w-full max-w-lg shadow-lg bg-white">
        <CardHeader className="space-y-6">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">StartupHub</h1>
              <p className="text-sm text-gray-600">Powered by AI</p>
            </div>
          </div>

          {/* Email Icon */}
          <div className="flex justify-center pt-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-2 pt-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Kiểm tra email
            </h2>
            <p className="text-base text-gray-700">
              Chúng tôi đã gửi mã xác nhận 6 số đến
            </p>
            <p className="text-base font-bold text-gray-900">
              {email}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Input Fields */}
            <div className="space-y-2">
              <Label className="text-gray-900">Mã xác nhận</Label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus-visible:ring-purple-500 focus-visible:border-purple-500"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              size="lg"
              disabled={otp.join("").length !== 6}
            >
              Xác nhận
            </Button>
          </form>

          {/* Resend Link */}
          <div className="text-center text-sm text-gray-600">
            Không nhận được mã?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Gửi lại
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Dots */}
      <div className="flex gap-2 mt-8">
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
      </div>
    </div>
  );
}

