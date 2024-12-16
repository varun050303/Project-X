import React from "react";
import {
  Container,
  Text,
  Title,
  Button,
  Group,
  useMantineTheme,
  Stack,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  return (
    <Container size="md" py="xl">
      <Stack
        align="center"
        justify="center"
        spacing="xl"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FiAlertTriangle
            size={120}
            color={theme.colors.red[6]}
            strokeWidth={1.5}
            style={{ marginBottom: theme.spacing.md }}
          />
        </motion.div>

        <Title
          ta="center"
          c={theme.colors.gray[8]}
          style={{
            fontSize: "3rem",
            marginBottom: theme.spacing.md,
          }}
        >
          404 - Page Not Found
        </Title>

        <Text
          ta="center"
          c={theme.colors.gray[7]}
          size="lg"
          style={{ maxWidth: 500, marginBottom: theme.spacing.xl }}
        >
          Oops! The page you're looking for seems to have taken an unexpected
          detour. Don't worry, our team of digital explorers is on the case.
        </Text>

        <Group>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="md"
              variant="outline"
              color="primary"
              onClick={() => navigate("/")}
              leftIcon={<FiAlertTriangle size={18} />}
            >
              Back to Home
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="md"
              color="primary"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </motion.div>
        </Group>
      </Stack>
    </Container>
  );
}
