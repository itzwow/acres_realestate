import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router";

export default function EditListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geolocationEnabled, setgeolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();

  // fetching data from firebase firestore
  useEffect(()=>{
    setLoading(true);
    const  fetchlisting = async ()=>{
        const docRef = doc(db,"listings",params.listingId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            setListing(docSnap.data());
            setFormData({...docSnap.data()});
            setLoading(false);
        }else{
            navigate("/");
            toast.error("Listing does not exist")
        }
    }
    fetchlisting();
  },[])

  useEffect(()=>{
    if(listing && listing.userRef !== auth.currentUser.uid){
        toast.error("Can't edit this listing!")
        navigate("/")
    }
  },[auth.currentUser.uid, listing, navigate])

  const onChange = (e) => {
    let flag = null;
    if (e.target.value === "true") {
      flag = true;
    }
    if (e.target.value === "false") {
      flag = false;
    }

    if (e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: flag ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be less than regular price!");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum of 6 images can be uploaded!");
    }

    let geolocation = {};
    geolocation.lat = latitude;
    geolocation.lng = longitude;

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
         
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
            
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image)=>storeImage(image))
    ).catch((error)=>{
      setLoading(false);
      toast.error("Images Not uploaded!!");
      return ;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    }

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;

    const docRef = doc(db,"listings",params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Updated");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">
        Edit Listing
      </h1>
      <form onSubmit={onSubmit}>
        <p className="font-semibold text-lg mt-6">Sell / Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            name="type"
            value="sale"
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            name="type"
            value="rent"
            onClick={onChange}
            className={` ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "rent"
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
          >
            Rent
          </button>
        </div>
        <p className="font-semibold text-lg mt-6 ">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Enter your name"
          maxLength="32"
          minLength="5"
          required
          className=" w-full px-4 py-2 text-xl text-gray-600 bg-white focus:border-slate-600 focus:text-gray-700 focus:bg-white rounded transition ease-in-out duration-150"
        />

        <div className="flex justify-between">
          <div className="mr-3">
            <p className="font-semibold text-lg mt-6">Bedrooms</p>
            <input
              type="number"
              name="bedrooms"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max={50}
              className="text-xl px-3 py-2 text-gray-700 text-center transition ease-in-out duration-100 focus:bg-white focus:border-slate-600 rounded w-full "
            />
          </div>
          <div>
            <p className="font-semibold text-lg mt-6">Bathrooms</p>
            <input
              type="number"
              name="bathrooms"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max={50}
              className=" text-xl px-3 py-2 text-gray-700 text-center transition ease-in-out duration-100 focus:bg-white focus:border-slate-600 rounded w-full "
            />
          </div>
        </div>

        <p className="font-semibold text-lg mt-6">Parking spot</p>
        <div className="flex ">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={` ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            No
          </button>
        </div>
        <p className="font-semibold text-lg mt-6">Furnished</p>
        <div className="flex mt-3">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={` ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            No
          </button>
        </div>
        <p className="font-semibold text-lg mt-6">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          required
          placeholder="Address"
          className="w-full text-gray-600 bg-white focus:border-slate-500 focus:text-gray-600 focus:bg-white rounded tranisition ease-in-out duration-100"
        />

        {!geolocationEnabled && (
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-lg">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                min={-90}
                max={90}
                required
                className="text-xl px-3 py-2 text-gray-700 text-center transition ease-in-out duration-100 focus:bg-white focus:border-slate-600 rounded w-full"
              />
            </div>
            <div>
              <p className="font-semibold text-lg">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                min={-180}
                max={180}
                required
                className="text-xl px-3 py-2 text-gray-700 text-center transition ease-in-out duration-100 focus:bg-white focus:border-slate-600 rounded w-full"
              />
            </div>
          </div>
        )}
        <p className="font-semibold text-lg mt-6 ">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className=" w-full  text-gray-600 bg-white focus:border-slate-600 focus:text-gray-700 focus:bg-white rounded transition ease-in-out duration-150"
        />

        <p className="font-semibold text-lg mt-6">Offer</p>
        <div className="flex ">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={` ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            No
          </button>
        </div>
        <div className="mt-6 mb-6">
          <div className="">
            <p className="font-semibold text-lg">Regular Price</p>
            <div className="flex justify-center items-center space-x-3">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                required
                min="50"
                max="400000"
                className="text-center rounded transition ease-in-out duration-150 w-full"
              />
              {type === "rent" && (
                <div className="w-full">
                  <p>$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {offer && (
          <div className="mt-6 mb-6">
            <div className="">
              <p className="font-semibold text-lg">Discounted Price</p>
              <div className="flex justify-center items-center space-x-3">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  required={offer}
                  min="50"
                  max="400000"
                  className="text-center rounded transition ease-in-out duration-150 w-full"
                />
                {type === "rent" && (
                  <div className="w-full">
                    <p>$ / Month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be cover image (max 6)
          </p>
          <input
            type="file"
            id="images "
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 bg-white border border-gray-100 rounded transition duration-150 ease-in-out"
          />
        </div>

        <button
          type="submit"
          className="mb-6 px-7 py-3 w-full rounded bg-blue-600 text-sm uppercase text-white font-medium hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}
