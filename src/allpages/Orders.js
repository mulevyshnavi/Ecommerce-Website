
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8085/orders/my', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched orders:", data);

       
        const formattedOrders = data.map(order => ({
          id: order.id,
          status: order.status,
          orderDate: order.orderDate,
          shippingAddress: order.shippingAddress,
          totalAmount: order.totalAmount,
          items: order.items || []
        }));

        setOrders(formattedOrders);
      } catch (error) {
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm mb-4 px-3">
        <a className="navbar-brand fw-bold">E-Shop</a>
        <div className="navbar-nav">
          <button className="nav-link btn" onClick={() => navigate('/user-dashboard')}>
            Home
          </button>
          <button className="nav-link btn" onClick={() => navigate('/user-dashboard/products')}>
            Products
          </button>
          <button className="nav-link btn" onClick={() => navigate('/cart')}>
            Cart
          </button>
          <button className="nav-link btn active" onClick={() => navigate('/orders')}>
            Orders
          </button>
        </div>
        <button className="btn btn-outline-danger ms-auto" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <h2 className="mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">You have no orders yet.</div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-4 col-lg-3 mb-4" key={order.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="card-text">Status: {order.status}</p>
                  <p className="card-text">
                    Date: {new Date(order.orderDate).toLocaleString()}
                  </p>
                  <p className="card-text">Shipping: {order.shippingAddress}</p>
                  <p className="card-text">Total: ${order.totalAmount.toFixed(2)}</p>

                  
                  <h5>Products:</h5>
                  {order.items.length === 0 ? (
                    <p>No products in this order.</p>
                  ) : (
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          Product Name: {item.productName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;



