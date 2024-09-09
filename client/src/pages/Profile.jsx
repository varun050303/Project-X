import React from 'react'
import { useAuth } from '../contexts/auth.context'
import { Box, Text, Title, Image, Avatar } from '@mantine/core'

export default function Profile() {
    const { user } = useAuth()
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
                    />
                </Box>
            </Box>
            <Box mt={30}>
                <Title order={3}>{user?.name}</Title>
            </Box>
        </Box>
    )
}
