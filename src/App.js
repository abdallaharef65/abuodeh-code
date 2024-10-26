import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./views/pages/mainpage/Main";
import Product from "./views/pages/product/Product";
import Category from "./views/pages/category/Category";
import Login from "./views/pages/login/login";
import NavBar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/product" element={<Product />} />
            <Route path="/category" element={<Category />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
// <Navbar />
// <Main />
