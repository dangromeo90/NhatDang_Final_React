// src/components/User/ListUsers.js
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Table, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../styles/Dashboard.css';
import EditUser from './EditUser';
import '../styles/formUser.css';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
      address
      username
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
    }
  }
`;

const ListUsers = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Xóa người dùng thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      refetch();
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Xóa người dùng thất bại',
        text: error.message
      });
    }
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Tính toán số trang
  const totalUsers = data.users.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Xác định các người dùng để hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = data.users.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser({ variables: { id } });
      }
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  return (
    <div className="management">
      <h2>Danh sách người dùng</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Tên đăng nhập</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.username}</td>
              <td>
                <div className="btn-groupuser">
                  <Button variant="warning" onClick={() => handleEdit(user)}>Sửa</Button>
                  <Button variant="danger" onClick={() => handleDelete(user.id)}>Xóa</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Phân trang */}
      <Pagination>
        <Pagination.Prev
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        />
        {[...Array(totalPages).keys()].map(number => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        />
      </Pagination>

      {selectedUser && (
        <EditUser
          user={selectedUser}
          show={showEditModal}
          handleClose={handleCloseModal}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default ListUsers;
