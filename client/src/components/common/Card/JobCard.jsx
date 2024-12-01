import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { IoIosArrowForward } from "react-icons/io";
export default function JobCard({ title, description, status, category }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" p={"xs"} withBorder>
      <Text fw={500}>{title}</Text>

      <Group mt="md" mb="sm" gap={6}>
        <Badge variant="light" color="teal">
          {category}
        </Badge>
        <Badge variant="dot" color={status === "PENDING" ? "red" : "green"}>
          {status}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {description}
      </Text>

      <Group mt="sm" mb="xs">
        {/* <Button size="xs" mt="md" radius="md">
          Budget : 2000rs
        </Button> */}
        <Button size="xs" mt="md" radius="md" fs={"xl"} px={10}>
          See More
          <IoIosArrowForward />
        </Button>
      </Group>
    </Card>
  );
}
