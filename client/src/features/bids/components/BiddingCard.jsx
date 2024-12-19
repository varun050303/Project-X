import { Avatar, Box, Button, Card, Group, Text } from "@mantine/core";
import React from "react";
import { FaCheck, FaRupeeSign } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

export default function BiddingCard({ bid }) {
  return (
    <Card key={bid?.id} p={0} mb={"lg"}>
      <Card withBorder>
        <Group justify="space-between">
          <Group gap={"sm"}>
            <Avatar key={bid?.id} size={"sm"} name={bid?.Worker?.user?.name} />
            <Text>{bid?.Worker?.user?.name}</Text>
          </Group>
          <Text fw={700}>
            Bid : <FaRupeeSign className="text-sm" />
            {bid?.amount}
          </Text>
        </Group>
        <Text mt={"md"}>{bid?.message}</Text>
      </Card>
      <Group justify="space-around">
        <Button leftSection={<FaCheck color="green" />} variant="transparent">
          <Text fw={700}>Accept</Text>
        </Button>
        <Button
          leftSection={<ImCancelCircle color="red" />}
          variant="transparent"
        >
          <Text fw={700}>Reject</Text>
        </Button>
      </Group>
    </Card>
  );
}
