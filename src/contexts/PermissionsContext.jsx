// // // ---------- 1️⃣ Context: PermissionsContext.jsx ----------
// // import { createContext, useContext, useState } from "react";


// // const PermissionsContext = createContext();


// // export const PermissionsProvider = ({ children }) => {
// // const [isOpen, setIsOpen] = useState(false);


// // const toggleMenu = () => setIsOpen(prev => !prev);
// // const closeMenu = () => setIsOpen(false);


// // return (
// // <PermissionsContext.Provider value={{ isOpen, toggleMenu, closeMenu }}>
// // {children}
// // </PermissionsContext.Provider>
// // );
// // };

// // export const usePermissions = () => useContext(PermissionsContext);


// import { createContext, useContext, useState } from "react";

// const PermissionsContext = createContext();

// export const PermissionsProvider = ({ children }) => {
//   const [permissions, setPermissions] = useState([]);
//   const [role, setRole] = useState("");

//   const updatePermissions = (newPermissions, newRole) => {
//     setPermissions(newPermissions);
//     setRole(newRole);
//   };

//   return (
//     <PermissionsContext.Provider value={{
//       permissions,
//       role,
//       setPermissions,
//       setRole,
//       updatePermissions
//     }}>
//       {children}
//     </PermissionsContext.Provider>
//   );
// };

// export const usePermissions = () => useContext(PermissionsContext);


import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/axiosInstance";

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadFromServer = async () => {
      try {
        const res = await axiosInstance.get("/users/userInfo");
        const user = res.data?.user || {};
        const perms = res.data?.permissions || [];
        if (!mounted) return;
        setPermissions(perms);
        setRole(user.role || "");

        // cache locally for quick reloads
        try {
          localStorage.setItem("permissions", JSON.stringify(perms));
          const si = JSON.parse(localStorage.getItem("userInfo")) || {};
          si.user = si.user || {};
          si.user.role = user.role || si.user.role;
          localStorage.setItem("userInfo", JSON.stringify(si));
        } catch (e) {
          console.debug("PermissionsContext: failed to cache permissions locally", e);
        }
      } catch (err) {
        console.warn("PermissionsContext: failed to fetch /users/userInfo, falling back to localStorage", err);
        // fallback to localStorage if available
        try {
          const storedPermissions = JSON.parse(localStorage.getItem("permissions"));
          const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (storedPermissions) setPermissions(storedPermissions);
          if (storedUserInfo?.user?.role) setRole(storedUserInfo.user.role);
        } catch (e) {
          console.debug("PermissionsContext: no local cache available", e);
        }
      }
    };

    loadFromServer();

    return () => {
      mounted = false;
    };
  }, []);

 
  const updatePermissions = (newPermissions, newRole) => {
    setPermissions(newPermissions);
    setRole(newRole);

    // حفظهم في localStorage علشان ما يضيعوش بعد الريفريش
    localStorage.setItem("permissions", JSON.stringify(newPermissions));

    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    userInfo.role = newRole;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  // re-fetch permissions from server (useful after role change)
  const reloadPermissions = async () => {
    try {
      const res = await axiosInstance.get("/users/userInfo");
      const user = res.data?.user || {};
      const perms = res.data?.permissions || [];
      setPermissions(perms);
      setRole(user.role || "");
      // update local cache
      localStorage.setItem("permissions", JSON.stringify(perms));
      const si = JSON.parse(localStorage.getItem("userInfo")) || {};
      si.user = si.user || {};
      si.user.role = user.role || si.user.role;
      localStorage.setItem("userInfo", JSON.stringify(si));
      return { user, permissions: perms };
    } catch (err) {
      console.warn("PermissionsContext.reloadPermissions failed", err);
      throw err;
    }
  };


  const hasPermission = (perm) => {
    if (!perm) return false;
    return Array.isArray(permissions) && permissions.includes(perm);
  };

  return (
    <PermissionsContext.Provider value={{
      permissions,
      role,
      setPermissions,
      setRole,
      updatePermissions,
      reloadPermissions,
      hasPermission
    }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
