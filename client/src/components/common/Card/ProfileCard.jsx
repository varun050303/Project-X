import { Card, Image, Text } from "@mantine/core";

export default function ProfileCard({ name }) {
  const images = [
    "/assets/avatars/avatar1.png",
    "/assets/avatars/avatar2.png",
    "/assets/avatars/avatar3.png",
    "/assets/avatars/avatar4.png",
    "/assets/avatars/avatar5.png",
  ];

  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <Card href="#" maw={200}>
      <Card.Section>
        <Image
          src={randomImage}
          h={98}
          alt="No way!"
          style={{ objectPosition: "top" }}
        />
      </Card.Section>

      <Text fw={500} size="lg" mt="md" tt={"capitalize"}>
        {name}
      </Text>

      <Text mt="xs" c="dimmed" size="sm">
        Please click anywhere on this card to claim your reward, this is not a
        fraud, trust us
      </Text>
    </Card>
  );
}
