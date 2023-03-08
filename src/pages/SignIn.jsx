import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const onChange = (e) => {
    // console.log(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleShowPassword = ()=>{
    setShowPassword(!showPassword);
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth,email,password);
      if(userCredential.user){
        navigate("/");
        toast.success("Login Successful!");
      }else{
        toast.error("User not found");
      }

    } catch (error) {
      toast.error(error.code);
    }
  }
  return (
    <section>
      <h1 className="text-center font-sans font-bold text-xl mt-3">Sign In</h1>
      <div className="flex justify-center flex-wrap items-center px-5 py-10 mx-auto max-w-6xl">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7963.jpg?w=740&t=st=1674034153~exp=1674034753~hmac=4f4f0b5fa0617685cbc7e9ebef90178814fb43bb3b77b4df6c9f2de7e922d46b"
            alt="sigin"
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
              <p>Don't have an account?<Link to="/sign-up" className="ml-1 text-red-400 hover:text-red-500">Register</Link></p>
              <Link to="/forget-password" className="text-blue-500 hover:text-blue-700">Forgot Password?</Link>
            </div>
          
          <button  type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-center text-white uppercase font-medium px-6 py-2 rounded transition-all ease-in-out">Sign in</button>
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
