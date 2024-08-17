import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Table, Button, Modal, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import '../styles/Dashboard.css';
import EditProduct from './UpdateProduct';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      oldPrice
      price
      brand
      thumbnail
      description
      stock
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

const ITEMS_PER_PAGE = 8; // Updated number of products per page

const ListProducts = () => {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
        deleteProduct({ variables: { id } })
          .then(() => {
            refetch();
            Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa.', 'success');
          })
          .catch((err) => {
            Swal.fire('Lỗi!', 'Không thể xóa sản phẩm.', 'error');
          });
      }
    });
  };

  const handleShowDetail = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowEditModal(false);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { minimumFractionDigits: 0 });
  };

  const totalPages = Math.ceil((data?.products?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, data?.products?.length);
  const currentProducts = data?.products.slice(startIndex, endIndex);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className='product-list'>
      <h2>Danh Sách Sản Phẩm</h2>
      <Table bordered className="product-table">
        <thead>
          <tr>
            <th>Hình Ảnh</th>
            <th>Tên Sản Phẩm</th>
            <th>Giá Gốc</th>
            <th>Giá</th>
            <th>Số Lượng</th>
            <th>Thương Hiệu</th>
            <th>Chi Tiết</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td className="text-center">
                <img 
                  src={`http://localhost:4000/uploads/${product.thumbnail}`} 
                  className="product-thumbnail"
                />
              </td>
              <td>{product.name}</td>
              <td>{formatPrice(product.oldPrice)}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.stock}</td>
              <td>{product.brand}</td>
              <td className="text-center">
                <Button 
                  variant="info" 
                  className="action-btn"
                  onClick={() => handleShowDetail(product)}
                >
                  <FontAwesomeIcon icon={faEye} size="sm" />
                </Button>
              </td>
              <td className="text-center">
                <Button variant="warning" onClick={() => handleEdit(product)}>Sửa</Button>
                <Button 
                  variant="danger" 
                  className="action-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <Pagination.Prev 
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next 
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
        />
      </Pagination>

      {selectedProduct && (
        <EditProduct
          product={selectedProduct}
          show={showEditModal}
          handleClose={handleCloseModal}
          refetch={refetch}
        />
      )}
      
      {/* Modal for Product Details */}
      {selectedProduct && (
        <Modal show={showDetail} onHide={handleCloseDetail} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chi Tiết Sản Phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body className="product-detail-body">
            <div className="product-detail-left">
              <img className="product-detail-thumbnail"
                src={`http://localhost:4000/uploads/${selectedProduct.thumbnail}`} 
              />
            </div>
            <div className="product-detail-right">
              <strong>Mô Tả:</strong> 
              <p dangerouslySetInnerHTML={{ __html: selectedProduct.description }}></p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetail}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ListProducts;
