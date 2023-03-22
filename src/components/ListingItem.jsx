import React from "react";
import Moment from "react-moment";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
    <li className=" relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transi duration-150 ease-in-out m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          src={listing.imgUrls[0]}
          alt=""
          className="h-[170px] w-full object-cover hover:scale-105 transition ease-in"
          loading="lazy"
        />
        <Moment
          className="absolute uppercase text-xs top-2 left-2 bg-[#3377cc] text-white font-semibold rounded px-2 py-1 "
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
          <div className="space-x-1 flex items-center">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold  text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold mt-2 text-xl truncate">{listing.name}</p>
          <p className="font-semibold  text-[#457b9d] mt-2">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute right-3  bottom-3 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(listing.id)}
        />
      )}

      {onEdit && (
        <MdEdit
          className="absolute right-8  bottom-3 h-[14px] cursor-pointer text-black"
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
}
