import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, Button, Container, Text, Title, Stack } from "@mantine/core";
import { TbAlertSquareFilled } from "react-icons/tb";
import { IoRefreshCircleSharp } from "react-icons/io5";

function ErrorFallback({ error, resetErrorBoundary, title, subtitle }) {
  // Default props
  const errorTitle = title || "An unexpected error occurred";
  const errorSubtitle =
    subtitle ||
    "Our team has been notified. Please try again or contact support if the problem persists.";

  // Log the error to your error tracking service
  const logError = (error) => {
    console.error("Application error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
    // Add your error logging service here (e.g., Sentry, LogRocket)
  };

  // Log error when component mounts
  React.useEffect(() => {
    logError(error);
  }, [error]);

  return (
    <Container size="md" p="xl">
      <Stack
        align="center"
        spacing="lg"
        style={{ minHeight: "50vh" }}
        justify="center"
      >
        <Alert
          icon={<TbAlertSquareFilled size="1.5rem" />}
          title={errorTitle}
          color="red"
          variant="filled"
          radius="md"
          w="100%"
        >
          <Stack spacing="md">
            <Text size="sm" color="white">
              {errorSubtitle}
            </Text>
            {error.message && (
              <Text size="sm" color="white" opacity={0.9}>
                Error details: {error.message}
              </Text>
            )}
          </Stack>
        </Alert>

        <Button
          onClick={resetErrorBoundary}
          leftIcon={<IoRefreshCircleSharp size="1.2rem" />}
          variant="light"
          color="blue"
          size="md"
        >
          Try Again
        </Button>
      </Stack>
    </Container>
  );
}

export default function AppErrorBoundary({ children, onReset, onError }) {
  const handleError = (error, errorInfo) => {
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
