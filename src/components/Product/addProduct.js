import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../styles/formProduct.css';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!,
    $price: Int!,
    $oldPrice: Int!,
    $thumbnail: String!,
    $description: String!,
    $stock: Int!,
    $category: ID!,
    $brand: String!,
    $created_by: String!
  ) {
    createProduct(
      name: $name,
      price: $price,
      oldPrice: $oldPrice,
      thumbnail: $thumbnail,
      description: $description,
      stock: $stock,
      category: $category,
      brand: $brand,
      created_by: $created_by
    ) {
      id
      name
    }
  }
`;

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [file, setFile] = useState(null);

  const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(GET_CATEGORIES);

  const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT, {
    onCompleted: () => {
      Swal.fire({
        icon: 'success',
        title: 'Thêm sản phẩm thành công!',
        showConfirmButton: false,
        timer: 2000
      });
      resetForm();
      window.location.href = '/ProductManagement'; // Điều chỉnh URL nếu cần
      window.location.reload();
    },
    onError: (error) => {
      console.error('GraphQL Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Thêm sản phẩm thất bại',
        text: error.message
      });
    },
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'Vui lòng chọn một ảnh',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { fileUrl } = uploadResponse.data;

      await addProduct({
        variables: {
          name,
          price: parseInt(price),
          oldPrice: parseInt(oldPrice),
          thumbnail: fileUrl,
          description,
          stock: parseInt(stock),
          category,
          brand,
          created_by: 'default_creator'
        }
      });
    } catch (err) {
      console.error('File Upload Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi khi tải lên ảnh',
        text: err.message
      });
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setOldPrice('');
    setThumbnail('');
    setDescription('');
    setStock('');
    setCategory('');
    setBrand('');
    setFile(null);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (categoriesLoading) return <p>Loading categories...</p>;
  if (categoriesError) return <p>Error loading categories: {categoriesError.message}</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Giá gốc"
        value={oldPrice}
        onChange={(e) => setOldPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Giá bán"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={handleFileChange}
        required
      />
      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows="4"
      />
      <input
        type="number"
        placeholder="Số lượng"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />
      <div className="category-selection">
        <p>Danh mục:</p>
        <select 
          value={category} 
          onChange={handleCategoryChange} 
          required
          className="category-dropdown"
        >
          <option value="" disabled>Chọn danh mục</option>
          {categoriesData.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        placeholder="Thương hiệu"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-success">Add Product</button>
    </form>
  );
};

export default AddProductForm;
