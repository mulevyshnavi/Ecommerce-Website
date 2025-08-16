import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8085/orders/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            setError('Only ADMIN can view all orders');
          } else {
            throw new Error('Failed to fetch orders');
          }
          return;
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setError('');
      const token = localStorage.getItem('authToken');
      
      
      const response = await fetch(
        `http://localhost:8085/orders/update/${orderId}?status=${encodeURIComponent(newStatus)}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

     
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mt-4">
      <button 
        className="btn btn-secondary mb-3" 
        onClick={() => navigate('/admin-dashboard')}
      >
        Back to Dashboard
      </button>

      <h2 className="text-center mb-4">Order Management</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Username</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.username}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>
                    <ul className="list-unstyled">
                      {order.items.map(item => (
                        <li key={item.id}>
                          {item.productName} (Qty: {item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'PENDING' ? 'bg-warning' :
                      order.status === 'DISPATCHED' ? 'bg-info' :
                      order.status === 'DELIVERED' ? 'bg-success' : 
                      order.status === 'CANCELLED' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className={`form-select ${updatingId === order.id ? 'disabled' : ''}`}
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="DISPATCHED">Dispatched</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    {updatingId === order.id && (
                      <div className="spinner-border spinner-border-sm ms-2" role="status">
                        <span className="visually-hidden">Updating...</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
