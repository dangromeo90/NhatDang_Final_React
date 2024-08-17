import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Table, Button, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../styles/Dashboard.css';
import EditCategoryModal from './EditCategoryModal'; // Import EditCategoryModal component
import '../styles/formUser.css';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`;

const ListCategories = () => {
  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Xóa danh mục thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      refetch();
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Xóa danh mục thất bại',
        text: error.message
      });
    }
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Tính toán số trang
  const totalCategories = data.categories.length;
  const totalPages = Math.ceil(totalCategories / itemsPerPage);

  // Xác định các danh mục để hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = data.categories.slice(startIndex, endIndex);

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
        deleteCategory({ variables: { id } });
      }
    });
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setShowEditModal(false);
  };

  return (
    <div className="management">
      <h3>Danh sách danh mục</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th> {/* Added for action buttons */}
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((category, index) => (
            <tr key={category.id}>
              <td>{startIndex + index + 1}</td>
              <td>{category.name}</td>
              <td>
                <div className="btn-groupuser">
                  <Button variant="warning" onClick={() => handleEdit(category)}>Sửa</Button>
                  <Button variant="danger" onClick={() => handleDelete(category.id)}>Xóa</Button>
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

      {selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          show={showEditModal}
          handleClose={handleCloseModal}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default ListCategories;
