import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <Outlet /> {/* Hiển thị các route con ở đây */}
      </div>
    </div>
  );
};

export default Dashboard;
