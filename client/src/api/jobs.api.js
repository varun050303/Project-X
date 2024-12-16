import { api } from "./axios.config";

export const fetchJobs = async () => {
  const { data } = await api.get("/api/jobs/get");
  return data;
};

export const createJob = async (jobInfo) => {
  const { data } = await api.post("/api/jobs/create", jobInfo);
  return data;
};

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/api/jobs/delete/${id}`);
  return data;
};

export const fetchJobById = async (id) => {
  const { data } = await api.get(`/api/jobs/get/${id}`);
  return data;
};
