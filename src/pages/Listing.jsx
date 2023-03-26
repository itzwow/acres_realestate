import { getDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import {getAuth} from "firebase/auth"
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectFade,
  Autoplay,
} from "swiper";
import "swiper/css/bundle";
import {FaBath, FaParking, FaShare} from "react-icons/fa"
import { toast } from "react-toastify";
import { MdChair, MdLocationOn } from "react-icons/md";
import {FaBed} from "react-icons/fa"
import ContactLandlord from "./ContactLandlord";

export default function Listing() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [linkCopied, setlinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  const auth = getAuth()
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  const onChange = ()=>{
    setContactLandlord(true);
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={{ type: "progressbar" }}
        navigation
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
        
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full overflow-hidden relative h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
        
      </Swiper>
      <div className="fixed top-[13%] right-[3%] z-10 cursor-pointer border bg-white w-10 h-10 rounded-full flex justify-center items-center" onClick={()=>{
        navigator.clipboard.writeText(window.location.href);
        setlinkCopied(true);
        setTimeout(()=>{
            toast.success("URL copied successfully!");
            setlinkCopied(false);
        },10)
        
      }}>
        <FaShare className="text-lg"/>
        
        </div>

        <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 bg-white rounded-lg lg:space-x-5">
            <div className=" w-full ">
              <p className="text-2xl font-semibold text-blue-900">{listing.name} - ${listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                  {listing.type === "rent"? "/ month":""}
                  <p className="flex items-center mt-3">
                    <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold  text-sm mb-[2px]  truncate">
              {listing.address}
                  
            </p></p>
            <div className="flex items-center space-x-4 mt-2">
              <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-md text-center text-white">{listing.type==="Rent"?"For Rent": "For Sale"}</p>
              <p className="bg-green-800 w-full max-w-[200px] rounded-md p-1 text-md text-center text-white">{listing.offer? `$${+listing.regularPrice - +listing.discountedPrice} discount` :""}</p>
            </div>
            <div className="mt-3 mb-3">
              <p className=""><span className="font-semibold">Description</span> - {listing.description}</p>
            </div>
            <ul className="flex items-center justify-between">
              <li className="flex items-center space-x-3"><FaBed className="mr-2 text-xl"/>  {listing.bedrooms>1? `${listing.bedrooms} Beds`: "1 Bed"}</li>
              <li className="flex items-center space-x-3"><FaBath className="mr-2 text-xl"/>  {listing.bathrooms>1? `${listing.bathrooms} Baths`: "1 Bath"}</li>
              <li className="flex items-center space-x-3"><FaParking className="mr-2 text-xl"/>  {listing.parking? "Parking Available": "Parking Unavailable"}</li>
              <li className="flex items-center space-x-3"><MdChair className="mr-2 text-xl"/>  {listing.furnished? "Furnished": "Not Furnished"}</li>
            </ul>
            {!contactLandlord  && auth.currentUser !== listing.userRef &&  (<div className="mt-5 mb-3 p-4">
            <button onClick={onChange} className="w-full bg-blue-500 p-2 rounded">Contact Landlord</button>
            </div>
            
            )
           
           }
           {contactLandlord && <ContactLandlord userRef = {listing.userRef} listing = {listing}/>}
           
           </div>
            <div className="bg-blue-300 w-full h-[200px] z-10 overflow-x-hidden lg-[400px]"></div>
        </div>
           
        
    </main>
  );
}
