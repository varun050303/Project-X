import { Box, Grid, Stack, Text } from "@mantine/core";
import React from "react";
import CategoryIcon from "../../../components/common/CategoryIcon";
import { MdOutlineGavel, MdOutlineVerified } from "react-icons/md";

const boxStyles = { borderRadius: "6px" };

const StatusBox = ({ children }) => (
  <Grid.Col span={4}>
    <Box px="xs" py="sm" my="md" bg="dark.6" style={boxStyles}>
      <Stack align="center" justify="center" gap="xs">
        {children}
      </Stack>
    </Box>
  </Grid.Col>
);
const JobCategory = ({ category }) => {
  const jobCategory = category.charAt(0) + category.slice(1).toLowerCase();
  return (
    <StatusBox>
      <CategoryIcon category={jobCategory} />
      <Text fw={700}>{jobCategory}</Text>
    </StatusBox>
  );
};

const BidStatus = ({ status }) => {
  const bidStatus = status === "OPEN" ? "Bid Open" : "Bid Closed";

  return (
    <StatusBox>
      <MdOutlineGavel color="brown" size={40} />
      <Text fw={700}>{bidStatus}</Text>
    </StatusBox>
  );
};

const ClientVerificationStatus = ({ client }) => {
  const verificationText = client.number ? "Verified" : "Not Verified";
  const iconColor = client.number ? "green" : "gray";
  return (
    <StatusBox>
      <MdOutlineVerified color={iconColor} size={40} />
      <Text fw={700}>{verificationText}</Text>
    </StatusBox>
  );
};
export default function JobStatusPanel({ job }) {
  return (
    <Grid>
      <JobCategory category={job.category} />
      <BidStatus status={job.status} />
      <ClientVerificationStatus client={job.client} />
    </Grid>
  );
}
