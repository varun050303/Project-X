import React, { useEffect, useState } from "react";
import { api } from "../api/axios.config";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Drawer,
  Grid,
  Group,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure, useFetch } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchJobById } from "../api/jobs.api";
import CategoryIcon from "../components/common/CategoryIcon";
import { MdOutlineGavel } from "react-icons/md";
import { MdOutlineVerified } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";
import { useAuth } from "../contexts/auth.context";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useForm } from "@mantine/form";
import { createBid, checkBidStatus, fetchAllBids } from "../api/bid.api";
import { FaCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { notifications } from "@mantine/notifications";
export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient(); // Add this line
  const {
    data: job,
    isLoading: isJobLoading,
    error: jobError,
  } = useQuery({
    queryKey: ["jobs", id],
    queryFn: () => fetchJobById(id),
    select: (data) => data.job,
  });

  const {
    data: hasBid,
    isLoading: isBidLoading,
    error: bidError,
  } = useQuery({
    queryKey: ["bid", id],
    queryFn: () => checkBidStatus(id),
    enabled: user.role === "WORKER",
    select: (data) => data.hasBid,
  });

  const {
    data: bids,
    isLoading: isBidsLoading,
    error: bidsError,
  } = useQuery({
    queryKey: ["bids", id],
    queryFn: () => fetchAllBids(id),
    enabled: user.role === "CLIENT",
    select: (data) => data.bids,
  });

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      message: "",
      amount: 0,
    },
    validate: {
      amount: (value) =>
        value <= 0 ? "Amount should be greater than 0" : null,
    },
  });

  const { mutate: submitBid, isLoading: isSubmitting } = useMutation({
    mutationFn: createBid,
    onSuccess: () => {
      queryClient.invalidateQueries(["bids", id]);
      queryClient.invalidateQueries(["jobs", id]);
      close();
      notifications.show({
        title: "Bid placed successfully",
        color: "green",
        position: "top-right",
        autoClose: 3000,
      });
      form.reset();
    },

    onError: (jobError) => {
      console.error("Failed to post your bid", jobError);
    },
  });

  const handleSubmit = (values) => {
    const bidData = {
      jobId: id,
      message: values.message,
      amount: values.amount,
    };

    submitBid(bidData);
  };

  if (isJobLoading || isBidLoading || isBidsLoading) {
    return <Text>Loading job details...</Text>;
  }

  if (jobError || bidError || bidsError) {
    return (
      <Text c="red">Failed to load job or bids. Please try again later.</Text>
    );
  }

  return (
    <>
      <Card mb={"md"}>
        <Stack gap={"sm"} mb={"sm"}>
          <Group justify="space-between">
            <Title order={4}>{job.title}</Title>
            <Group gap={8}>
              {/* <Text size="md">status :</Text> */}
              <Badge autoContrast color="blue" size="md">
                {job.status}
              </Badge>
            </Group>
          </Group>
          <Group gap={4}>
            <HiLocationMarker color="red" size={25} opacity={0.8} />
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

      <Grid>
        <Grid.Col span={4}>
          <Box
            px={"xs"}
            py={"sm"}
            my={"md"}
            bg="dark.6"
            style={{ borderRadius: "6px" }}
          >
            <Stack align="center" justify="center" gap={"xs"}>
              <CategoryIcon category={job.category} />
              <Text fw={700}>{job.category}</Text>
            </Stack>
          </Box>
        </Grid.Col>
        <Grid.Col span={4}>
          <Box
            px={"xs"}
            py={"sm"}
            my={"md"}
            bg="dark.6"
            style={{ borderRadius: "6px" }}
          >
            <Stack align="center" justify="center" gap={"xs"}>
              <MdOutlineGavel color="brown" size={40} />
              <Text fw={700}>
                {job.status === "OPEN" ? "Bid Open" : "Bid Closed"}
              </Text>
            </Stack>
          </Box>
        </Grid.Col>
        <Grid.Col span={4}>
          {" "}
          <Box
            px={"xs"}
            py={"sm"}
            my={"md"}
            bg="dark.6"
            style={{ borderRadius: "6px" }}
          >
            <Stack align="center" justify="center" gap={"xs"}>
              <MdOutlineVerified
                color={job.client.number ? "green" : "gray"}
                size={40}
              />
              <Text fw={700}>
                {job.client.number ? "verified" : "Not Verified"}
              </Text>
            </Stack>
          </Box>
        </Grid.Col>
      </Grid>

      <Card mb={"md"}>
        <Stack>
          <Title order={5}>Posted By</Title>
          <Group justify="space-between">
            <Group gap={10}>
              <Avatar
                name={job?.client?.profilePic || job?.client?.name || "Unknown"}
                alt="Client's Avatar"
              />
              <Text fw={600}>{job?.client?.name || "Unknown"}</Text>
            </Group>
            <Box>
              <IoChatboxEllipsesOutline size={25} />
            </Box>
          </Group>
        </Stack>
      </Card>

      {user.role === "CLIENT" && (
        <>
          <Card>
            <Title order={5} mb={"md"}>
              Bidders
            </Title>
            {!bids && <Text my={"md"}>No Bidders yet</Text>}
            <ScrollArea h={"auto"} mah={400}>
              {bids.map((bid) => {
                return (
                  <Card key={bid.id} p={0} mb={"xl"}>
                    <Card withBorder>
                      <Group justify="space-between">
                        <Group gap={"sm"}>
                          <Avatar
                            key={bid?.id}
                            size={"sm"}
                            name={bid?.Worker?.user?.name}
                          />
                          <Text>{bid?.Worker?.user?.name}</Text>
                        </Group>
                        <Text fw={700}>
                          Bid : <FaRupeeSign className="text-sm" />
                          {bid?.amount}
                        </Text>
                      </Group>
                      <Text mt={"md"}>{bid?.message}</Text>
                    </Card>
                    <Group justify="space-around" mt={"sm"}>
                      <Box>
                        <Group gap={"xs"}>
                          <FaCheck color="green" />
                          <Text>Accept</Text>
                        </Group>
                      </Box>
                      <Box>
                        <Group gap={"xs"}>
                          <ImCancelCircle color="red" />
                          <Text>Reject</Text>
                        </Group>
                      </Box>
                    </Group>
                  </Card>
                );
              })}
            </ScrollArea>
          </Card>
        </>
      )}

      {user.role === "WORKER" && (
        <>
          {console.log(hasBid)}
          <Box pos={"fixed"} bottom={20} left={0} right={0} p={20}>
            <Button
              size="md"
              variant="default"
              bg={hasBid ? "" : "primary"}
              w={"100%"}
              onClick={open}
              disabled={hasBid}
              aria-label={hasBid ? "Bid already placed" : "Place a bid"}
            >
              {hasBid ? "Bid Placed" : "Place Bid"}
            </Button>
          </Box>

          <Drawer
            radius="md"
            opened={opened}
            position="bottom"
            onClose={close}
            title="Place Bid"
            size={"xs"}
          >
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
              <Textarea
                placeholder="ex: I will do this job in 2 days"
                label="Message"
                w={"100%"}
                {...form.getInputProps("message")}
              />
              <NumberInput
                w={"50%"}
                leftSection="₹"
                label="Amount"
                required
                placeholder="Amount in INR(₹)"
                my={20}
                {...form.getInputProps("amount")}
              />

              <Group pos={"fixed"} bottom={10} right={0} p={20}>
                <Button variant="default" onClick={close}>
                  Cancel
                </Button>
                <Button variant="default" bg={"primary"} type="submit">
                  Confirm
                </Button>
              </Group>
            </form>
          </Drawer>
        </>
      )}
    </>
  );
}
