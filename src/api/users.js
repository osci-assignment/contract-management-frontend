import client from "./client";

export const getUsers = (status, page = 0, size = 10) =>
  client.get("/api/v1/users", { params: { status, page, size } });

export const approveUser = (userId) =>
  client.post(`/api/v1/users/${userId}/approve`);

export const rejectUser = (userId) =>
  client.post(`/api/v1/users/${userId}/reject`);
