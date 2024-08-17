// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      user {
        id
        name
        email
        username
      }
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.loginUser.token);
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      setFormData({ username: '', password: '' });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
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
    loginUser({ variables: { ...formData } });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Tên đăng nhập</Form.Label>
        <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Mật khẩu</Form.Label>
        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
      </Form.Group>
      <Button variant="primary" type="submit">
        Đăng nhập
      </Button>
    </Form>
  );
};

export default Login;
