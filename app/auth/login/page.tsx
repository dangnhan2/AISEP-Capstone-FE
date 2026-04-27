"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Rocket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Globe,
  HelpCircle,
  Menu,
  X,
  AlertCircle,
} from "lucide-react";
import { Login } from "@/services/auth/auth.api";
import { GetMe } from "@/services/user/user.api";
import { GetAdvisorProfile } from "@/services/advisor/advisor.api";
import { GetStartupProfile } from "@/services/startup/startup.api";
import { useAuth } from "@/context/context";

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setAccessToken, setIsAuthen } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError(null);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Định dạng email không hợp lệ");
    } else {
      setEmailError(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const redirectByUserType = async (userType: string | undefined, roles?: string[]) => {
    let type = (userType ?? "").toLowerCase();

    // Fallback to roles if userType is empty
    if (!type && roles && roles.length > 0) {
      // Find the first role that matches one of our known dashboards
      const knownRoles = ["startup", "investor", "advisor", "staff", "admin"];
      const lowerRoles = roles.map(r => r.toLowerCase());

      for (const known of knownRoles) {
        if (lowerRoles.includes(known)) {
          type = known;
          break;
        }
      }
    }

    switch (type) {
      case "startup":
        try {
          const startupProfileRes =
            (await GetStartupProfile()) as unknown as IBackendRes<IStartupProfile>;
          const startupProfileData = startupProfileRes?.data;

          if ((startupProfileRes?.success || startupProfileRes?.isSuccess) && startupProfileData) {
            router.push("/startup");
          } else {
            router.push("/startup/onboard");
          }
        } catch {
          router.push("/startup");
        }
        break;
      case "investor":
        router.push("/investor");
        break;
      case "advisor":
        router.push("/advisor");
        break;
      case "staff":
        router.push("/staff");
        break;
      case "admin":
        router.push("/admin/dashboard");
        break;
      default:
        // By default, if userType/roles are missing or unknown, route to landing.
        router.push("/");
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Định dạng email không hợp lệ");
      return;
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setIsLoading(true);

    try {
      const res = await Login(email, password);
      // Check for success safely (either boolean success, text message, or token presence)
      const payload = res?.data ? res.data : (res as any);
      const token = payload?.accessToken || (res as any)?.accessToken;

      const isSuccess =
        res?.success === true ||
        (res as any)?.isSuccess === true ||
        (res?.message && res.message.toLowerCase().includes("success")) ||
        !!token;

      if (isSuccess && token) {
        let infoObj = payload?.info || payload || {};

        // Fallback: Decode token if backend doesn't send user object
        const decoded = parseJwt(token);
        if (decoded) {
          infoObj = { ...infoObj, ...decoded };

          // Extract .NET roles claim
          const netCoreRoleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
          if (decoded[netCoreRoleClaim]) {
            infoObj.roles = Array.isArray(decoded[netCoreRoleClaim])
              ? decoded[netCoreRoleClaim]
              : [decoded[netCoreRoleClaim]];
          } else if (decoded.role) {
            infoObj.roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
          } else if (decoded.roles) {
            infoObj.roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
          }

          if (!infoObj.userType && decoded.userType) {
            infoObj.userType = decoded.userType;
          }
        }

        const userId = infoObj?.userId || infoObj?.id || 0;
        const targetUserEmail = infoObj?.email || email;
        const targetUserType = infoObj?.userType;
        const targetRoles = infoObj?.roles || [];

        setUser({ userId: userId, email: targetUserEmail, userType: targetUserType, roles: targetRoles } as any);
        setAccessToken(token);
        setIsAuthen(true);

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }

        // --- Advisor Flow Mapping ---
        if (targetUserType?.toLowerCase() === "advisor") {
          try {
            // 1. Verify user status
            const userMeRes = await GetMe();
            const userData = userMeRes?.data;
            
            if (!userMeRes.success || !userData || !userData.isActive) {
              setUser(undefined);
              setAccessToken(undefined);
              setIsAuthen(false);
              if (typeof window !== "undefined") localStorage.removeItem("accessToken");
              setError("Tài khoản của bạn chưa được kích hoạt hoặc bị khóa.");
              setIsLoading(false);
              return;
            }

            // 2. Check Advisor profile
            try {
              const advisorProfileRes = await GetAdvisorProfile();
              if (advisorProfileRes.success && advisorProfileRes.data) {
                router.push("/advisor");
              } else {
                router.push("/advisor/onboard");
              }
            } catch (profileErr: any) {
              if (profileErr?.response?.status === 404) {
                router.push("/advisor/onboard");
              } else {
                router.push("/advisor"); // Fallback to dashboard on other errors
              }
            }
          } catch (meErr: any) {
            setError("Không thể xác thực thông tin người dùng.");
            setIsLoading(false);
          }
        } else {
          await redirectByUserType(targetUserType, targetRoles);
        }
      } else {
        setError(res?.message || "Đăng nhập không thành công");
      }
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        "Có lỗi xảy ra. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex flex-col overflow-x-hidden" style={{ fontFamily: "var(--font-be-vietnam-pro), sans-serif" }}>
      <div className="h-[73px]" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInLeft {
          from {
            transform: translateX(-100vw);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100vw);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-left {
          animation: slideInLeft 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-right {
          animation: slideInRight 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* ===== MAIN ===== */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Side: Welcome Info */}
          <div className="lg:col-span-5 space-y-8 hidden lg:block animate-slide-left opacity-0">
            <div>
              <h2 className="text-4xl font-black leading-tight mb-4 text-slate-900">
                Chào mừng bạn trở lại!
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Tiếp tục hành trình kết nối và phát triển trong hệ sinh thái AI.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f0f042]/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-slate-800" />
                </div>
                <p className="text-sm font-medium text-slate-700">Theo dõi tiến độ startup của bạn</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f0f042]/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-slate-800" />
                </div>
                <p className="text-sm font-medium text-slate-700">Trao đổi trực tiếp với cố vấn</p>
              </div>
            </div>

            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-xl">
              <img
                alt="Startup collaboration"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsyCrgtVGIMawqfHL7kw004DQmq-95E59-ycCuTdv4TGohN59RDfDJ73i6ZF0_wotHD2fHKwDIM1IM55N0ySYi2zAet3JnLeDkxWoYNR3fXFHCMdV-jw8gU_1CnuvJYQfu80yoCTkHwQqMw6-z6QOXyw52t1zPn0ayl9JU74mO8n-LfMDnIPd8awGztB---pGNP78tJWeI3esUQDj0F5yJbluyZU81RHhFxtQ1YEMQuekKSobZuMsdJnz-PAZi9x3UBDTJWWh1I9Q"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-medium italic mb-2">
                  &ldquo;Nhờ AISEP, chúng tôi không chỉ tìm thấy nhà đầu tư mà còn có được những đối tác chiến lược quan trọng.&rdquo;
                </p>
                <p className="text-[#f0f042] text-xs font-bold uppercase tracking-wider">
                  — Giám đốc điều hành, TechAI Global
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="lg:col-span-7 animate-slide-right opacity-0">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100">
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2 text-slate-900">Đăng nhập Hệ thống</h3>
                <p className="text-slate-500 text-sm">Vui lòng nhập thông tin để truy cập vào tài khoản của bạn.</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email</label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${emailError ? "text-red-500" : "text-slate-400"}`} />
                      <input
                        type="email"
                        placeholder="nguyenvana@email.com"
                        value={email}
                        onChange={handleEmailChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${emailError
                          ? "border-2 border-red-400 bg-white focus:ring-red-300"
                          : "border-none bg-slate-50 focus:ring-[#f0f042]"
                          }`}
                      />
                    </div>
                    {emailError && (
                      <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border-none rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#f0f042]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#f0f042] focus:ring-[#f0f042] bg-slate-50"
                    />
                    <label htmlFor="remember" className="text-xs text-slate-500 font-medium cursor-pointer">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-xs font-bold text-slate-900 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>

                {error && (
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                )}

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#f0f042] hover:bg-[#e6e632] text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-[#f0f042]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}</span>
                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>

                {/* Social Login buttons removed by user request */}

                {/* Register Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-slate-500">
                    Bạn chưa có tài khoản?{" "}
                    <Link href="/auth/register" className="text-slate-900 font-bold ml-1 hover:underline">
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="w-full py-8 border-t border-slate-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">© 2026 AISEP Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-[#f0f042] transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-[#f0f042] transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
