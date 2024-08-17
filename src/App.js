import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Thêm Navigate ở đây
import AuthForm from './components/Auth/AuthForm'; // Component đăng nhập
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import OrderManagement from './components/OrderManagement';
import CategoryManagement from './components/CategoryManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route cho trang đăng nhập */}
        <Route path="/login" element={<AuthForm />} />

        {/* Route cho trang admin, có thể sử dụng một component khác để bảo vệ hoặc kiểm tra quyền truy cập */}
        <Route path="/admin/*" element={<Dashboard />}>
          <Route path="product-management" element={<ProductManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="order-management" element={<OrderManagement />} />
          <Route path="category-management" element={<CategoryManagement />} />
        </Route>

        {/* Redirect từ trang gốc tới trang đăng nhập */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
