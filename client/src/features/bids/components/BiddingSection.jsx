import { Card, Title } from "@mantine/core";
import React from "react";

export default function BiddingSection({ children }) {
  return (
    <Card>
      <Title order={5} mb={"md"}>
        Bidders
      </Title>
      {children}
    </Card>
  );
}
