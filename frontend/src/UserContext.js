import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  const login = (name, id) => {
    setUsername(name);
    setUserId(id);
    localStorage.setItem("username", name);
    localStorage.setItem("userId", id); 
  };
  
  

  const logout = () => {
    setUsername("");
    setUserId("");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  return (
    <UserContext.Provider value={{ username, userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
