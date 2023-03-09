import React from 'react'
import { Navigate, Outlet } from 'react-router';
import { useAuthStatus } from '../custom_hooks/useAuthStatus';

function PrivateRoute() {
  const {isLoggedIn,isLoading} = useAuthStatus();
  if(isLoading){
    return <h3>Loading...</h3>
  }   
  return isLoggedIn ? <Outlet/>:<Navigate to={"/sign-in"}/>
}

export default PrivateRoute