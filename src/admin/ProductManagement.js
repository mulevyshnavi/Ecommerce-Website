import React from "react";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <button 
        className="btn btn-secondary mb-3" 
        onClick={() => navigate("/admin")}
      >
        Back to Dashboard
      </button>
      
      <h2 className="text-center mb-4">Product Management</h2>
      
      <div className="row justify-content-center">
     
       
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Add New Product</h5>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate("/admin/products/add")}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>

       
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Update Product</h5>
              <button 
                className="btn btn-warning" 
                onClick={() => navigate("/admin/products/update")}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
       

        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Get All Products</h5>
              <button 
                className="btn btn-warning" 
                onClick={() => navigate("/admin/products/getall")}
              >
              Get All Products
              </button>
            </div>
          </div>
        </div>

       
       
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Delete Product</h5>
              <button 
                className="btn btn-danger" 
                onClick={() => navigate("/admin/products/delete")}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
