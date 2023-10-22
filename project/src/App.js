import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import Home from './components/home';
import Userprofile from './components/user-profile';
import About from './components/about';
import Register from './components/Registrationform';
import Login from './components/login_form';
import Update from './components/update';
import UserProducts from './components/userproduct';
import AdminDashboard from './components/admin-dashboard';
function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-profile" element={<Userprofile />} />
          <Route path="/about" element={<About />} />
          <Route exact path="/Registrationform" element={<Register />} />
          <Route path="/login_form" element={<Login />} />
          <Route path="/update" element={<Update />} />
          <Route path="/userproduct" element={<UserProducts />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
