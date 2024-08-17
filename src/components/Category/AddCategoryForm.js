import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import '../styles/formUser.css'; // Add custom styles if needed

const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $description: String) {
    createCategory(name: $name, description: $description) {
      id
      name
    }
  }
`;

const AddCategoryForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [addCategory, { loading, error }] = useMutation(ADD_CATEGORY, {
        onCompleted: () => {
            Swal.fire({
                icon: 'success',
                title: 'Thêm danh mục thành công!',
                showConfirmButton: false,
                timer: 2000
            });
            setName('');
            setDescription('');
            // Close the modal or redirect as needed
            window.location.reload(); // Refresh the page
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Thêm danh mục thất bại',
                text: error.message
            });
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCategory({
                variables: { name, description }
            });
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <form onSubmit={handleSubmit} className="add-user-form">
            <input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            {/* <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            /> */}
            <button type="submit" className="btn btn-success">Add Category</button>
        </form>
    );
};

export default AddCategoryForm;
