import { Carousel } from "@mantine/carousel";
import React from "react";
import { api } from "../../api/axios.config";
import { Box, Paper, Text } from "@mantine/core";
import ProfileCard from "../common/Card/ProfileCard";

export default function BaseCarousel({ data, loading }) {
  return (
    <Carousel
      height={250}
      slideSize="52.333333%"
      slideGap="lg"
      align="start"
      withControls={false}
    >
      {data.map((el) => (
        <Carousel.Slide key={el.id}>
          <ProfileCard name={el.name} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
