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
import SubcategoryProducts from "./components/SubcategoryProducts";
import Contact from "./components/pages/Contact";
import HelpWidget from "./components/HelpWidget/HelpWidget";
// --- Blog related ---
import Blog from "./components/pages/Blog";
import CreatePost from "./components/pages/CreatePost";
import PostView from "./components/pages/PostView";
import ManageTags from "./components/pages/ManageTags";
import Footer from "./components/Footer/Footer";


function ProtectedRoute({ children, adminOnly = false }) {
  const { userId, isAdmin } = React.useContext(UserContext);

  if (!userId) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Nav />
        <HelpWidget /> 
        <Routes>
          <Route path="/" element={<IntroHero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/my-products" element={
            <ProtectedRoute>
              <MyProducts />
            </ProtectedRoute>
          } />

          <Route path="/manage-products" element={
            <ProtectedRoute adminOnly={true}>
              <ManageProducts />
            </ProtectedRoute>
          } />

          <Route path="/create-categories" element={
            <ProtectedRoute adminOnly={true}>
              <CreateCategories />
            </ProtectedRoute>
          } />

          <Route path="/category/:id" element={<CategoryDetails />} />
          <Route path="/subcategory/:id" element={<SubcategoryProducts />} /> 
          <Route path="/contact" element={<Contact />} />

          {/* --- Blog --- */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:id" element={<PostView />} />
          <Route path="/create-post" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="/edit-post/:id" element={
            <ProtectedRoute>
              <CreatePost editMode />
            </ProtectedRoute>
          } />
          <Route path="/manage-tags" element={
            <ProtectedRoute adminOnly={true}>
              <ManageTags />
            </ProtectedRoute>
          } />
          
        </Routes>
        
      </Router>
      <Footer />
    </UserProvider>
  );
}

export default App;
