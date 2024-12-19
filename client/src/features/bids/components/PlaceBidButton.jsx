import { Box, Button } from "@mantine/core";
import React from "react";

export default function PlaceBidButton({ hasBid, open }) {
  return (
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
  );
}
