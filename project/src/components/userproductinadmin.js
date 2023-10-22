import React from 'react';

const UserProductsInAdmin = ({ user }) => {
    if (!user.products) {
        return <p>Loading...</p>; // Display a loading indicator if products are not available
    }

    return (
        <div>
            <h2>{user.email}'s Products</h2>
            <div>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Content:</strong> {user.content}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {user.products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>
                                {product.image && (
                                    <img
                                        src={`data:image/jpeg;base64,${product.image}`}
                                        alt={product.name}
                                        style={{ maxWidth: '100px' }}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserProductsInAdmin;
