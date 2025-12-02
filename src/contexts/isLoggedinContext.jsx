import { createContext, useContext, useState, useEffect } from "react";

const IsLoggedInContext = createContext();

export const IsLoggedInProvider = ({ children }) => {
 
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem("token");
    }
  }, [isLoggedIn]);

  return (
    <IsLoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </IsLoggedInContext.Provider>
  );
};

// Hook لاستخدام الحالة بسهولة
export const useIsLoggedIn = () => useContext(IsLoggedInContext);

