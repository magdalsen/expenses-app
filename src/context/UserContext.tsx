import { createContext, useState } from "react";

import { supabase } from "../supabaseClient";

import { getSafeContext } from "./getSafeContext";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "./NotificationContext";

type UserContextProps={
    logOut: ()=>void;
    setToken: (token:string)=>void;
    getToken: ()=>string | null;
    setId: (id:string)=>void;
    userId: string;
}

export const UserContext=createContext<UserContextProps|null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { toggleAlertSuccess } = useNotificationContext();
  const [userId, setId] = useState('');
  const navigate = useNavigate();

  const setToken = (userToken: string) => {
    sessionStorage.setItem('token', userToken);
  }

  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    return tokenString
  }

  const logOut=async()=>{
     sessionStorage.removeItem('token');
     toggleAlertSuccess('Successful logout!');
     navigate('/');
     const { error } = await supabase.auth.signOut();
     if (error) throw error;
  }


    return (
      <UserContext.Provider value={{ setToken, getToken, logOut, setId, userId }}>
        {children}
      </UserContext.Provider>
    );
  };

  export const useUserContext = getSafeContext(UserContext, "userContext")