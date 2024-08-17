import React, { useState } from 'react';
import ProductModal from './Product/ProductModal';
import ListProducts from './Product/listProduct';
import './styles/Dashboard.css';

const ProductManagement = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleShow = () => setShowAddProductModal(true);
  const handleClose = () => setShowAddProductModal(false);

  return (
    <div className="management">
      <h2>Quản Lý Sản Phẩm</h2>
      <button onClick={handleShow} className="btn btn-primary btn-add">
        Thêm Sản Phẩm
      </button>
      <ProductModal show={showAddProductModal} handleClose={handleClose} />
      <ListProducts />
    </div>
  );
};

export default ProductManagement;
