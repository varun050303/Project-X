import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob, deleteJob } from "../api/jobs.api";
import { notifications } from "@mantine/notifications";

const usePostJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      notifications.show({
        title: "Job Created Successfully",
        color: "green",
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: () => {
      notifications.show({
        title: "Something went wrong",
        color: "red",
        position: "top-right",
        autoClose: 3000,
      });
    },
  });
};

const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      notifications.show({
        title: "Job Deleted Successfully",
        color: "green",
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: () => {
      notifications.show({
        title: "Something went wrong",
        color: "green",
        position: "top-right",
        autoClose: 3000,
      });
    },
  });
};

export { useDeleteJob, usePostJob };
