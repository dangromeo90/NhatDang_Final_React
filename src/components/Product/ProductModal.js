import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddProduct from './addProduct';

const ProductModal = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose} dialogClassName="modal-xl" className='formProduct'>
    <Modal.Header closeButton>
      <Modal.Title>Thêm Sản Phẩm</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <AddProduct />
    </Modal.Body>
   
  </Modal>
);

export default ProductModal;
