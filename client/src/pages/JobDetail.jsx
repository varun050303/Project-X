import React from "react";
import { useParams } from "react-router-dom";
import { ScrollArea, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchJobById } from "../features/jobs/api/jobs.api";
import { useAuth } from "../contexts/auth.context";
import { useForm } from "@mantine/form";
import {
  createBid,
  checkBidStatus,
  fetchAllBids,
} from "../features/bids/api/bid.api";
import { notifications } from "@mantine/notifications";
import JobBudget from "../features/jobs/components/JobBudget";
import JobStatusPanel from "../features/jobs/components/JobStatusPanel";
import JobInfo from "../features/jobs/components/JobInfo";
import JobPulisherCard from "../features/jobs/components/JobPulisherCard";
import BiddingCard from "../features/bids/components/BiddingCard";
import BiddingSection from "../features/bids/components/BiddingSection";
import PlaceBidButton from "../features/bids/components/PlaceBidButton";
import PlaceBidDrawer from "../features/bids/components/PlaceBidDrawer";
export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: job,
    isLoading: isJobLoading,
    error: jobError,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
    select: (data) => data.job,
  });

  const {
    data: hasBid,
    isLoading: isBidLoading,
    error: bidError,
  } = useQuery({
    queryKey: ["bid", id],
    queryFn: () => checkBidStatus(id),
    enabled: user.role === "WORKER",
    select: (data) => data.hasBid,
  });

  const {
    data: bids,
    isLoading: isBidsLoading,
    error: bidsError,
  } = useQuery({
    queryKey: ["bids", id],
    queryFn: () => fetchAllBids(id),
    enabled: user.role === "CLIENT",
    select: (data) => data.bids,
  });

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      message: "",
      amount: 0,
    },
    validate: {
      amount: (value) =>
        value <= 0 ? "Amount should be greater than 0" : null,
    },
  });

  const { mutate: submitBid, isLoading: isSubmitting } = useMutation({
    mutationFn: createBid,
    onSuccess: () => {
      queryClient.invalidateQueries(["bids", id]);
      close();
      notifications.show({
        title: "Bid placed successfully",
        color: "green",
        position: "top-right",
        autoClose: 3000,
      });
      form.reset();
    },

    onError: (jobError) => {
      console.error("Failed to post your bid", jobError);
    },
  });

  const handleSubmitBid = (values) => {
    const bidData = {
      jobId: id,
      message: values.message,
      amount: values.amount,
    };

    submitBid(bidData);
  };

  if (isJobLoading || isBidLoading || isBidsLoading) {
    return <Text>Loading job details...</Text>;
  }

  if (jobError || bidError || bidsError) {
    return (
      <Text c="red">Failed to load job or bids. Please try again later.</Text>
    );
  }

  return (
    <>
      <JobInfo job={job} />

      <JobBudget job={job} />

      <JobStatusPanel job={job} />

      <JobPulisherCard client={job?.client} />

      {user.role === "CLIENT" && (
        <BiddingSection>
          {!bids && <Text my={"md"}>No Bidders yet</Text>}
          <ScrollArea h={"auto"} mah={500}>
            {bids.map((bid) => {
              return <BiddingCard key={bid.id} bid={bid} />;
            })}
          </ScrollArea>
        </BiddingSection>
      )}

      {user.role === "WORKER" && (
        <>
          <PlaceBidButton hasBid={!!hasBid} open={open} />
          <PlaceBidDrawer
            opened={opened}
            form={form}
            close={close}
            handleSubmit={handleSubmitBid}
          />
        </>
      )}
    </>
  );
}
