// src/components/Category/EditCategoryModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import '../styles/formUser.css'

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String!) {
    updateCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;

const EditCategoryModal = ({ category, show, handleClose, refetch }) => {
  const [formData, setFormData] = useState({
    name: category.name || ''
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật danh mục thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      handleClose();
      refetch();
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật danh mục thất bại',
        text: error.message
      });
    }
  });

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name || '' });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCategory({ variables: { id: category.id, name: formData.name } });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sửa Danh Mục</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="add-user-form">
          <Form.Group controlId="formName">
            <Form.Label>Tên Danh Mục</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Nhập tên danh mục" 
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Lưu Thay Đổi
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCategoryModal;
