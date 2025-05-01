import React from "react";
import { useParams } from "react-router-dom";
import { Avatar, Card, Group, ScrollArea, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "../contexts/auth.context";
import { useForm } from "@mantine/form";
import JobBudget from "../features/jobs/components/JobBudget";
import JobStatusPanel from "../features/jobs/components/JobStatusPanel";
import JobInfo from "../features/jobs/components/JobInfo";
import JobPulisherCard from "../features/jobs/components/JobPulisherCard";
import BiddingCard from "../features/bids/components/BiddingCard";
import BiddingSection from "../features/bids/components/BiddingSection";
import PlaceBidButton from "../features/bids/components/PlaceBidButton";
import PlaceBidDrawer from "../features/bids/components/PlaceBidDrawer";
import {
  useBidsFetch,
  useBidStatus,
  useSubmitBid,
} from "../features/bids/hooks/useBid";
import { useGetJob } from "../features/jobs/hooks/useJob";
import { FaRupeeSign } from "react-icons/fa";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [opened, { open, close: closeDrawer }] = useDisclosure(false);

  const { data: job, isLoading: isJobLoading, error: jobError } = useGetJob(id);

  const {
    data: hasBid,
    isLoading: isCheckingBid,
    error: bidCheckError,
  } = useBidStatus(id, user.role);

  const {
    data: bids,
    isLoading: isLoadingBids,
    error: bidsError,
  } = useBidsFetch(id, user.role);

  const {
    mutate: submitBid,
    isLoading: isSubmittingBid,
    error: submitBidError,
  } = useSubmitBid(id, closeDrawer);

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

  const handleSubmitBid = (values) => {
    const bidData = {
      jobId: id,
      message: values.message,
      amount: values.amount,
    };

    submitBid(bidData);
  };

  if (isJobLoading || isCheckingBid || isLoadingBids) {
    return <Text>Loading job details...</Text>;
  }

  if (jobError || bidCheckError || bidsError) {
    return (
      <Text c="red">Failed to load job or bids. Please try again later.</Text>
    );
  }

  const acceptedBid = bids.find((bid) => bid.status === "ACCEPTED");
  const nonAcceptedBids = bids.filter((bid) => bid.status !== "ACCEPTED");

  function AcceptedBidCard({ bid }) {
    if (!bid) {
      return null;
    }

    return (
      <Card shadow="sm" padding="lg" style={{ marginBottom: "1rem" }}>
        <Title weight={500} order={5} c={"orange"} fw={700}>
          Accepted Bid
        </Title>
        <Card p={0} pt={20}>
          <Group justify="space-between">
            <Group gap={"sm"}>
              <Avatar
                key={bid?.id}
                size={"sm"}
                name={bid?.worker?.user?.name}
              />
              <Text c={"white"}>{bid?.worker?.user?.name}</Text>
            </Group>
            <Text fw={700} c={"white"}>
              Bid : <FaRupeeSign className="text-sm" />
              {bid?.amount}
            </Text>
          </Group>
          <Text c={"white"} mt={"md"}>
            {bid?.message}
          </Text>
        </Card>
      </Card>
    );
  }

  const getScrollAreaHeight = () => {
    if (!bids || bids.length === 0) {
      return "auto";
    }
    if (acceptedBid && nonAcceptedBids.length === 0) {
      return "auto";
    }
    return 500;
  };

  return (
    <>
      <JobInfo job={job} />
      <JobBudget job={job} />
      <JobStatusPanel job={job} />
      <JobPulisherCard client={job?.client} />
      {user.role === "CLIENT" && acceptedBid && (
        <AcceptedBidCard bid={acceptedBid} />
      )}
      {user.role === "CLIENT" && (
        <BiddingSection>
          {!bids || bids.length === 0 ? (
            <Text my={"md"}>No Bidders yet</Text>
          ) : (
            <ScrollArea h={getScrollAreaHeight()} type="auto">
              {nonAcceptedBids.map((bid) => (
                <BiddingCard key={bid.id} bid={bid} jobId={id} />
              ))}
            </ScrollArea>
          )}
        </BiddingSection>
      )}
      {user.role === "WORKER" && job.status === "OPEN" && (
        <>
          <PlaceBidButton
            hasBid={!!hasBid}
            open={open}
            loading={isSubmittingBid}
          />
          <PlaceBidDrawer
            opened={opened}
            form={form}
            close={closeDrawer}
            handleSubmit={handleSubmitBid}
          />
        </>
      )}
    </>
  );
}
