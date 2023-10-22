import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';
import CountUp from 'react-countup';
import UserProductsInAdmin from './userproductinadmin';

const AdminDashboard = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Store the selected user

    useEffect(() => {
        // Fetch data for the admin dashboard
        axios.get('http://localhost:8081/admin/dashboard', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                setTotalProducts(response.data.totalProducts);
                setTotalUsers(response.data.totalUsers);
            })
            .catch(error => {
                console.error('Error fetching admin dashboard data:', error);
            });
    }, []);

    // Fetch the list of users
    useEffect(() => {
        axios.get('http://localhost:8081/admin/users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                setUsersList(response.data);
            })
            .catch(error => {
                console.error('Error fetching users list:', error);
            });
    }, []);

    const handleViewProducts = user => {
        setSelectedUser(user); // Set the selected user
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="dashboard-circle">
                <CountUp start={0} end={totalProducts} duration={2} separator="," />
                <p>Total Products</p>
            </div>
            <div className="dashboard-circle">
                <CountUp start={0} end={totalUsers} duration={2} separator="," />
                <p>Total Users</p>
            </div>

            <div className="users-list">
                <h3>Users List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Profile Pic</th>
                            <th>Role</th>
                            <th>Address</th>
                            <th>Product Upload</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.pic && (
                                        <img
                                            src={`data:image/jpeg;base64,${user.pic}`}
                                            alt="User Pic"
                                            width="100"
                                            height="auto"
                                        />
                                    )}
                                </td>
                                <td>{user.role}</td>
                                <td>{user.address}</td>
                                <td>{user.products ? user.products.length : 0}</td>
                                <td>
                                    <button onClick={() => handleViewProducts(user)}>
                                        View Products
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && <UserProductsInAdmin user={selectedUser} />}
        </div>
    );
};

export default AdminDashboard;
