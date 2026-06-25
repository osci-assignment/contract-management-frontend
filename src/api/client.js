import axios from "axios";
import { useAuthStore } from "../store/authStore";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

// 모든 요청에 accessToken을 자동으로 붙인다.
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 백엔드 CommonResponse 형태({success, code, message, data})를 풀어서 data만 반환.
// success=false면 에러로 던져서 호출부에서 catch로 처리.
client.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body.success === "boolean") {
      if (!body.success) {
        return Promise.reject(new ApiError(body.message, body.code, body.errors));
      }
      return body.data;
    }
    return body;
  },
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료(401)면 refreshToken으로 재발급을 한 번 시도한다.
    // _retry 플래그로 무한 루프(재발급 후에도 또 401나는 경우) 방지.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshTokenValue = useAuthStore.getState().refreshToken;
      if (refreshTokenValue) {
        try {
          // client(이 인터셉터)를 거치지 않고 별도 axios 인스턴스로 호출해야
          // 무한 재귀(refresh 요청 자체가 또 401→재발급 시도)를 피할 수 있다.
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || ""}/api/v1/users/refresh`,
            { refreshToken: refreshTokenValue }
          );
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

          useAuthStore.getState().login({
            accessToken,
            refreshToken: newRefreshToken,
            email: useAuthStore.getState().email,
          });

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }

      useAuthStore.getState().logout();
    }

    const body = error.response?.data;
    if (body) {
      return Promise.reject(new ApiError(body.message, body.code, body.errors));
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  constructor(message, code, fieldErrors) {
    super(message || "요청 처리 중 오류가 발생했습니다.");
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export default client;