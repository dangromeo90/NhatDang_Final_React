
import React, { useState } from 'react';
import ListUsers from './User/listUser';
import UserModal from './User/UserModal';
import './styles/Dashboard.css';

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className="management">
      <h2>Quản lý user</h2>
      <button onClick={handleShow} className="btn btn-primary btn-add">Thêm User</button>
      <ListUsers />
      <UserModal show={showModal} handleClose={handleClose} />
    </div>
  );
};

export default UserManagement;
