import React from "react";

import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
export default function RoleSelectionCard({
  img,
  role,
  badge,
  buttonText,
  description,
  onClick,
}) {
  return (
    <div>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        maw={300}
        withBorder
        onClick={onClick}
      >
        <Card.Section>
          <Image src={img} height={160} alt="Norway" fit="contain" />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={700} size="xl">
            {role}
          </Text>
          <Badge color="pink">{badge}</Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {description}
        </Text>

        <Button color="blue" fullWidth mt="md" radius="md">
          {buttonText}
        </Button>
      </Card>
    </div>
  );
}
