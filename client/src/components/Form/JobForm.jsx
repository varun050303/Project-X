import React from "react";
import { useForm } from "@mantine/form";
import { api } from "../../api/axios.config";
import { Button, NativeSelect, Textarea, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const Skill = Object.freeze({
  PLUMBING: "Plumbing",
  ELECTRICAL: "Electrical",
  CARPENTRY: "Carpentry",
  PAINTING: "Painting",
  CLEANING: "Cleaning",
  MECHANICAL: "Mechanical",
  PLASTERING: "Plastering",
  MASONRY: "Masonry",
  HVAC: "HVAC",
});

export default function JobForm({ onClose }) {
  const skillOptions = Object.values(Skill);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      category: skillOptions[0],
    },
    validate: {
      title: (value) => (value.trim() === "" ? "Job title is required" : null),
      description: (value) =>
        value.trim() === "" ? "Description is required" : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      await api.post("/api/jobs/create", values);
      form.reset(); // Reset form after success
      onClose();
      notifications.show({
        title: "Job Posted Successfully",
        message: "Will be visible to workers soon",
        color: "green",
        position: "top-right", // Explicitly set position
        withCloseButton: true, // Add close button
        // styles: {
        //   root: {
        //     top: "63px", // Customize top position directly
        //     width: "300px",
        //     right: "0px",
        //   },
        // },
      });
    } catch (err) {
      console.error("An error occurred:", err);
      notifications.show({
        title: "Something went wrong",
        message: "Try again filling the form",
        color: "red",
        position: "top-right", // Consistent positioning
        withCloseButton: true,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        className="space-y-4"
      >
        <TextInput
          placeholder="ex: Kitchen Tab Leak"
          label="Job Title"
          required
          {...form.getInputProps("title")}
          error={form.errors.title}
        />
        <Textarea
          label="Description"
          placeholder="ex: I need a plumber to fix my kitchen tab leak"
          required
          {...form.getInputProps("description")}
          error={form.errors.description}
        />
        <NativeSelect
          label="Category"
          data={skillOptions}
          required
          {...form.getInputProps("category")}
        />
        <Button type="submit" className="mt-4">
          Submit Job
        </Button>
      </form>
    </div>
  );
}
