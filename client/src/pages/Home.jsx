import React from 'react'
import { useAuth } from '../contexts/auth.context'
import { Checkbox } from '@mantine/core';
export default function Home() {

    const { user } = useAuth()
    return (
        <>
            <Checkbox
                defaultChecked
                color="lime.4"
                iconColor="dark.8"
                size="md"
                label="Bright lime checkbox"
            />
        </>
    )
}
