import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState("Sign-in");
  const auth = getAuth();
  console.log(location);
  const pathMatchRoute = (route) => {
    return route === location.pathname;
  };

  useEffect(() => {
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setPageState("Profile")
      }else{
        setPageState("Sign-in")
      }
    })
  }, [auth])
  
  return (
    <div className="bg-white border-b shadow-sm sticky top-0">
      <header className="flex justify-between px-3 items-center max-w-6xl mx-auto">
        <div className="flex items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9202/9202494.png"
            alt="logo"
            className="h-5 cursor-pointer"
            style={{height:"30px", width:"30px"}}
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent  ${
                pathMatchRoute("/") && "text-black border-b-red-400"
              }`}
              onClick = {()=>{
                navigate("/")
              }}
            >
              Home
            </li>
            
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent  ${
                pathMatchRoute("/offers") && "text-black border-b-red-400"
              }`}
              onClick = {()=>{
                navigate("/offers")
              }}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent  ${
                (pathMatchRoute("/sign-in")|| pathMatchRoute("/profile")) && "text-black border-b-red-400"
              }`}
              onClick = {()=>{
                navigate("/profile")
              }}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
