import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseJwt } from "../api/jwt";

/**
 * 로그인 상태(토큰, 역할, userId)를 전역으로 관리한다.
 * 백엔드 응답엔 role/userId가 따로 안 내려오므로, accessToken(JWT)을 디코딩해서 뽑아낸다.
 * persist 미들웨어로 localStorage에 저장해 새로고침해도 로그인 유지.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      role: null, // "ADMIN" | "WORKER"
      userId: null,
      email: null,

      login: ({ accessToken, refreshToken, email }) => {
        const claims = parseJwt(accessToken) || {};
        const role = (claims.role || "").replace("ROLE_", "");
        set({
          accessToken,
          refreshToken,
          role,
          userId: claims.userId ?? null,
          email: email ?? null,
        });
      },

      logout: () =>
        set({ accessToken: null, refreshToken: null, role: null, userId: null, email: null }),

      isAuthenticated: () => Boolean(get().accessToken),
      isAdmin: () => get().role === "ADMIN",
    }),
    {
      name: "auth-storage",
    }
  )
);
