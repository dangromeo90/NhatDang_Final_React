// src/components/User/EditUserModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $phone: String, $address: String) {
    updateUser(id: $id, name: $name, email: $email, phone: $phone, address: $address) {
      id
      name
      email
      phone
      address
    }
  }
`;


const EditUserModal = ({ user, show, handleClose, refetch }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    username: user.username
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật tác giả thành công!',
        showConfirmButton: false,
        timer: 1500
    });
      handleClose();
      refetch();
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ variables: { id: user.id, ...formData } });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sửa Người Dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="add-user-form">
          <Form.Group controlId="formName">
            <Form.Label>Tên</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Điện Thoại</Form.Label>
            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Địa Chỉ</Form.Label>
            <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
          </Form.Group>
        
          <Button variant="primary" type="submit">
            Lưu Thay Đổi
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;
