import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { IoIosArrowForward } from "react-icons/io";
import { FiTrash } from "react-icons/fi";
import { api } from "../../../api/axios.config";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth.context";
export default function JobCard({
  title,
  description,
  status,
  category,
  budget,
  priority,
  id,
}) {
  const [opened, { open, close }] = useDisclosure(false);
  async function handleJobDelete() {
    close();
    try {
      await api.delete(`/api/jobs/delete/${id}`);
      notifications.show({
        title: "Job Deleted Successfully",
        color: "green",
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      notifications.show({
        title: "Something went wrong",
        message: "Try again",
        color: "red",
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  function confirmDelete() {
    open();
  }
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <Modal opened={opened} onClose={close} title="Confirm Delete" centered>
        Are you sure you want to perform this action? This action cannot be
        undone. If you are sure, press confirm button below.
        <Group mt="lg" justify="flex-end">
          <Button onClick={close} variant="default">
            Cancel
          </Button>
          <Button onClick={() => handleJobDelete()} color="red">
            Confirm Delete
          </Button>
        </Group>
      </Modal>

      <Card
        key={id}
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
          position: "relative",
        }}
      >
        {user.role === "CLIENT" && (
          <>
            <ActionIcon
              size={"sm"}
              color="gray"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={() => {
                confirmDelete();
              }}
            >
              <FiTrash color="black" size={13} />
            </ActionIcon>
          </>
        )}

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
          <Button
            size="xs"
            mt="md"
            radius="md"
            fs={"xl"}
            px={10}
            onClick={() => navigate("/job/" + id)}
          >
            See More
            <IoIosArrowForward />
          </Button>
        </Group>
      </Card>
    </>
  );
}
