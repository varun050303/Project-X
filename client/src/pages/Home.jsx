import React from 'react'
import { useAuth } from '../contexts/auth.context'

export default function Home() {

    const { user } = useAuth()
    return (
        <p>Hie</p>
    )
}
