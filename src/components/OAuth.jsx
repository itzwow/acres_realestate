import React from 'react'
import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
  return (
    <button className='flex items-center justify-center w-full  bg-red-600 hover:bg-red-700 text-center text-white font-medium px-7 py-3 uppercase text-sm rounded transition-all ease-in-out'>
        <FcGoogle className='mr-2 bg-white rounded-full text-2xl'/>
        Continue with Google
    </button>
  )
}
