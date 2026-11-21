import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';
import './AddProduct.css';

// Available product categories
const CATEGORIES = [
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Watches',
  'Cufflinks',
];

// Check the form values and return an object of error messages
export function validate({ name, description, category, price, stock }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!description.trim()) errors.description = 'Description is required';
  if (!category) errors.category = 'Category is required';
  if (price === '') errors.price = 'Price is required';
  else if (Number(price) <= 0) errors.price = 'Price must be a number greater than 0';
  if (stock === '') errors.stock = 'Stock is required';
  else if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
    errors.stock = 'Stock must be a whole number, 0 or more';
  return errors;
}

export default function AddProduct({ onAdd, onCancel }) {
  // Manage each product input value using React state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();

  function resetForm() {
    setName('');
    setDescription('');
    setCategory('');
    setMaterial('');
    setPrice('');
    setStock('');
    setImage('');
  }

  function handleCancel() {
    resetForm();
    onCancel?.();
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    const validationErrors = validate({ name, description, category, price, stock });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const newProduct = {
      name,
      description,
      category,
      material,
      price: Number(price),
      stock: Number(stock),
      image,
    };

    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add product');
        return res.json();
      })
      .then((data) => {
        onAdd?.(data);
        resetForm();
        navigate('/products');
      })
      .catch((error) => {
        console.error('Error adding product:', error);
        setSubmitError('Could not add the product. Please try again.');
      });
  }

  return (
    <div className="add-product-page">
      <div className="add-product-wrapper">
        <div className="add-product-header">
          <h2>Add Product</h2>
          <p className="add-product-subtitle">Add a new item to the store catalog.</p>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p role="alert" className="error-text">{errors.name}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p role="alert" className="error-text">{errors.description}</p>
            )}
          </div>

          <div className="form-row-two">
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p role="alert" className="error-text">{errors.category}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="material">Material</label>
              <input
                id="material"
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && <p role="alert" className="error-text">{errors.price}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              {errors.stock && <p role="alert" className="error-text">{errors.stock}</p>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="image">Image</label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {submitError && <p role="alert" className="submit-error">{submitError}</p>}

          <div className="add-product-actions">
            <button type="submit" className="btn-submit">
              Add Product
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}