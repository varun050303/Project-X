import { Box, Center, Flex, Text } from "@mantine/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios.config";
import RoleSelectionCard from "../components/common/Card/RoleSelectionCard";

const workerImg = "/assets/roles/worker.jpeg";
const clientImg = "/assets/roles/client.jpeg";
export default function ChooseRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  async function handleRoleSelection(role) {
    console.log("Role selected:", role); // Debugging line
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post("/api/users/set-role", {
        role,
      });

      console.log(response);

      setSuccess(response.data.message);
      setLoading(false);

      if (role === "WORKER") {
        navigate("/worker-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to set role");
      setLoading(false);
    }
  }

  return (
    <Center h={"100vh"} bg="var(--mantine-color-gray-light)">
      <Box>
        <Text fw={700} size="lg" ml={"xl"}>
          Select Your Role
        </Text>
        <Text mb="xl" size="md" ml={"xl"}>
          Choose the role that suits you best to get started!
        </Text>
        <Flex
          gap="md"
          mt="xl"
          wrap={"wrap"}
          justify={"center"}
          align={"center"}
        >
          <RoleSelectionCard
            img={workerImg}
            role="Worker"
            buttonText="Explore Jobs"
            badge="Available for Work"
            description={
              "Expand your opportunities and start getting hired today."
            }
            onClick={() => handleRoleSelection("WORKER")}
          />
          <RoleSelectionCard
            img={clientImg}
            role="Client"
            buttonText="Find Worker"
            badge="Looking for Workers"
            description={
              "Discover great opportunities and connect with professionals in your area."
            }
            onClick={() => handleRoleSelection("CLIENT")}
          />
        </Flex>
      </Box>
    </Center>
  );
}
