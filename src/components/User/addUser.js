// src/components/User/AddUserForm.js
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import '../styles/formUser.css'; // Add custom styles if needed

const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!, $phone: String!, $address: String!, $username: String!, $password: String!) {
    createUser(name: $name, email: $email, phone: $phone, address: $address, username: $username, password: $password, created_by: "default_creator") {
      id
      name
    }
  }
`;

const AddUserForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [addUser, { loading, error }] = useMutation(ADD_USER, {
        onCompleted: () => {
            Swal.fire({
                icon: 'success',
                title: 'Thêm tác giả thành công!',
                showConfirmButton: false,
                timer: 2000
            });
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setUsername('');
            setPassword('');
            // Redirect back to the user management page and refresh
            window.location.href = '../UserManagement.js';
            window.location.reload();
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Thêm tác giả thất bại',
                text: error.message
            });
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addUser({
                variables: { name, email, phone, address, username, password }
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
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="new-username" 
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password" 
            />
            <button type="submit" className="btn btn-success">Add User</button>
        </form>
    );
};

export default AddUserForm;
