import React from "react";
import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
/**@param {Array} data */

export default function SingleBoxCarousel({
  data,
  withControls,
  height = 200,
}) {
  return (
    <Carousel height={height} withControls={withControls} loop>
      {data.map((image, index) => (
        <Carousel.Slide key={index}>
          <Image src={image} alt={index} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
