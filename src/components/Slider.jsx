import { collection, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getDocs } from "firebase/firestore";
import Spinner from "./Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  Autoplay,
  EffectFade,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router";

export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchlistings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      //console.log(listings);
      setListings(listings);
      setLoading(false);
    };
    fetchlistings();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (listings?.length === 0) return <></>;
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          autoplay={{ delay: 3000 }}
          modules={[EffectFade]}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="w-full  relative h-[400px] overflow-hidden"
              ></div>
              <p className="fixed top-2 left-2 bg-blue-500 p-2 text-white rounded-br-3xl">{data.name}</p>
              <p className="fixed bottom-2 left-2 min-w-[100px] bg-red-500 p-2 text-white rounded-br-3xl text-center">{data.type}</p>
              
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
