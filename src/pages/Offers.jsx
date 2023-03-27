import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

export default function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchMore, setFetchMore] = useState(null);

  useEffect(() => {
    const fetchlistings = async () => {
      try {
        const offerRef = collection(db, "listings");
        const q = query(
          offerRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const offerListings = [];
          setFetchMore(querySnap.docs[querySnap.docs.length-1])
        querySnap.forEach((listing) => {
          return offerListings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setListings(offerListings);
        setLoading(false);
      } catch (error) {
        toast.error("No Listings found");
      }
    };
    fetchlistings();
  }, []);

  const onFetchMore = async()=>{
    try {
      const offerRef = collection(db, "listings");
      const q = query(
        offerRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(4),
        startAfter(fetchMore)
      );
      const querySnap = await getDocs(q);
      const offerListings = [];
      setFetchMore(querySnap.docs[querySnap.docs.length-1])
      querySnap.forEach((listing) => {
        return offerListings.push({
          id: listing.id,
          data: listing.data(),
        });
      });
      setListings((prev)=>[...prev,...offerListings]);
      setLoading(false);
    } catch (error) {
      toast.error("No Listings found");
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold">Offers</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>  
        <div >
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {listings.map((listing)=>(
              <ListingItem id={listing.id} key={listing.id} listing = {listing.data}/>
            ))}
          </ul>
         {fetchMore && <div className="center flex items-center justify-center">

          <button type="button" onClick={onFetchMore} className="bg-white p-2 text-center rounded "> Load More</button>
          </div>}
        </div>
        
        </>
      ) : (
        <p>No listings Found!</p>
      )}
    </div>
  );
}
