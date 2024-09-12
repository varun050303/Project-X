import React from 'react'
import { useAuth } from '../contexts/auth.context'
import { Box, Text, Title, Image, Avatar, ThemeIcon, Flex, Divider, Tooltip, Alert, Button, Paper, NavLink } from '@mantine/core'
import { MdOutlineDangerous } from "react-icons/md";
import { VscInfo } from "react-icons/vsc";
import { FaHistory } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
const data = [
    {
        icon: FaHistory,
        label: 'Booking History',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '/home'
    },
    {
        icon: FaBookmark,
        label: 'Saved Workers',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '/home'
    },
    {
        icon: MdModeEdit,
        label: 'Edit Profile',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '/home'
    },
    {
        icon: BiSupport,
        label: 'Help & Support',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '/home'
    },
    {
        icon: RiLogoutBoxLine,
        label: 'Logout',
        rightSection: <RiArrowRightSLine size="1rem" />,
        href: '/home'
    }
]


export default function Profile() {
    const { user } = useAuth()
    const infoIcon = <VscInfo />
    const [opened, setOpened] = React.useState(false)
    const items = data.map((item, index) => (<>
        <NavLink
            href={item.href}
            key={item.label}
            label={item.label}
            description={item.description}
            rightSection={item.rightSection}
            leftSection={<item.icon size="1rem" stroke={1} />}
            onClick={() => setActive(index)}
            classNames={{
                label: 'text-base font-semibold',
            }} />
        {data.length - 1 !== index && <Divider my={"xs"} orientation='horizontal' />}
    </>));
    return (
        <Box>
            <Box>
                <Image
                    radius="sm"
                    h="110px"
                    fit='cover'
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                />
                <Box mt={-50} ml={15}>
                    <Avatar
                        src={user?.profile_pic} // Replace with actual image source
                        alt="User avatar"
                        size="xl"
                        style={{ cursor: 'pointer' }}
                        name={user?.name}
                        color="initials"
                        bg={'black'}
                    />
                </Box>
            </Box>
            <Box mt={25}>
                <Flex gap={'xs'} align={'center'}>
                    <Title order={3}>{user?.name}</Title>
                    <Divider orientation="vertical" />
                    <Tooltip label="Add mobile number" color='red' withArrow opened={opened}>
                        <Flex gap={'xs'} onClick={() => setOpened((o) => !o)}>
                            <Text c={'red'} fw={600}>{user?.phone_number ? 'User Verified' : 'Not Verified'}</Text>
                            <ThemeIcon variant='outline' color='red' radius={"md"} size={'sm'}>
                                <MdOutlineDangerous style={{ width: '70%', height: '70%' }} />
                            </ThemeIcon>
                        </Flex>
                    </Tooltip>
                </Flex>
                <Button size='compact-xs' fz={15} p={0} my={6} variant='transparent'>Contact Info</Button>
            </Box>
            {!(user?.phone_number) &&
                <Box mt={25}>
                    <Alert variant="light" color="blue" title="Verify Mobile Number" icon={infoIcon}>
                        <Text mb={12}>
                            Please add your mobile number to verify your account
                        </Text>
                        <Button variant="light">Add Mobile Number</Button>
                    </Alert>
                </Box>
            }
            <Box mt={25}>
                <Paper shadow="xl" p="sm" withBorder>
                    <Flex justify={'center'} align={'center'} gap={'xl'}>
                        <Box>
                            <Text fw={500} size='md' order={4}>Total Bookings</Text>
                            <Text ta={'center'}>0</Text>
                        </Box>
                        <Divider size="md" orientation="vertical" />
                        <Box>
                            <Text fw={500} size='md' c={'green.7'} order={4}>Active Bookings</Text>
                            <Text ta={'center'}>0</Text>
                        </Box>
                    </Flex>
                </Paper>
            </Box>

            <Box mt={25}>
                <Paper shadow="xl" p="xs" radius="md" withBorder>
                    <Box p={0}>
                        {items}
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}
