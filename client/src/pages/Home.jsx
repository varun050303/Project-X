import React from "react";
import { useAuth } from "../contexts/auth.context";
import { Box, Image, Paper, Pill, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import WorkerHList from "../components/List/WorkerHList";
import FloatingButton from "../components/common/FloatingButton";

const imagesUrl = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
];

const filterOption = ["Nearby", "For Sale", "For Rent"];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <Box>
        <Carousel height={200} withControls={false} loop>
          {imagesUrl.map((image, index) => (
            <Carousel.Slide key={index}>
              <Image src={image} alt={index} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>

      <Box my={"xl"}>
        <Title fw={700} order={3} mb={"sm"}>
          Nearby You
        </Title>

        <Box>
          <Box>
            <WorkerHList />
          </Box>
        </Box>
      </Box>

      <FloatingButton />
    </>
  );
}
