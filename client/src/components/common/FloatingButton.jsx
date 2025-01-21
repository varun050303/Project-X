import { Drawer, Button, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import JobForm from "../../features/jobs/components/JobForm";

const FloatingButton = ({ onClick, className }) => {
  const [isRotated, setIsRotated] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const handleClick = (e) => {
    // Rotate the icon
    setIsRotated(!isRotated);

    open();
  };

  const handleClose = () => {
    close();
    setIsRotated(!isRotated);
  };

  return (
    <>
      <ActionIcon
        onClick={handleClick}
        variant="filled"
        size="xl"
        radius="xl"
        style={{
          width: "3.5rem", // equivalent to w-14
          height: "3.5rem", // equivalent to h-14
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
        }}
      >
        <IoMdAdd
          className={`text-2xl transition-transform duration-300 ease-in-out ${
            isRotated ? "-rotate-45" : ""
          }`}
        />
      </ActionIcon>

      <Drawer
        opened={opened}
        position="bottom"
        onClose={handleClose}
        title="Create a job post"
        size={"74%"}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <JobForm onClose={handleClose} />
      </Drawer>
    </>
  );
};

export default FloatingButton;
