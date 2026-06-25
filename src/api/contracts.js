import client from "./client";

export const uploadContracts = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return client.post("/api/v1/contracts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadContractFile = (contractId) =>
  client.get(`/api/v1/contracts/${contractId}/download`, { responseType: "blob" });

export const getContracts = (page = 0, size = 10, status = "") =>
  client.get("/api/v1/contracts", { params: { page, size, status: status || undefined } });

export const getContract = (contractId) =>
  client.get(`/api/v1/contracts/${contractId}`);