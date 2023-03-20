import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc,doc, collection, Query, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {FcHome} from 'react-icons/fc'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ListingItem from '../components/ListingItem';

export default function Profile() {
  const auth = getAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [listings,setListings] = useState([]);
  const [loading,setLoading] = useState(true);

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

  const onChange = (e)=>{

    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async()=>{
    try {
      if(auth.currentUser.displayName !== name){
        await updateProfile(auth.currentUser,{
          displayName: name,
        })

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef,{
          name,
        })
      }

      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error(error.code);
    }
  }

  useEffect(() => {
    const fetchUserListings = async ()=>{
      setLoading(false)
        const listingRef = collection(db,"listings");
        const q = query(listingRef,where("userRef","==", auth.currentUser.uid), orderBy("timestamp","desc"));
        const querySnap = await getDocs(q);
        let listings=[];
        querySnap.forEach((doc)=>{
            return listings.push({
              id: doc.id,
              data: doc.data(),
            });
        });
        setListings(listings);
        setLoading(false);
    }

    fetchUserListings();
  
  }, [auth.currentUser.uid])
  
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl text-center font-bold mt-6'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form >
          <input type="text" value={name} id="name" disabled = {!editProfile} onChange={onChange} className=' mb-6 w-full px-4 py-2 text-xl text-gray-600 bg-white-border border-gray-300 rounded transi ease-in-out' />

          <input type="text" value={email} id="email" disabled className=' mb-6 w-full px-4 py-2 text-xl text-gray-600 bg-white-border border-gray-300 rounded transition ease-in-out' />

           <div className='flex justify-between text-sm mb-6 whitespace-nowrap sm:text-lg'>
            <p onClick={()=>{
              editProfile && onSubmit();
              setEditProfile((prevState) => !prevState)}} 
              className='flex items-center'>Do you want to change your name?<span className='text-red-600 hover:text-red-800 cursor-pointer transition ease-in-out ml-1 duration-150'>
              {editProfile ?"Apply":"Edit"}
            </span></p>
            <p onClick={signOut} className='text-blue-600 hover:text-blue-800 transition ease-in-out duration-150 cursor-pointer'>Sign Out</p>
           </div>
        </form>

        <button type="submit" className='bg-blue-500 w-full text-white uppercase px-7 py-3 text-sm font-medium rounded hover:bg-blue-700 transition duration-150 ease-in-out'>
          <Link to="/create-listing" className='flex justify-center items-center'>
          <FcHome className='mr-2 bg-red-200 rounded-full p-1 text-3xl'/>
          Sell or Rent Your Home
          </Link>
        </button>
      </div>
    </section>
    { !loading && listings.length!==null && listings.length >0 && 
      (<>
      <h2 className='text-2xl text-center font-semibold'>My Listings</h2>
      <ul>{listings.map((listing)=>
        (<ListingItem key={listing.id} id={listing.id} listing={listing.data}/>)
      )}</ul>
      </>)

    }
    </>
  )
}
