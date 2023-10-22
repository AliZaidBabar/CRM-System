import React from 'react';
import axios from 'axios';

function DeleteProduct({ productId, onDelete }) {
    const handleDelete = async () => {
        try {
            // await axios.delete(`http://localhost:8081/delete-product/${productId}`);
            
            const token = localStorage.getItem('token'); // Get the token from local storage or state
            axios.delete(`http://localhost:8081/delete-product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })


            onDelete(productId);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="delete-product">
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default DeleteProduct;
