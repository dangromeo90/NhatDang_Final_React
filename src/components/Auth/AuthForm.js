import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Form, Button, ToggleButtonGroup, ToggleButton, Container, Row, Col, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css'; // Thêm file CSS

const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      id
      name
      email
      username
    }
  }
`;

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: ({ loginUser }) => {
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      localStorage.setItem('token', loginUser.token);
      navigate('/admin/product-management');
    },
    onError: (error) => {
      console.error('GraphQL Error:', error);
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
    loginUser({ variables: { username: formData.username, password: formData.password } });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 auth-card">
        <Row>
          <Col>
            <h3 className="text-center mb-4">{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h3>
            <ToggleButtonGroup
              className="mb-3 d-flex justify-content-center"
              type="radio"
              name="authType"
              defaultValue={1}
            >
              <ToggleButton
                id="tbg-radio-1"
                value={1}
                variant="outline-primary"
                onClick={() => setIsRegister(false)}
              >
                Đăng nhập
              </ToggleButton>
              <ToggleButton
                id="tbg-radio-2"
                value={2}
                variant="outline-secondary"
                onClick={() => setIsRegister(true)}
              >
                Đăng ký
              </ToggleButton>
            </ToggleButtonGroup>

            <Form onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  {/* Các trường đăng ký có thể thêm ở đây */}
                </>
              )}
              <Form.Group controlId="formUsername">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button className="mt-4 w-100" variant="primary" type="submit">
                {isRegister ? 'Đăng ký' : 'Đăng nhập'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default AuthForm;
