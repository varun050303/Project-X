import { Avatar, Box, Card, Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

export default function JobPulisherCard({ client }) {
  return (
    <Card mb={"md"}>
      <Stack>
        <Title order={5}>Posted By</Title>
        <Group justify="space-between">
          <Group gap={10}>
            <Avatar
              name={client?.profilePic || client?.name || "Unknown"}
              alt="Client's Avatar"
            />
            <Text fw={600}>{client?.name || "Unknown"}</Text>
          </Group>
          <Box>
            <IoChatboxEllipsesOutline size={25} />
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}
