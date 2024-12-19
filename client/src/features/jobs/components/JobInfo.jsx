import { Badge, Box, Card, Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { HiLocationMarker } from "react-icons/hi";

export default function JobInfo({ job }) {
  return (
    <Card mb={"md"}>
      <Stack gap={"sm"} mb={"sm"}>
        <Group justify="space-between">
          <Title order={4}>{job.title}</Title>
          <Group gap={8}>
            <Badge autoContrast color="blue" size="md">
              {job.status}
            </Badge>
          </Group>
        </Group>
        <Group gap={4}>
          <HiLocationMarker color="red" size={20} opacity={0.8} />
          <Text size="sm" fw={600}>
            {job.street + ", " + job.city}
          </Text>
        </Group>
      </Stack>
      <Box my={"md"}>
        <Stack gap={4}>
          <Text size="sm">Description</Text>
          <Text size="md">{job.description}</Text>
        </Stack>
      </Box>
    </Card>
  );
}
