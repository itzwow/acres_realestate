import React from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Offers from "./pages/Offers";
import CreateListing from "./pages/CreateListing";
import EditListing from "./components/EditListing";
import Listing from "./pages/Listing";
function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/profile"element={<PrivateRoute/>}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:category/:listingId" element={<Listing />} />
          <Route  path="/create-listing" element={<PrivateRoute/>}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route  path="/edit-listing" element={<PrivateRoute/>}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
