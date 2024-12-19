import { Button, Drawer, Group, NumberInput, Textarea } from "@mantine/core";
import React from "react";

export default function PlaceBidDrawer({ opened, form, close, handleSubmit }) {
  return (
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
  );
}
