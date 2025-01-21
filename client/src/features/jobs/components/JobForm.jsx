import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Chip,
  Fieldset,
  Group,
  NativeSelect,
  NumberInput,
  SegmentedControl,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import QuestionMarkTooltipIcon from "../../../components/common/QuestionMarkTooltip";
import { usePostJob } from "../hooks/useJob";

const SKILLS = {
  Plumbing: "PLUMBING",
  Electrical: "ELECTRICAL",
  Carpentry: "CARPENTRY",
  Painting: "PAINTING",
  Cleaning: "CLEANING",
  Mechanical: "MECHANICAL",
  Plastering: "PLASTERING",
  Masonry: "MASONRY",
  HVAC: "HVAC",
  other: "OTHER",
};

const PRIORITIES = {
  URGENT: "urgent",
  NORMAL: "normal",
};

export default function JobForm({ onClose }) {
  const { mutate: postJob } = usePostJob();
  const skillOptions = Object.keys(SKILLS);
  const [opened, setIsOpened] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      category: skillOptions.length > 0 ? skillOptions[0] : "",
      priority: "NORMAL",
      budget: 100,
      street: "",
      city: "",
      pincode: "",
      landmark: "",
      bookingDate: new Date(),
    },
    validate: {
      title: (value) => (value.trim() === "" ? "Job title is required" : null),
      description: (value) =>
        value.trim() === "" ? "Description is required" : null,
      bookingDate: (value) =>
        new Date(value) < new Date()
          ? "Booking date cannot be in the past"
          : null,
    },
  });

  function handleToolTip() {
    setIsOpened(!opened);
  }

  const handleSubmit = (values) => {
    const data = {
      ...values,
      category: SKILLS[values.category],
    };
    onClose();
    postJob(data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Fieldset legend="Job Details">
          <Group>
            <TextInput
              placeholder="Kitchen Tab Leak"
              label="Title"
              required
              w={"100%"}
              {...form.getInputProps("title")}
            />
            <Textarea
              label="Description"
              placeholder="I need a plumber to fix my kitchen tab leak"
              required
              w={"100%"}
              {...form.getInputProps("description")}
            />
            <DateInput
              label="Booking Date"
              {...form.getInputProps("bookingDate")}
            />
            <Group justify="space-between">
              <NativeSelect
                label="Category"
                w={"40%"}
                data={skillOptions}
                required
                {...form.getInputProps("category")}
              />
              <NumberInput
                w={"50%"}
                leftSection="₹"
                label="Budget"
                placeholder="Amount in INR(₹)"
                {...form.getInputProps("budget")}
              />
            </Group>
          </Group>
        </Fieldset>

        <Fieldset
          legend="Address"
          styles={{
            root: {
              marginBottom: "1rem",
              marginTop: "1.5rem",
            },
          }}
        >
          <Group>
            <TextInput
              w={"40%"}
              label="H.No/ Street"
              required
              placeholder="123, xyz street"
              {...form.getInputProps("street")}
            />
            <TextInput
              required
              label="City"
              placeholder="Muzaffarnagar"
              {...form.getInputProps("city")}
            />
            <NumberInput
              required
              hideControls
              w={"40%"}
              label="Pincode"
              placeholder="224001"
              {...form.getInputProps("pincode")}
            />
            <TextInput
              required
              label="Landmark"
              placeholder="near the bus stand"
              {...form.getInputProps("landmark")}
            />
          </Group>
        </Fieldset>

        <Group justify="flex-start" align="center" ml={10}>
          <SegmentedControl
            {...form.getInputProps("priority")}
            data={[
              { value: "URGENT", label: "Urgent" },
              { value: "NORMAL", label: "Normal" },
            ]}
          />
          <QuestionMarkTooltipIcon
            handleToolTip={handleToolTip}
            opened={opened}
            multiline={true}
            width={200}
            label="Mark your job post as per your urgency of work it can also affect your budget"
          />
        </Group>

        <Box className="text-end" mr={10}>
          <Button type="submit">Submit Job</Button>
        </Box>
      </form>
    </div>
  );
}
