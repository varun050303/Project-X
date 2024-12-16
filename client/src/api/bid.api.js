import { api } from "./axios.config";

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
