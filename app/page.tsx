import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Star, Shield, Users, TrendingUp, Lock, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">StartupHub</h1>
              <p className="text-sm text-gray-600">Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" asChild>
              <Link href="/auth/login" className="no-underline">Đăng nhập</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/auth/register" className="no-underline">Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </header>

        <Separator />

        {/* Main Hero Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-blue-600 font-medium">AI-Powered Ecosystem</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Nơi startup{" "}
                <span className="text-blue-600">gặp gỡ cơ hội</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Nền tảng kết nối startup với nhà đầu tư và chuyên gia. Sử dụng AI để đánh giá tiềm năng, blockchain để bảo vệ tài sản trí tuệ.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/auth/register" className="no-underline">
                    Bắt đầu ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Xem demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">1,200+</div>
                  <div className="text-sm text-gray-600">Startups</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">300+</div>
                  <div className="text-sm text-gray-600">Investors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">850+</div>
                  <div className="text-sm text-gray-600">Experts</div>
                </div>
              </div>
            </div>

            {/* Right Graphic Card */}
            <div className="relative">
              <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-0 shadow-xl">
                <CardContent className="p-8">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">85</span>
                    </div>
                  </div>
                  
                  {/* Feature Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white border-0 shadow-md">
                      <CardContent className="p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                          <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Blockchain</span>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-md">
                      <CardContent className="p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                          <Star className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">AI Analysis</span>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-300 rounded-full opacity-50 blur-xl"></div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 rounded-lg opacity-50 blur-xl"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Why Choose StartupHub Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tại sao chọn StartupHub?
            </h2>
            <p className="text-lg text-gray-600">
              Công nghệ hiện đại kết hợp với quy trình chuyên nghiệp
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: AI Assessment */}
            <Card className="bg-white border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Đánh giá AI Thông minh</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  AI phân tích đa chiều để đưa ra đánh giá chính xác về tiềm năng startup của bạn
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2: Blockchain Protection */}
            <Card className="bg-white border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Bảo vệ Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Công nghệ blockchain đảm bảo tính xác thực và bảo vệ tài sản trí tuệ tuyệt đối
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3: Expert Network */}
            <Card className="bg-white border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Mạng lưới Chuyên gia</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Kết nối với chuyên gia và nhà đầu tư hàng đầu trong lĩnh vực của bạn
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 4: Trend Analysis */}
            <Card className="bg-white border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Phân tích Xu hướng</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Cập nhật xu hướng thị trường và insights từ AI để đưa ra quyết định đúng đắn
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 5: High Security */}
            <Card className="bg-white border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Bảo mật Cao</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Hệ thống xác thực đa lớp và mã hóa dữ liệu tiêu chuẩn ngân hàng
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 6: Smart Suggestions */}
            <Card className="bg-white border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Gợi ý Thông minh</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Machine learning đề xuất các cơ hội đầu tư và kết nối phù hợp nhất
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* For All Audiences Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Dành cho mọi đối tượng
            </h2>
            <p className="text-lg text-gray-600">
              Giải pháp toàn diện cho cả startup, nhà đầu tư và chuyên gia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {/* Startup Card */}
            <Card className="bg-blue-600 border-0 text-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Startup</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100 mb-6">
                  Nhận đánh giá AI, bảo vệ IP, kết nối nhà đầu tư và chuyên gia
                </CardDescription>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>AI Scoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Blockchain IP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Networking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Investor Card */}
            <Card className="bg-purple-600 border-0 text-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Nhà đầu tư</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-purple-100 mb-6">
                  Tìm kiếm startup tiềm năng với phân tích AI và insights thị trường
                </CardDescription>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Smart Search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>AI Insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Deal Flow</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Expert Card */}
            <Card className="bg-green-600 border-0 text-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Chuyên gia</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-100 mb-6">
                  Tư vấn startup, chia sẻ kinh nghiệm và xây dựng danh tiếng
                </CardDescription>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Consulting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Schedule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Reputation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Operations Card */}
            <Card className="bg-red-600 border-0 text-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Vận hành</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-red-100 mb-6">
                  Quản lý nền tảng, kiểm duyệt và đảm bảo chất lượng
                </CardDescription>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Moderation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Events</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Sẵn sàng khởi đầu hành trình?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tham gia cùng hơn 1,200 startup đang phát triển trên nền tảng
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
            <Link href="/auth/register" className="no-underline">
              Đăng ký miễn phí
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Separator className="bg-gray-800" />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">StartupHub</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nền tảng kết nối startup với cơ hội đầu tư
              </p>
            </div>

            {/* Products Column */}
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Tính năng</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Giá cả</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Bảo mật</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-gray-800 mb-8" />
          
          <div className="text-center text-sm text-gray-400">
            © 2024 StartupHub. Made with ❤️ in Vietnam
          </div>
        </div>
      </footer>
    </div>
  );
}
