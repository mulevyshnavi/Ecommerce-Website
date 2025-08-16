import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
     
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

     
      <h2 className="text-center mb-4">Welcome Admin!</h2>
      <p className="text-center mb-5">Manage your store using the options below.</p>

      
      <div className="row justify-content-center">
        
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Click here to see Products</h5>
              <button className="btn btn-primary" onClick={() => navigate("/admin/products")}>
                Product Management
              </button>
            </div>
          </div>
        </div>

        

        {/* Orders Card */}
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Click here to see Orders</h5>
              <button className="btn btn-warning" onClick={() => navigate("/admin/orders")}>
                Order Management
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



