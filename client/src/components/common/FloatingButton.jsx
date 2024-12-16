import { Drawer, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import JobForm from "../Form/JobForm";

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
      <Button
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50
        rounded-full 
        w-14 h-14 
        flex items-center justify-center 
        shadow-lg 
        border-0
        ${className}`}
      >
        <IoMdAdd
          className={`text-2xl transition-transform duration-300 ease-in-out ${
            isRotated ? "-rotate-45" : ""
          }`}
        />
      </Button>

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
