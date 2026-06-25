import client from "./client";

export const createMyWorkerProfile = (data) =>
  client.post("/api/v1/workers/me", data);

export const updateMyWorkerProfile = (data) =>
  client.put("/api/v1/workers/me", data);

export const getMyProjects = () => client.get("/api/v1/workers/me/projects");

export const getWorkers = (page = 0, size = 10, keyword = "") =>
  client.get("/api/v1/workers", { params: { page, size, keyword: keyword || undefined } });

export const getWorker = (workerId) => client.get(`/api/v1/workers/${workerId}`);

export const getWorkerProjects = (workerId) =>
  client.get(`/api/v1/workers/${workerId}/projects`);

export const updateWorkerByAdmin = (workerId, data) =>
  client.put(`/api/v1/workers/${workerId}`, data);

export const deleteWorker = (workerId) =>
  client.delete(`/api/v1/workers/${workerId}`);
