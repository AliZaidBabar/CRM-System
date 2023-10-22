import React, { useState } from 'react';
import axios from 'axios';

function AddProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    console.log('Adding product...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      console.log('Sending product data...');

      await axios.post('http://localhost:8081/add-product', formData, { headers });

      console.log('Product added successfully');
    } catch (error) {
      console.log('Error adding product:', error);
    }
  };

  return (
    <div className='add-product-container'>
      <h2 className='form-heading'>Add a New Product</h2>
      <form className='product-form' onSubmit={handleAddProduct}>
        <label className='form-label'>Name:</label>
        <input
        placeholder='enter name ...'
          className='form-input'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br />
        <label className='form-label'>Description:</label>
        <textarea
                placeholder='enter description...'

          className='form-textarea'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br />
        <label className='form-label'>Price:</label>
        <input
                placeholder='enter price ...'

          className='form-input'
          type='number'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        /><br />
        <label className='form-label'>Image:</label>
        <input className='form-input' type='file' onChange={handleImageChange} /><br />
        <button className='form-button' type='submit'>Add Product</button>
      </form>
    </div>
  );
}

export default AddProductForm;
