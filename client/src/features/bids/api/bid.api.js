import { api } from "../../../api/axios.config";

export const createBid = async (values) => {
  const { data } = await api.post(`/api/bids/create`, values);
  return data;
};

export const checkBidStatus = async (id) => {
  const { data } = await api.get(`/api/bids/${id}/bid-status`);
  return data;
};

export const fetchAllBids = async (id) => {
  const { data } = await api.get(`/api/bids/${id}/get/all`);
  return data;
};

export const updateBidSatus = async ({ jobId, workerId, action }) => {
  const { data } = await api.patch(
    `/api/bids/action?workerId=${workerId}&jobId=${jobId}&action=${action}`
  );
  return data;
};
