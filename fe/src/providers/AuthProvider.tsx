// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext<any>(null);

// export const AuthProvider = ({ children }: any) => {
//   const navigate = useNavigate();

//   const getCredentials = async () => {
//     const user = await localStorage.getItem("user");

//     if (user) {
//       const currentUser = JSON.parse(user);

//       if (currentUser) {
//         if (currentUser.role === "admin") {
//           navigate("/admin/dashboard");
//         } else if (currentUser.role === "user") {
//           navigate("/user/home");
//         }
//       }
//     } else {
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     getCredentials();
//     //   onLogout();
//   }, []);

//   const onLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/");
//     window.location.reload();
//   };

//   return (
//     <AuthContext.Provider value={{ onLogout }}>{children}</AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCredentials = async () => {
    const user = await localStorage.getItem("user");

    if (!user) {
      // If no user and currently on a protected route, redirect to login
      if (
        location.pathname !== "/" &&
        !location.pathname.includes("/register")
      ) {
        navigate("/");
      }
      return;
    }

    const currentUser = JSON.parse(user);

    // If on root ("/"), redirect based on role
    if (location.pathname === "/") {
      if (currentUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (currentUser.role === "user") {
        navigate("/user/home");
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    getCredentials();
  }, [location.pathname]);

  const onLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ onLogout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
