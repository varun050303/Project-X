import React from 'react'
import { FcGoogle } from "react-icons/fc";
export default function OAuth() {
    return (
        <button className='bg-white rounded-md flex flex-row items-center m-auto gap-3 border px-3.5 py-3'>
            <div>
                <FcGoogle className='text-2xl' />
            </div>
            <div>
                Sign in with Google
            </div>
        </button>
    )
}
