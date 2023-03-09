import { getAuth } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  
  const {name,email} = formData;
  const signOut = ()=>{
    auth.signOut();
    navigate("/");
  }
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl text-center font-bold mt-6'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form >
          <input type="text" value={name} id="name" disabled className=' mb-6 w-full px-4 py-2 text-xl text-gray-600 bg-white-border border-gray-300 rounded transi ease-in-out' />

          <input type="text" value={email} id="email" disabled className=' mb-6 w-full px-4 py-2 text-xl text-gray-600 bg-white-border border-gray-300 rounded transition ease-in-out' />

           <div className='flex justify-between text-sm mb-6 whitespace-nowrap sm:text-lg'>
            <p className='flex items-center'>Do you want to change your name?<span className='text-red-600 hover:text-red-800 cursor-pointer transition ease-in-out ml-1 duration-150'>Edit</span></p>
            <p onClick={signOut} className='text-blue-600 hover:text-blue-800 transition ease-in-out duration-150 cursor-pointer'>Sign Out</p>
           </div>
        </form>
      </div>
    </section>
    </>
  )
}
