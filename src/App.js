import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import OwnerProfile from './components/OwnerProfilePage';
import AdminProfile from './components/AdminProfilePage';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import PaymentPage from './components/PaymentPage';
import YourOrderPage from './components/YourOrderPage'; 
import ClientProfilePage from './components/ClientProfilePage'; 
import RegisterProductPage from './components/RegisterProductPage.js';
import OrderHistoryPage from './components/OrderHistoryPage.js';
import ProductListPage from './components/ProductListPage.js';
import AdminCheckOrderPage from './components/AdminCheckOrderPage.js';
import AddAdminStaffPage from './components/AddAdminStaffPage.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart/:userId" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/:userId" element={<AdminProfile />} />
          <Route path="/owner/:userId" element={<OwnerProfile />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} /> 
          <Route path="/order/:orderId" element={<YourOrderPage />} />
          <Route path="/profile/:userId" element={<ClientProfilePage />} />
          <Route path="/RegisterProduct" element={<RegisterProductPage />} />
          <Route path="/OrderHistory" element={<OrderHistoryPage />} />
          <Route path="/ProductList" element={<ProductListPage />} />
          <Route path="/AdminCheck/:orderId" element={<AdminCheckOrderPage />} />
          <Route path="/addRole" element={<AddAdminStaffPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
