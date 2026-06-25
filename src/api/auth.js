import client from "./client";

export const login = (data) => client.post("/api/v1/users/login", data);

export const refreshToken = (refreshToken) =>
  client.post("/api/v1/users/refresh", { refreshToken });

export const registerUser = (data) => client.post("/api/v1/users", data);

export const registerAdmin = (data) => client.post("/api/v1/users/admin", data);