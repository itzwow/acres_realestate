import React from "react";
import { useLocation, useNavigate } from "react-router";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  const pathMatchRoute = (route) => {
    return route === location.pathname;
  };
  return (
    <div className="bg-white border-b shadow-sm sticky top-0">
      <header className="flex justify-between px-3 items-center max-w-6xl mx-auto">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
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
                pathMatchRoute("/sign-in") && "text-black border-b-red-400"
              }`}
              onClick = {()=>{
                navigate("/sign-in")
              }}
            >
              Sigin
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
          </ul>
        </div>
      </header>
    </div>
  );
}
