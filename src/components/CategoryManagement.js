import React, { useState } from 'react';
import CategoryModal from './Category/CategoryModal';
import ListCategories from './Category/ListCategories';
import './styles/Dashboard.css';

const CategoryManagement = () => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const handleShow = () => setShowAddCategoryModal(true);
  const handleClose = () => setShowAddCategoryModal(false);

  return (
    <div className="management">
      <h2>Quản Lý Danh Mục</h2>
      <button onClick={handleShow} className="btn btn-primary btn-add">
        Thêm Danh Mục
      </button>
      <CategoryModal show={showAddCategoryModal} handleClose={handleClose} />
      <ListCategories />
    </div>
  );
};

export default CategoryManagement;
