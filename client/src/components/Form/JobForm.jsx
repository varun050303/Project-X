import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { api } from "../../api/axios.config";
import { GoQuestion } from "react-icons/go";
import {
  Box,
  Button,
  Chip,
  Fieldset,
  Group,
  NativeSelect,
  NumberInput,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import QuestionMarkTooltipIcon from "../common/QuestionMarkTooltip";
import { usePostJob } from "../../features/jobs/hooks/useJob";

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
  const { mutate: postJob } = usePostJob();
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
      street: "",
      city: "",
      pincode: "",
      landmark: "",
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

  const handleSubmit = (values) => {
    onClose();
    postJob(values);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Fieldset legend="Job Details">
          <Group>
            <TextInput
              placeholder="ex: Kitchen Tab Leak"
              label="Title"
              required
              w={"100%"}
              {...form.getInputProps("title")}
            />
            <Textarea
              label="Description"
              placeholder="ex: I need a plumber to fix my kitchen tab leak"
              required
              w={"100%"}
              {...form.getInputProps("description")}
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
                label="Budget (optional)"
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
              placeholder="ex: Muzaffarnagar"
              {...form.getInputProps("city")}
            />
            <NumberInput
              required
              hideControls
              w={"40%"}
              label="Pincode"
              placeholder="ex: 224001"
              {...form.getInputProps("pincode")}
            />
            <TextInput
              required
              label="Landmark"
              placeholder="ex: near the bus stand"
              {...form.getInputProps("landmark")}
            />
          </Group>
        </Fieldset>

        <Group justify="flex-start" align="self-end">
          <Chip.Group
            label="Priority"
            multiple={false}
            {...form.getInputProps("priority")}
          >
            <Group mt={10}>
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

        <Box className="text-end">
          <Button type="submit">Submit Job</Button>
        </Box>
      </form>
    </div>
  );
}
