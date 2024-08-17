import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation, gql, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import axios from 'axios'; // Import axios
import '../styles/formProduct.css'

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $price: Int
    $oldPrice: Int
    $thumbnail: String
    $description: String
    $stock: Int
    $category: ID
    $brand: String
    $updated_by: String
  ) {
    updateProduct(
      id: $id
      name: $name
      price: $price
      oldPrice: $oldPrice
      thumbnail: $thumbnail
      description: $description
      stock: $stock
      category: $category
      brand: $brand
      updated_by: $updated_by
    ) {
      id
      name
      price
      oldPrice
      thumbnail
      description
      stock
      brand
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const EditProductModal = ({ product, show, handleClose, refetch }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    thumbnail: '',
    description: '',
    stock: '',
    category: '', // Thêm trường category
    brand: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        thumbnail: product.thumbnail || '',
        description: product.description || '',
        stock: product.stock || '',
        category: product.category || '', // Đảm bảo giá trị category được cập nhật
        brand: product.brand || ''
      });
    }
  }, [product]);

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onError: (error) => {
      console.error('Error updating product:', error.message);
    },
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật sản phẩm thành công!',
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

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let thumbnailUrl = formData.thumbnail;
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('file', imageFile);

      try {
        const response = await axios.post('http://localhost:4000/upload', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        thumbnailUrl = response.data.fileUrl; // Sửa tên trường nếu cần
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    updateProduct({
      variables: {
        id: product.id,
        name: formData.name,
        price: parseInt(formData.price, 10),
        oldPrice: formData.oldPrice ? parseInt(formData.oldPrice, 10) : null,
        thumbnail: thumbnailUrl,
        description: formData.description,
        stock: formData.stock ? parseInt(formData.stock, 10) : null,
        category: formData.category || null, // Đảm bảo giá trị category không phải là undefined
        brand: formData.brand,
        updated_by: 'default_updater' // Sử dụng tên người cập nhật nếu cần
      }
    });
  };

  if (categoryLoading) return <p>Loading categories...</p>;
  if (categoryError) return <p>Error loading categories: {categoryError.message}</p>;

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-xl" className='formProduct'>
      <Modal.Header closeButton>
        <Modal.Title>Sửa Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="add-product-form">
          <Form.Group controlId="formName">
            <Form.Label>Tên sản phẩm</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="formOldPrice">
            <Form.Label>Giá Gốc</Form.Label>
            <Form.Control 
              type="number" 
              step="100000" 
              name="oldPrice" 
              value={formData.oldPrice} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Giá bán</Form.Label>
            <Form.Control 
              type="number" 
              step="100000" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="formThumbnail">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control 
              type="file" 
              name="thumbnail" 
              onChange={handleFileChange} 
            />
            <Form.Text className="text-muted">
              Chọn ảnh mới để cập nhật, nếu không muốn thay đổi ảnh thì để trống.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group controlId="formStock">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group controlId="formCategory">
            <Form.Label>Danh mục</Form.Label>
            <Form.Control 
              as="select" 
              name="category" 
              value={formData.category || ''} // Đảm bảo giá trị là chuỗi rỗng nếu không có danh mục
              onChange={handleChange}
            >
              <option value="" disabled>Chọn danh mục</option> {/* Placeholder */}
              {categoryData.categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formBrand">
            <Form.Label>Thương hiệu</Form.Label>
            <Form.Control 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
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

export default EditProductModal;
