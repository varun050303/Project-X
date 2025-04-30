import React from "react";
import { FaRupeeSign } from "react-icons/fa";
import { Avatar, Card, Group, Text, Title } from "@mantine/core";
export default function AcceptedBidCard({ bid }) {
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
            <Avatar key={bid?.id} size={"sm"} name={bid?.worker?.user?.name} />
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
