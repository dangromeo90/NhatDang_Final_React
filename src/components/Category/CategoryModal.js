import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddCategoryForm from './AddCategoryForm'; // Import the AddCategoryForm component

const CategoryModal = ({ show, handleClose, category }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{category ? 'Edit Category' : 'Add Category'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddCategoryForm category={category} /> {/* Pass category if editing */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;
