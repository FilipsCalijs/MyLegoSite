import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, UserContext } from "./UserContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Nav from "./components/Nav/Nav";
import IntroHero from "./components/IntroHero/IntroHero";
import MyProducts from "./components/MyProducts/MyProducts";
import ManageProducts from "./components/Admin/ManageProducts";
import CreateCategories from "./components/Admin/CreateCategories";
import CategoryDetails from "./components/CategoryDetails";


function ProtectedRoute({ children, adminOnly = false }) {
  const { userId, isAdmin } = React.useContext(UserContext);

  if (!userId) return <Navigate to="/" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<IntroHero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:id" element={<CategoryDetails />} />
          <Route
            path="/my-products"
            element={
              <ProtectedRoute>
                <MyProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-products"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-categories"
            element={
              <ProtectedRoute adminOnly={true}>
                <CreateCategories />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
