import React, { useState } from 'react';
import axios from 'axios';

function UpdateProduct({ product, onUpdate }) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [image, setImage] = useState(null); // State to store the selected image

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage or state

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            if (image) {
                formData.append('image', image); // Append the image to the form data
            }

            const response = await axios.put(
                `http://localhost:8081/update-product/${product._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', // Set content type for form data
                    },
                }
            );
            onUpdate(response.data);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="update-product">
            <h3>Update Product</h3>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                className="input-field"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product Description"
                className="input-field"
            />
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Product Price"
                className="input-field"
            />
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="file-input"
            />
            <button onClick={handleUpdate} className="update-button">Update</button>
        </div>
    );
}

export default UpdateProduct;
