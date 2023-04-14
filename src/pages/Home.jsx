import { async } from "@firebase/util";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";

export default function Home() {

  //offer listings
  const [listings, setListings] = useState(null);
  // rent listings
  const [rentListings, setRentListings] = useState(null);
  //sale Listings
  const [saleListings, setSaleListings] = useState(null);

  // offer listing
  useEffect(() => {
    const fetchlistings = async () => {
      try {

        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("offer","==",true),orderBy("timestamp","desc"), limit(4));
        const querySnap =  await getDocs(q);
        const listings = [];
        
          querySnap.forEach((item)=>{
            return listings.push({
              id: item.id,
              data: item.data()
            })
        })
        setListings(listings);


      } catch (error) {
        //console.log(error);
      }
    };

    fetchlistings();
  },[]);

// Rent Listing
useEffect(()=>{
  const fetchlistings = async()=>{
    try {
      const rentListingRef = collection(db,"listings");
      const q = query(rentListingRef,where("type","==", "rent"), orderBy("timestamp","desc"), limit(4));
      const querySnap = await getDocs(q);
      let rentListings = [];
      querySnap.forEach((doc)=>{
        return rentListings.push({
          id:doc.id,
          data: doc.data(),
        })
      })
      setRentListings(rentListings);
      
    } catch (error) {
      //console.log(error);
    }
  }

  fetchlistings();
},[])

// sale Listing
useEffect(()=>{
  const fetchSaleListing = async()=>{
    try {
      const saleListingRef = collection(db,"listings");
      const q = query(saleListingRef, where("type","==","sale"), orderBy("timestamp", "desc"), limit(4));
      const docSnap = await getDocs(q);
      const saleListing = [];

      docSnap.forEach((doc)=>{
        return saleListing.push({
          id:doc.id,
          data: doc.data(),
        })
      })
      setSaleListings(saleListing);
    } catch (error) {
      //console.log(error);
    }

  }

  fetchSaleListing();
},[])

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">

      {listings && listings.length>0 && (
      <div className="m-2 mb-6">
        <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
        <Link to="/offers"><p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"> Show More</p>
        </Link>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">

        {listings.map((listing)=>(
          <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
        ))}
        </ul>
      </div>)
      }
      {rentListings && rentListings.length>0 && (
      <div className="m-2 mb-6">
        <h2 className="px-3 text-2xl mt-6 font-semibold">Places for Rent</h2>
        <Link to="/category/rent"><p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"> Show More</p>
        </Link>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">

        {rentListings.map((listing)=>(
          <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
        ))}
        </ul>
      </div>)
      }
      {saleListings && saleListings.length>0 && (
      <div className="m-2 mb-6">
        <h2 className="px-3 text-2xl mt-6 font-semibold">Places for Sale</h2>
        <Link to="/category/sale"><p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"> Show More</p>
        </Link>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">

        {saleListings.map((listing)=>(
          <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
        ))}
        </ul>
      </div>)
      }
    </div>
    </div>
  );
}
