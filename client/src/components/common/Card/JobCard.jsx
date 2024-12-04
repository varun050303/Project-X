import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { IoIosArrowForward } from "react-icons/io";

export default function JobCard({
  title,
  description,
  status,
  category,
  budget,
  priority,
}) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      p={"xs"}
      mih={210}
      withBorder
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div>
        <Text fw={500}>{title}</Text>

        <Group mt="md" mb="sm" gap={6}>
          <Badge variant="light" color="teal">
            {category}
          </Badge>
          <Badge variant="dot" color={status === "PENDING" ? "red" : "green"}>
            {status}
          </Badge>
          <Badge variant="light" color="blue">
            {"Budget : ₹" + budget}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed" mt={"lg"} style={{ flexGrow: 1 }}>
          {description}
        </Text>
      </div>

      <Group mt="auto" mb="xs" justify="center" align="end">
        {priority === "URGENT" && (
          <Text fw={600} size="sm" c="red" mb={3} mr={4}>
            {"#" + " " + priority}
          </Text>
        )}
        <Button size="xs" mt="md" radius="md" fs={"xl"} px={10}>
          See More
          <IoIosArrowForward />
        </Button>
      </Group>
    </Card>
  );
}
