import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';


function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div className="product-list">
            <h2>Product List</h2>
            <div className="gallery-container">
                {products.map(product => (
                    <div className='gallery-item' key={product._id}>
                        {product.image && (
                            <img className="product-image" src={`data:image/jpeg/jpg/png;base64,${product.image}`} alt={product.name} />
                        )}
                        <p className="product-name"><b>Name: </b>{product.name}</p>
                        <p className="product-description"><b>Description: </b>{product.description}</p>
                        <p className="product-price"><b>Price: </b>${product.price}</p>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default ProductList;
