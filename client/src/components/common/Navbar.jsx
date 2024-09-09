import React, { useState } from 'react'
import { NavLink, Box, Text, Paper } from '@mantine/core';
import { VscDashboard } from "react-icons/vsc";
import { FaHome } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";
const data = [
    {
        icon: FaHome,
        label: 'Home',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '#'
    },
    {
        icon: VscDashboard,
        label: 'Dashboard',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '#'
    },
    {
        icon: VscAccount,
        label: 'Account',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '#'
    },

];

export default function Navbar({ user }) {
    const [active, setActive] = useState(0);

    const items = data.map((item, index) => (
        <NavLink
            href={item.href}
            key={item.label}
            active={index === active}
            label={item.label}
            description={item.description}
            rightSection={item.rightSection}
            leftSection={<item.icon size="1rem" stroke={1.5} />}
            onClick={() => setActive(index)}

        />
    ));
    return (
        <Box>
            <Box>
                <Text fw={700}>
                    Welcome {user?.name} !
                </Text>
            </Box>
            <Box my={"md"}>
                <Paper shadow="xl" p="sm" radius="md" withBorder>
                    <Box>{items}</Box>
                </Paper>
            </Box>
        </Box>
    )
}
