import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDoc, serverTimestamp, setDoc,doc } from 'firebase/firestore';
import React from 'react'
import { db } from '../firebase';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export default function OAuth() {
  const navigate = useNavigate();
  const googleLogin = async()=>{
    try{
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
       //console.log(user);

      // checking for the user
      const docRef = doc(db,"users",user.uid);
      const docSnap = await getDoc(docRef);

      if(!docSnap.exists()){
        await setDoc(docRef,{
          name: user.displayName,
          email: user.email,
          timeStamp:serverTimestamp()
        })
      }
      navigate("/");
    }catch(error){
      toast.error('error occured!')
      //console.log(error);
    }
  }
  return (
    <button type='button' onClick={googleLogin} className='flex items-center justify-center w-full  bg-red-600 hover:bg-red-700 text-center text-white font-medium px-7 py-3 uppercase text-sm rounded transition-all ease-in-out'>
        <FcGoogle className='mr-2 bg-white rounded-full text-2xl'/>
        Continue with Google
    </button>
  )
}
