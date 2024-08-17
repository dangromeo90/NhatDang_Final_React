// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $username: String!, $password: String!) {
    registerUser(name: $name, email: $email, username: $username, password: $password) {
      id
      name
      email
      username
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      setFormData({ name: '', email: '', username: '', password: '' });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại',
        text: error.message
      });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({ variables: { ...formData } });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Tên</Form.Label>
        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formUsername">
        <Form.Label>Tên đăng nhập</Form.Label>
        <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Mật khẩu</Form.Label>
        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
      </Form.Group>
      <Button variant="primary" type="submit">
        Đăng ký
      </Button>
    </Form>
  );
};

export default Register;
