"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type Role = "startup" | "investor" | "expert" | "employee";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("startup");

  const roles = [
    {
      id: "startup" as Role,
      title: "Startup",
      subtitle: "Tìm đầu tư",
    },
    {
      id: "investor" as Role,
      title: "Nhà đầu tư",
      subtitle: "Tìm startup",
    },
    {
      id: "expert" as Role,
      title: "Chuyên gia",
      subtitle: "Tư vấn",
    },
    {
      id: "employee" as Role,
      title: "Nhân viên",
      subtitle: "Quản lý",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-6 py-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>

      {/* Register Card */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6 py-12">
        <Card className="w-full max-w-lg shadow-lg">
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

            {/* Title and Subtitle */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Tạo tài khoản mới
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Bắt đầu hành trình của bạn ngay hôm nay
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">
                  Họ và tên
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-gray-700">Bạn là...</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedRole === role.id
                          ? "bg-blue-50 border-blue-600"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">
                        {role.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {role.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Tạo tài khoản
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




