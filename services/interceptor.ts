import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// ── Refresh-token lock ──────────────────────────────────────────────────────
// Đảm bảo chỉ có 1 request refresh chạy tại một thời điểm.
// Các request 401 đến trong khi đang refresh sẽ được xếp hàng chờ.
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(err: unknown, newToken: string | null) {
  pendingQueue.forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(newToken!)
  );
  pendingQueue = [];
}

function clearSessionAndRedirect() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  // Chỉ redirect nếu chưa ở trang login
  if (!window.location.pathname.startsWith("/auth/login")) {
    window.location.href = "/auth/login";
  }
}
// ───────────────────────────────────────────────────────────────────────────

// Request interceptor: gắn Bearer token
instance.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  },
);

// Helper: gọi refresh-token bằng base axios (không qua interceptor)
const callRefreshToken = async (): Promise<string> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`,
    {},
    { withCredentials: true },
  );
  const body = response.data as any;
  const token =
    body?.data?.accessToken ??
    body?.accessToken ??
    body?.data?.info?.accessToken;
  if (!token) throw new Error("No access token in refresh response");
  return token as string;
};

// Response interceptor
instance.interceptors.response.use(
  function (response) {
    if (response.data) {
      if (typeof response.data.success === "undefined" && typeof response.data.isSuccess === "boolean") {
        response.data.success = response.data.isSuccess;
      }
      return response.data;
    }
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest: any = error.config;

    const isAuthRoute =
      originalRequest?.url?.includes("/api/auth/refresh-token") ||
      originalRequest?.url?.includes("/api/auth/logout");

    // ── Xử lý 401 ──────────────────────────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRoute) {
      originalRequest._retry = true;

      // Nếu đang có refresh chạy → xếp hàng chờ
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          })
          .catch(() => Promise.reject(error));
      }

      // Bắt đầu refresh
      isRefreshing = true;
      try {
        const newToken = await callRefreshToken();

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newToken);
        }

        processQueue(null, newToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại → xóa session, reject toàn bộ queue, redirect login
        processQueue(refreshError, null);
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    // ───────────────────────────────────────────────────────────────────────

    // Trả về dạng IBackendRes nếu backend trả về theo cấu trúc đó
    const backendRes = (error.response?.data ?? null) as any;
    if (backendRes && (typeof backendRes.success === "boolean" || typeof backendRes.isSuccess === "boolean")) {
      if (typeof backendRes.success === "undefined" && typeof backendRes.isSuccess === "boolean") {
        backendRes.success = backendRes.isSuccess;
      }
      return backendRes;
    }

    return Promise.reject(error);
  },
);

export default instance;