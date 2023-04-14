import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

export default function SignIn() {
  
  const [formData, setFormData] = useState({
    email: "",
  });

  const { email} = formData;
  const onChange = (e) => {
    // //console.log(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const auth = getAuth();

      await sendPasswordResetEmail(auth,email);
      toast.success("Reset link sent successfully!")
    } catch (error) {
      toast.error(error.code);
    }
    
  }

  return (
    <section>
      <h1 className="text-center font-sans font-bold text-xl mt-3">Forgot Password</h1>
      <div className="flex justify-center flex-wrap items-center px-5 py-10 mx-auto max-w-6xl">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1010.jpg?w=740&t=st=1674208048~exp=1674208648~hmac=5a50d4e5d004d4e7c17f4193c39b8b715c9e8a20e2fb8906d42cf99ca34c58cd"
            alt="logoimg"
            className="rounded-2xl w-full"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={handleSubmit}>
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
            
            <div className="flex justify-between whitespace-nowrap mb-6">
              <p>Don't have an account?<Link to="/sign-up" className="ml-1 text-red-400 hover:text-red-500">Register</Link></p>
              <Link to="/sign-in" className="text-blue-500 hover:text-blue-700">Sign In instead</Link>
            </div>
          
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-center text-white uppercase font-medium px-6 py-2 rounded transition-all ease-in-out">Reset Password</button>
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
