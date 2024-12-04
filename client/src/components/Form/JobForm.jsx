import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { api } from "../../api/axios.config";
import { GoQuestion } from "react-icons/go";
import {
  Box,
  Button,
  Chip,
  Group,
  NativeSelect,
  NumberInput,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import QuestionMarkTooltipIcon from "../common/QuestionMarkTooltip";

const SKILLS = {
  PLUMBING: "Plumbing",
  ELECTRICAL: "Electrical",
  CARPENTRY: "Carpentry",
  PAINTING: "Painting",
  CLEANING: "Cleaning",
  MECHANICAL: "Mechanical",
  PLASTERING: "Plastering",
  MASONRY: "Masonry",
  HVAC: "HVAC",
};

const PRIORITIES = {
  URGENT: "urgent",
  NORMAL: "normal",
};

export default function JobForm({ onClose }) {
  const skillOptions = Object.values(SKILLS);
  const priorityOptions = Object.values(PRIORITIES);
  const [opened, setIsOpened] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      category: skillOptions[0],
      priority: PRIORITIES.NORMAL,
      budget: 100,
    },
    validate: {
      title: (value) => (value.trim() === "" ? "Job title is required" : null),
      description: (value) =>
        value.trim() === "" ? "Description is required" : null,
    },
  });

  function handleToolTip() {
    setIsOpened(!opened);
  }

  const handleSubmit = async (values) => {
    try {
      await api.post("/api/jobs/create", values);
      onClose();
      notifications.show({
        title: "Job Posted Successfully",
        message: "Will be visible to workers soon",
        color: "green",
        position: "top-right",
      });
    } catch (err) {
      console.error("An error occurred:", err);
      notifications.show({
        title: "Something went wrong",
        message: "Try again filling the form",
        color: "red",
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        className="space-y-4"
      >
        <TextInput
          placeholder="ex: Kitchen Tab Leak"
          label="Job Title"
          required
          {...form.getInputProps("title")}
        />
        <Textarea
          label="Description"
          placeholder="ex: I need a plumber to fix my kitchen tab leak"
          required
          {...form.getInputProps("description")}
        />
        <Group justify="space-between">
          <NativeSelect
            label="Category"
            data={skillOptions}
            required
            {...form.getInputProps("category")}
          />
          <NumberInput
            leftSection="₹"
            label="Budget (optional)"
            placeholder="Amount in INR(₹)"
            {...form.getInputProps("budget")}
          />
        </Group>

        <Group justify="flex-start" align="self-end">
          <Chip.Group
            label="Priority"
            multiple={false}
            {...form.getInputProps("priority")}
          >
            <Group mt={24}>
              <Chip autoContrast color="orange" value={"URGENT"}>
                Urgent
              </Chip>
              <Chip autoContrast color="yellow" value={"NORMAL"}>
                Normal
              </Chip>
            </Group>
          </Chip.Group>

          <QuestionMarkTooltipIcon
            handleToolTip={handleToolTip}
            opened={opened}
            multiline={true}
            width={200}
            label="Mark your job post as per your urgency of work it can also affect your budget"
          />
        </Group>
        <Box fullWidth className="text-end">
          <Button type="submit" mt={10}>
            Submit Job
          </Button>
        </Box>
      </form>
    </div>
  );
}
