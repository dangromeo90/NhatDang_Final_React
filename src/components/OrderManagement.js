import React, { useState } from 'react';
import ListOrders from './Order/ListOrders';
import './styles/Dashboard.css';

const OrderManagement = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className="management">
      <h2>Quản lý đơn hàng</h2>
      {/* <button onClick={handleShow} className="btn btn-primary btn-add">Thêm Đơn Hàng</button> */}
      <ListOrders />
    </div>
  );
};

export default OrderManagement;
