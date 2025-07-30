import { createContext, useContext, useState, useEffect } from "react";

// إنشاء الـ Context
const IsLoggedInContext = createContext();

// الـ Provider الذي يوزع الحالة على باقي المكونات
export const IsLoggedInProvider = ({ children }) => {
  // الحالة تعتمد على وجود token في localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  // مزامنة الحالة مع localStorage عند أي تغيير
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // كلما تغيّرت حالة الدخول، نتحكم في وجود التوكن
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
