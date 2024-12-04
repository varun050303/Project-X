import React from "react";
import { Carousel } from "@mantine/carousel";
import EmptyState from "../common/EmptyState";

export default function BaseCarousel({
  data,
  CardComponent,
  height = 250,
  slideSize = "52.333333%",
  slideGap = "lg",
  align = "start",
  withControls = false,
}) {
  // Validate that CardComponent is provided
  if (!CardComponent) {
    console.error("CardComponent is required for BaseCarousel");
    return null;
  }

  if (!data || data.length === 0) {
    return <EmptyState />; // Better fallback message
  }

  return (
    <Carousel
      height={height}
      slideSize={slideSize}
      slideGap={slideGap}
      align={align}
      withControls={withControls}
    >
      {data.map((item) => (
        <Carousel.Slide key={item.id}>
          <CardComponent {...item} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
