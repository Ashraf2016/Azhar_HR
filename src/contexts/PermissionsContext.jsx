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

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions"));
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
console.log(storedUserInfo?.user?.role)
    if (storedPermissions) {
      setPermissions(storedPermissions);
    }

    if (storedUserInfo?.user?.role) {
      setRole(storedUserInfo.user.role);
    }
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


  const hasPermission = (perm) => permissions?.includes(perm);

  return (
    <PermissionsContext.Provider value={{
      permissions,
      role,
      setPermissions,
      setRole,
      updatePermissions,
      hasPermission
    }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
