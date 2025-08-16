import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8083/products', {
          headers: { 'Authorization': token },
        });

        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.map(product => ({
          ...product,
          id: product.id || product._id
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <button 
        className="btn btn-secondary mb-3" 
        onClick={() => navigate('/admin/products')}
      >
        Back to Product Management
      </button>

      <h2 className="text-center mb-4">All Products</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}

      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="text-muted">Price: ${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllProducts;
