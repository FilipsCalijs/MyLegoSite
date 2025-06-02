import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Nav from "./components/Nav/Nav";
import IntroHero from "./components/IntroHero/IntroHero";
import MyProducts from "./components/MyProducts/MyProducts";

function App() {
  return (
    <UserProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<IntroHero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-products" element={<MyProducts />} /> {/* ← ЭТО НОВОЕ */}
        </Routes>
      </Router>
    </UserProvider>
  );
}


export default App;
