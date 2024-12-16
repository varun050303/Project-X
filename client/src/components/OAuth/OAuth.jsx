import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Logo from "../common/HeaderComponents/Logo";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Image,
  Radio,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { motion } from "framer-motion";

export default function OAuth() {
  const [selectedRole, setSelectedRole] = useState(null);
  const theme = useMantineTheme();

  const handleSignUp = async (role) => {
    // Redirect to Google OAuth with selected role
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/google?action=signup&role=${role}`;
  };

  const handleLogin = async () => {
    // Redirect to Google OAuth with selected role
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/google?action=login`;
  };

  // Role configuration to avoid repetition
  const roles = [
    {
      type: "client",
      label: "I'm a client, hiring for a work",
      image: "/assets/roles/client.png",
      imageWidth: 80,
    },
    {
      type: "worker",
      label: "I'm a worker, looking for a job",
      image: "/assets/roles/worker.png",
      imageWidth: 65,
    },
  ];

  return (
    <>
      <Container fluid mx="md" py="xl">
        <Logo />
      </Container>

      <Container size="md" p="md">
        <Title
          fz={{
            base: "h5",
            xs: "h3",
            sm: "h3",
            md: "h3",
            lg: "h2",
            xl: "h1",
          }}
          ta="center"
        >
          Join as a client or worker
        </Title>
        <Flex
          direction={{
            base: "column",
            sm: "row",
            md: "row",
            lg: "row",
            xl: "row",
          }}
          align="center"
          justify="center"
          my="xl"
          gap="md"
        >
          {roles.map((role) => (
            <motion.div
              key={role.type}
              whileTap={{ scale: 0.95 }}
              style={{ width: "100%" }}
            >
              <Card
                withBorder
                w="100%"
                h={100}
                onClick={() => {
                  setSelectedRole(role.type);
                }}
                style={{ cursor: "pointer" }}
                mx={{ base: 0, sm: "lg", md: "lg", lg: "lg", xl: "lg" }}
                shadow={selectedRole === role.type ? "xl" : "sm"}
                backgroundColor={
                  selectedRole === role.type
                    ? theme.colors.primary[2]
                    : theme.colors.gray[1]
                }
              >
                <Grid grow columns={10}>
                  <Grid.Col span={2} p={0}>
                    <Image
                      w={role.imageWidth}
                      src={role.image}
                      alt={role.type}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fz="lg" fw={600}>
                      {role.label}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <Radio
                      checked={selectedRole === role.type}
                      onChange={() => {
                        setSelectedRole(role.type);
                      }}
                    />
                  </Grid.Col>
                </Grid>
              </Card>
            </motion.div>
          ))}
        </Flex>
        <Box w="100%" ta={"center"}>
          <Button
            color="primary"
            disabled={!selectedRole}
            onClick={() => handleSignUp(selectedRole)}
            leftIcon={<FcGoogle />}
            ta={"center"}
          >
            Sign up with Google
          </Button>
        </Box>
        <Divider my="xl" label="or" labelPosition="center" />
        <Box ta={"center"} w={"100%"}>
          <Text ta={"center"}>Already have an account?</Text>
          <Button variant="transparent" ta={"center"} onClick={handleLogin}>
            Log in
          </Button>
        </Box>
      </Container>
    </>
  );
}
