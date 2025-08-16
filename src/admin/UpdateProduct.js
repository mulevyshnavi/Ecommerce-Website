import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: ""
  });
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
    setUpdatedProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl
    });
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProduct) {
      setError("Please select a product to update");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      
     
      const updatePayload = {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        imageUrl: updatedProduct.imageUrl
      };

      const response = await fetch(
        `http://localhost:8083/products/${selectedProduct.id}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Product "${data.name}" updated successfully!`);
        
        
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? { ...p, ...data } : p
        ));
        
       
        setTimeout(() => {
          setSelectedProduct(null);
          setUpdatedProduct({
            name: "",
            description: "",
            price: 0,
            imageUrl: ""
          });
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error during update:", err);
      setError("Network error. Please try again.");
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
        <h2 className="text-center mb-4">Update Product</h2>
        
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
              <h4>Select a Product to Update</h4>
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

           
            {selectedProduct && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={updatedProduct.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    name="description"
                    value={updatedProduct.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    name="price"
                    value={updatedProduct.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="imageUrl"
                    value={updatedProduct.imageUrl}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-warning">
                    Update Product
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
