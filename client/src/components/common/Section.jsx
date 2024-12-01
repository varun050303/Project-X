import { Box, Title } from "@mantine/core";
import React from "react";

export default function Section({ title, children }) {
  return (
    <Box my={"xl"}>
      <Title fw={700} order={3} mb={"sm"}>
        {title}
      </Title>
      <Box>{children}</Box>
    </Box>
  );
}
