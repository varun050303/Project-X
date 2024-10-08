import React from 'react'
import { useAuth } from '../contexts/auth.context'
import { Box, Image, Paper, Pill, Title } from '@mantine/core';
import { Carousel } from "@mantine/carousel";

const imagesUrl = [
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
]

const filterOption = [
    "Nearby",
    "For Sale",
    "For Rent",
]

export default function Home() {
    const { user } = useAuth()
    return (
        <>
            <Box>
                <Carousel height={200} loop>
                    {imagesUrl.map((image, index) => (
                        <Carousel.Slide key={index}>
                            <Image src={image} alt={index} />
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </Box>

            <Box my={"xl"}>
                <Paper shadow="xl" p="md" radius="md" withBorder>
                    <Box className='space-x-3'>
                        {
                            filterOption.map((option, index) =>
                                <Pill key={index} withRemoveButton classNames={{
                                    root: "bg-blue-500 text-white",
                                    label: "text-sm"
                                }}>{option}</Pill>
                            )
                        }

                    </Box>
                    <Box my={30}>
                        <Title fw={700} order={3}>Nearby You</Title>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}
