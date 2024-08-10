import React from 'react'
import Header from '../components/Form/Header'
import Signup from '../components/Form/Signup'

export default function SignupPage() {
    return (
        <>
            <Header
                heading="Signup to create an account"
                paragraph="Already have an account? "
                linkName="Login"
                linkUrl="/"
            />
            <Signup />
        </>
    )
}
