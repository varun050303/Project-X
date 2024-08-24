import React from 'react'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios'
export default function OAuth() {
    //Handle Login API Integration here
    const handleLogin = async () => {
        window.location.href = 'http://localhost:3000/auth/google'
    };



    return (
        <button className='bg-white rounded-md flex flex-row items-center m-auto gap-3 border px-3.5 py-3' onClick={handleLogin}>
            <div>
                <FcGoogle className='text-2xl' />
            </div>
            <div>
                Sign in with Google
            </div>
        </button>
    )
}
