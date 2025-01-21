import { Avatar, Button, Card, Group, Text } from "@mantine/core";
import React from "react";
import { FaCheck, FaRupeeSign } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { useBidAction } from "../hooks/useBid";

export default function BiddingCard({ bid, jobId }) {
  const textColor = bid?.status === "REJECTED" ? "grey" : "";
  const workerId = bid?.workerId;
  const {
    mutate: updateBidStatus,
    isLoading: isUpdatingBid,
    error: updatingBidError,
  } = useBidAction(jobId);

  const handleBidAction = (action) => {
    updateBidStatus({ jobId, workerId, action });
  };

  return (
    <Card key={bid?.id} p={0} mb={"lg"}>
      <Card withBorder>
        <Group justify="space-between">
          <Group gap={"sm"}>
            <Avatar key={bid?.id} size={"sm"} name={bid?.worker?.user?.name} />
            <Text c={textColor}>{bid?.worker?.user?.name}</Text>
          </Group>
          <Text fw={700} c={textColor}>
            Bid : <FaRupeeSign className="text-sm" />
            {bid?.amount}
          </Text>
        </Group>
        <Text c={textColor} mt={"md"}>
          {bid?.message}
        </Text>
      </Card>
      {!(bid.status === "REJECTED" || "ACCEPTED") && (
        <Group justify="space-around">
          <Button
            leftSection={<FaCheck color="green" />}
            variant="transparent"
            onClick={() => handleBidAction("ACCEPTED")}
          >
            <Text fw={700}>Accept</Text>
          </Button>
          <Button
            leftSection={<ImCancelCircle color="red" />}
            variant="transparent"
            onClick={() => handleBidAction("REJECTED")}
          >
            <Text fw={700}>Reject</Text>
          </Button>
        </Group>
      )}
    </Card>
  );
}
