import React, { createContext, useContext, useState } from "react";

const IsLoggedIn = createContext();

export function IsLoggedInProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <IsLoggedIn.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</IsLoggedIn.Provider>
  );
}

export function useIsLoggedIn() {
  const context = useContext(IsLoggedIn);

  if (!context) {
    throw new Error("useIsLoggedIn must be used within a ThemeProvider");
  }

  return context;
}

