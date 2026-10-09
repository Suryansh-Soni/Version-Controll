import React,{createContext,useState,useEffect,useContext} from 'react';
const AuthContext=createContext();

export const useAuth=()=>{
    return useContext(AuthContext);
}

export const AuthProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState(null);
    useEffect(()=>{
        const userId=localStorage.getItem('userId');
        if(userId){
            setCurrent          User(userId);
        }
    },[]);

    const value={
        currentUser,setCurrentUser
    }

    return <AuthContext.Provider vlaue={value}>
        {children}
    </AuthContext.Provider> 

}