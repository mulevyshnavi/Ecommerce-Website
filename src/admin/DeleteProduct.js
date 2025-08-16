import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8083/products", {
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedProducts = data.map(product => ({
            ...product,
            id: product.id || product._id
          }));
          setProducts(formattedProducts);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

 
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

 
  const handleDelete = async () => {
    if (!selectedProduct) {
      setError("Please select a product to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${selectedProduct.name}"?`)) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8083/products/${selectedProduct.id}`, 
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        setSuccess(`Product "${selectedProduct.name}" deleted successfully!`);
     
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setSelectedProduct(null);
        setTimeout(() => setSuccess(""), 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error during deletion:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <button 
        className="btn btn-secondary mb-3" 
        onClick={() => navigate("/admin/products")}
      >
        Back to Product Management
      </button>

      <div className="card p-4">
        <h2 className="text-center mb-4">Delete Product</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            
            <div className="mb-4">
              <h4>Select a Product to Delete</h4>
              <div className="list-group">
                {products.map(product => (
                  <button
                    key={product.id}
                    className={`list-group-item list-group-item-action ${
                      selectedProduct?.id === product.id ? "active" : ""
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    {product.name} - ${product.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete Confirmation */}
            {selectedProduct && (
              <div className="mt-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Confirm Deletion</h5>
                    <p className="card-text">
                      You are about to delete: <strong>{selectedProduct.name}</strong>
                    </p>
                    <p className="text-muted">Price: ${selectedProduct.price}</p>
                    {selectedProduct.imageUrl && (
                      <img 
                        src={selectedProduct.imageUrl} 
                        alt={selectedProduct.name}
                        className="img-fluid mb-3"
                        style={{ maxHeight: '200px' }}
                      />
                    )}
                    <button 
                      onClick={handleDelete}
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteProduct;
