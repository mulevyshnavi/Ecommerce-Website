import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './allpages/Login';
import Register from './allpages/Register';
import UserDashboard from './allpages/UserDashboard';
import AdminDashboard from './allpages/AdminDashboard';
import ProtectedRoute from './allpages/ProtectedRoute';
import ProductDetails from './allpages/ProductDetails';
import Cart from './allpages/Cart';
import Orders from './allpages/Orders';
import ProductManagement from './admin/ProductManagement';

import OrderManagement from './admin/OrderManagement';
import AddProduct from './admin/AddProduct';
import UpdateProduct from './admin/UpdateProduct';
import GetAllProducts from './admin/GetAllProducts';
import DeleteProduct from './admin/DeleteProduct';


const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

      
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product-details/:id" 
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <ProductDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <Orders />
            </ProtectedRoute>
          } 
        />

      
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <ProductManagement />
            </ProtectedRoute>
          } 
        />
     
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <OrderManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/add" 
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AddProduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/update" 
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <UpdateProduct />
            </ProtectedRoute>
          } 
        />
      
        <Route 
          path="/admin/products/getall" 
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <GetAllProducts />
            </ProtectedRoute>
          } 
        />

<Route 
          path="/admin/products/delete" 
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <DeleteProduct />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </Router>
  );
};

export default App;