import React from "react";
import { useParams } from "react-router-dom";
import { ScrollArea, Text } from "@mantine/core";
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
              console.log(bid);
              return <BiddingCard key={bid.id} bid={bid} jobId={id} />;
            })}
          </ScrollArea>
        </BiddingSection>
      )}
      {console.log(user.role)}
      {console.log(job.status)}
      {console.log(hasBid)}
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
            close={close}
            handleSubmit={handleSubmitBid}
          />
        </>
      )}
    </>
  );
}
