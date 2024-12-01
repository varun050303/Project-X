import React, { useState } from 'react'
import { NavLink, Box, Text, Paper } from '@mantine/core';
import { VscDashboard } from "react-icons/vsc";
import { FaHome } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from 'react-router-dom';
const data = [
    {
        icon: FaHome,
        label: 'Home',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '/home'
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
        href: '/account'
    },
    {
        icon: MdCurrencyRupee,
        label: 'Transactions',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '#'
    },


];

export default function Navbar({ user, toggleNavbar }) {
    const [active, setActive] = useState(0);

    const items = data.map((item, index) => (
        <React.Fragment key={index}>
            <NavLink
                component={Link}
                to={item.href}
                active={index === active}
                label={item.label}
                description={item.description}
                rightSection={item.rightSection}
                leftSection={<item.icon size="1rem" stroke={1.5} />}
                onClick={() => { toggleNavbar(); setActive(index) }}

            />

        </React.Fragment>
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
