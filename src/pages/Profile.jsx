import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  Query,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const signOut = () => {
    auth.signOut();
    navigate("/");
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.code);
    }
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      setLoading(false);
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingID)=>{
    if(window.confirm("Are you sure you want to Delete?")){
      await deleteDoc(doc(db,"listings",listingID));
      const updatedListings = listings.filter((listing)=> listing.id!== listingID);
      setListings(updatedListings);
      toast.success("Listing deleted Successfully!")
    }
  }

  const onEdit  = (listingID)=>{
    navigate(`/edit-listing/${listingID}`);
  }

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center font-bold mt-6">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              value={name}
              id="name"
              disabled={!editProfile}
              onChange={onChange}
              className=" mb-6 w-full px-4 py-2 text-xl text-gray-600 bg-white-border border-gray-300 rounded transi ease-in-out"
            />

            <input
              type="text"
              value={email}
              id="email"
              disabled
              className=" mb-6 w-full px-4 py-2 text-xl text-gray-600 bg-white-border border-gray-300 rounded transition ease-in-out"
            />

            <div className="flex justify-between text-sm mb-6 whitespace-nowrap sm:text-lg">
              <p
                onClick={() => {
                  editProfile && onSubmit();
                  setEditProfile((prevState) => !prevState);
                }}
                className="flex items-center"
              >
                Do you want to change your name?
                <span className="text-red-600 hover:text-red-800 cursor-pointer transition ease-in-out ml-1 duration-150">
                  {editProfile ? "Apply" : "Edit"}
                </span>
              </p>
              <p
                onClick={signOut}
                className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-150 cursor-pointer"
              >
                Sign Out
              </p>
            </div>
          </form>

          <button
            type="submit"
            className="bg-blue-500 w-full text-white uppercase px-7 py-3 text-sm font-medium rounded hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 bg-red-200 rounded-full p-1 text-3xl" />
              Sell or Rent Your Home
            </Link>
          </button>
        </div>
      </section>
      {!loading && listings.length !== null && listings.length > 0 && (
        <>
          <h2 className="text-2xl text-center font-semibold mb-6 mt-6">My Listings</h2>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-5 mb-5">
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
                onDelete = {()=>onDelete(listing.id)}
                onEdit = {()=> onEdit(listing.id)}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
