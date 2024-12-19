import { Card, Group, Text } from "@mantine/core";
import React from "react";
import { FaRupeeSign } from "react-icons/fa";

export default function JobBudget({ job }) {
  return (
    <Card>
      <Group gap={6} align="center">
        <Text fw={600} size="md">
          Budget :
        </Text>
        <Group gap={2} align="center">
          <FaRupeeSign />
          <Text fw={600} size="md">
            {job.budget}
          </Text>
        </Group>
      </Group>
    </Card>
  );
}
