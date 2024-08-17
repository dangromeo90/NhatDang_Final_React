
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddUser from './addUser';

const UserModal = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Thêm User</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <AddUser />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default UserModal;
