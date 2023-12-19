import { createContext } from "react";
import { toast,ToastContainer } from "react-toastify";

import { getSafeContext } from "./getSafeContext";

import 'react-toastify/dist/ReactToastify.css';

type UserContextProps={
    toggleAlertSuccess: (alert:string)=>void;
    toggleAlertError: (alert:string)=>void;
}

const toastConfig = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
}

export const NotificationContext=createContext<UserContextProps|null>(null)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const toggleAlertSuccess = (alert:string) => {
        toast.success(alert, {...toastConfig, theme: "colored"});
    }

    const toggleAlertError = (alert:string) => {
        toast.error(alert, {...toastConfig, theme: "colored"});
    }

    return (
      <NotificationContext.Provider value={{ toggleAlertSuccess, toggleAlertError }}>
        {children}
        <ToastContainer />
      </NotificationContext.Provider>
    );
  };

  export const useNotificationContext = getSafeContext(NotificationContext, "notificationContext")