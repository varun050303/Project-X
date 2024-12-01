import React from "react";
import FloatingButton from "../components/common/FloatingButton";
import SingleBoxCarousel from "../components/carousel/SingleBoxCarousel";
import Section from "../components/common/Section";
import GenericHList from "../components/common/GenericHList";
import ProfileCard from "../components/common/Card/ProfileCard";
import JobCard from "../components/common/Card/JobCard";
const imagesUrl = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
];

export default function Home() {
  return (
    <>
      <SingleBoxCarousel data={imagesUrl} withControls={false} />

      <Section title="Nearby You">
        <GenericHList
          apiPath="/api/workers/get"
          dataKey={"workers"}
          CardComponent={ProfileCard}
        />
      </Section>

      <Section title="Track Your Jobs">
        <GenericHList
          height={290}
          slideSize={"58.333333%"}
          apiPath="/api/jobs/get"
          dataKey={"jobs"}
          CardComponent={JobCard}
        />
      </Section>

      <FloatingButton />
    </>
  );
}
