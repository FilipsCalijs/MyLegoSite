import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  const login = (name, id, adminStatus) => {
    setUsername(name);
    setUserId(id);
    setIsAdmin(adminStatus);
    localStorage.setItem("username", name);
    localStorage.setItem("userId", id);
    localStorage.setItem("isAdmin", adminStatus);
  };

  const logout = () => {
    setUsername("");
    setUserId("");
    setIsAdmin(false);
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
  };

  return (
    <UserContext.Provider value={{ username, userId, isAdmin, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
