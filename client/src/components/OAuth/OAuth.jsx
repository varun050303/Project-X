import React from 'react'
import { FcGoogle } from "react-icons/fc";
export default function OAuth() {
    //Handle Login API Integration here
    const handleLogin = async () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    };

    return (
        <button onClick={handleLogin}>
            <div>
                <FcGoogle className='text-2xl' />
            </div>
            <div>
                Sign in with Google
            </div>
        </button>
    )
}
