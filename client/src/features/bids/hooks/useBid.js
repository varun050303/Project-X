import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkBidStatus, fetchAllBids, createBid } from "../api/bid.api";
import { notifications } from "@mantine/notifications";

const useBidStatus = (jobId, userRole) => {
  return useQuery({
    queryKey: ["bid", jobId],
    queryFn: () => checkBidStatus(jobId),
    enabled: userRole === "WORKER",
    select: (data) => data.hasBid,
  });
};

const useBidsFetch = (jobId, userRole) => {
  return useQuery({
    queryKey: ["bids", jobId],
    queryFn: () => fetchAllBids(jobId),
    enabled: userRole === "CLIENT",
    select: (data) => data.bids,
  });
};

const useSubmitBid = (jobId, closeDrawer) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBid,
    onSuccess: () => {
      queryClient.invalidateQueries(["bids", jobId]);
      closeDrawer();
      notifications.show({
        title: "Bid placed successfully",
        message: "Your bid has been placed successfully.",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Failed to place bid",
        message: error.message,
        color: "red",
      });
    },
  });
};

export { useBidStatus, useBidsFetch, useSubmitBid };
