import React from 'react'
import { useAuth } from '../contexts/auth.context'
import { Avatar } from 'evergreen-ui'

export default function Home() {

    const { user } = useAuth()
    return (
        <Avatar name={user.name} size={40} />
    )
}
