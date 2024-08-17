import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
      <li>
          <Link to="/admin/category-management" className={location.pathname === '/category-management' ? 'active' : ''}>
            Quản lý danh mục
          </Link>
        </li>
        <li>
          <Link to="/admin/product-management" className={location.pathname === '/product-management' ? 'active' : ''}>
            Quản lý sản phẩm
          </Link>
        </li>
        <li>
          <Link to="/admin/user-management" className={location.pathname === '/user-management' ? 'active' : ''}>
            Quản lý user
          </Link>
        </li>
        <li>
          <Link to="/admin/order-management" className={location.pathname === '/order-management' ? 'active' : ''}>
            Quản lý đơn hàng
          </Link>
        </li>
       
        {/* <li>
          <Link to="/logout" className={location.pathname === '/order-management' ? 'active' : ''}>
            Quản lý đơn hàng
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
