import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import DeleteProduct from './deleate-product';
import UpdateProduct from './update-product';

function UserProducts() {
    const [products, setProducts] = useState([]);
    const [userEmail, setEmail] = useState([]);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        setEmail(userEmail);
        if (userEmail) {
            axios.get(`http://localhost:8081/user-products/${userEmail}`)
                .then(response => {
                    const products = response.data;
                    setProducts(products);
                })
                .catch(error => {
                    console.error('Error fetching user products:', error);
                });
        }
    }, []);

    const handleUpdate = (updatedProduct) => {
        const updatedProducts = products.map(product =>
            product._id === updatedProduct._id ? updatedProduct : product
        );
        setProducts(updatedProducts);
    };

    const handleDelete = (deletedProductId) => {
        const remainingProducts = products.filter(product =>
            product._id !== deletedProductId
        );
        setProducts(remainingProducts);
    };

    const handleUpdateCard = (productId) => {
        const updatedProducts = products.map(product =>
            product._id === productId ? { ...product, isActive: !product.isActive } : product
        );
        setProducts(updatedProducts);
    };

    return (
        <div className="product-list">
            <h2>Your Product List</h2>
            <div className="gallery-container">
                {products.map(product => (
                    <div className={`product-card ${product.isActive ? 'active' : ''}`} key={product._id}>
                        <div className="card-content">
                            <div className="front-content">
                                <div className="product-image-container">
                                    {product.image && (
                                        <img className="product-image" src={`data:image/jpeg/jpg/png;base64,${product.image}`} alt={product.name} />
                                    )}
                                </div>
                                <p className="product-name"><b>Name: </b>{product.name}</p>
                                <p className="product-description"><b>Description: </b>{product.description}</p>
                                <p className="product-price"><b>Price: </b>${product.price}</p>

                                <div className='flex'>
                                    <button onClick={() => handleUpdateCard(product._id)}>Update</button>
                                    <DeleteProduct productId={product._id} onDelete={handleDelete} />
                                </div>
                                    


                            </div>
                            <div className="back-content">
                                <UpdateProduct product={product} onUpdate={handleUpdate} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProducts;
