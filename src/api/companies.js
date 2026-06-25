import client from "./client";

export const getCompanies = (page = 0, size = 10) =>
  client.get("/api/v1/companies", { params: { page, size } });

/** 업체 상세 (등록된 프로젝트 목록 포함) */
export const getCompany = (companyId) =>
  client.get(`/api/v1/companies/${companyId}`);

export const updateCompany = (companyId, data) =>
  client.put(`/api/v1/companies/${companyId}`, data);

export const deleteCompany = (companyId) =>
  client.delete(`/api/v1/companies/${companyId}`);
