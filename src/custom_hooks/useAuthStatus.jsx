import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useState, useEffect } from 'react'

export function useAuthStatus() {
    
    const [isLoggedIn, setIsLoggedIn]  = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        })
    }, [])
    
  return {isLoggedIn,isLoading}
}
