import React from 'react'
import Header from '../components/Form/Header'
import Login from '../components/Form/Login'

export default function LoginPage() {
    return (
        <div>
            <Header
                heading="Login to your account"
                paragraph="Don't have an account yet? "
                linkName="Signup"
                linkUrl="/signup"
            />
            <Login />
        </div>
    )
}
