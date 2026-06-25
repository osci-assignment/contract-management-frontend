import client from "./client";

export const getProjects = (page = 0, size = 10) =>
  client.get("/api/v1/projects", { params: { page, size } });

export const getProject = (projectId) =>
  client.get(`/api/v1/projects/${projectId}`);

export const updateProject = (projectId, data) =>
  client.put(`/api/v1/projects/${projectId}`, data);

export const getProjectWorkers = (projectId) =>
  client.get(`/api/v1/projects/${projectId}/workers`);

export const assignWorkerToProject = (projectId, workerId) =>
  client.post(`/api/v1/projects/${projectId}/workers/${workerId}`);

export const unassignWorkerFromProject = (projectId, workerId) =>
  client.delete(`/api/v1/projects/${projectId}/workers/${workerId}`);
