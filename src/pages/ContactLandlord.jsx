import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function ContactLandlord({ listing, userRef }) {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandLord(docSnap.data());
      } else {
        toast.error("Landlord data doen not exist!");
      }
    };
    getLandlord();
  }, [userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landLord !== null && (
        <div>
          <p>
            Send message to {landLord.name} for the {listing.name.toLowerCase()}
          </p>

          <textarea
            name="message"
            id="message"
            onChange={onChange}
            value={message}
            rows="2"
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
          ></textarea>
      <a
        href={`mailto:${landLord.email}?Subject:${listing.name}&body=${message}`}
        >
        <button
          className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
          type="button"
          >
          Send Message
        </button>
      </a>
            </div>
          )}
    </>
  );
}
