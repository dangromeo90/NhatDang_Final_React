import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Table, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../styles/Dashboard.css';
import '../styles/formUser.css';

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      user {
        id
        name
      }
      products {
        product {
          id
          name
        }
        quantity
      }
      totalAmount
      status
      created_at
      updated_at
    }
  }
`;

const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      id
    }
  }
`;

const ListOrders = () => {
  const { loading, error, data, refetch } = useQuery(GET_ORDERS);
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Xóa đơn hàng thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      refetch();
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Xóa đơn hàng thất bại',
        text: error.message
      });
    }
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Tính toán số trang
  const totalOrders = data.orders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // Xác định các đơn hàng để hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = data.orders.slice(startIndex, endIndex);

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
        deleteOrder({ variables: { id } });
      }
    });
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowEditModal(false);
  };

  return (
    <div className="management">
      <h2>Danh sách đơn hàng</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Tổng số tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order.id}>
              <td>{order.user.name}</td>
              <td>{order.products.map(p => p.product.name).join(', ')}</td>
              <td>{order.products.map(p => p.quantity).join(', ')}</td>
              <td>{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>{order.created_at}</td>
              <td>{order.updated_at}</td>
              <td>
                <div className="btn-grouporder">
                  {/* <Button variant="warning" onClick={() => handleEdit(order)}>Sửa</Button> */}
                  <Button variant="danger" onClick={() => handleDelete(order.id)}>Xóa</Button>
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

      {/* {selectedOrder && (
        <EditOrder
          order={selectedOrder}
          show={showEditModal}
          handleClose={handleCloseModal}
          refetch={refetch}
        />
      )} */}
    </div>
  );
};

export default ListOrders;
