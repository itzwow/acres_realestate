import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { db } from "../firebase";
import { setDoc,doc, serverTimestamp} from "firebase/firestore";
import { toast } from "react-toastify";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const {name, email, password } = formData;
  const onChange = (e) => {
    // console.log(e.target.value) --> this method is actually adding respective data to the variables created
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleShowPassword = ()=>{
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const auth = getAuth();
      
      const userCredential =  await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(auth.currentUser,{
        displayName: name,
      })
      const user = userCredential.user;
      
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      // console.log(error);
      toast.error(error.code);
    }
    
  }
  return (
    <section>
      <h1 className="text-center font-sans font-bold text-xl mt-3">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-5 py-10 mx-auto max-w-6xl">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7885.jpg?w=740&t=st=1674207822~exp=1674208422~hmac=14be2a8db0be398ae2e9280895aead38baefa17d4fbd317897ea37f4c5aac4fa"
            alt="sigup"
            className="rounded-2xl w-full"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name=""
              id="name"
              value={name}
              className="w-full mb-5"
              onChange={onChange}
              placeholder="Enter your name"
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name=""
              id="email"
              value={email}
              className="w-full mb-5"
              onChange={onChange}
              placeholder="Enter your email"
            />
            <label htmlFor="email">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name=""
                id="password"
                value={password}
                className="w-full mb-5"
                onChange={onChange}
                placeholder="Enter your password"
              />
              {showPassword ? (
                <AiFillEyeInvisible className="absolute top-3 right-3 text-xl cursor-pointer" onClick={handleShowPassword}/>
              ) : (
                <AiFillEye className="absolute top-3 right-3 text-xl cursor-pointer" onClick={handleShowPassword}/>
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap mb-6">
              <p>Already have an account?<Link to="/sign-in" className="ml-1 text-red-400 hover:text-red-500">Login</Link></p>
              <Link to="/forget-password" className="text-blue-500 hover:text-blue-700">Forgot Password?</Link>
            </div>
          
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-center text-white uppercase font-medium px-6 py-2 rounded transition-all ease-in-out">Sign up</button>
          <div className="my-5  items-center before:border-t flex before:flex-1 before:border-gray-300 after:border-t  after:flex-1 after:border-gray-300">
          <p className="text-center font-semibold mx-4">OR</p>
          </div>
          <OAuth/>
          </form>
        </div>
      </div>
    </section>
  );
}
