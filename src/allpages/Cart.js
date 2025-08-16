import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem('authToken'); 
    
    if (!token) {
      setErrorMsg('Please login to view your cart');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:8084/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch cart');
      }

      const data = await res.json();
      setCartItems(data);
      calculateTotal(data);
    } catch (err) {
      console.error('Cart fetch error:', err);
      setErrorMsg(err.message || 'Error loading cart');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    setGrandTotal(total);
  };

  const updateQuantity = async (id, quantity) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8084/cart/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) throw new Error('Update failed');
      fetchCart();
    } catch (err) {
      setErrorMsg('Failed to update quantity');
    }
  };

  const deleteItem = async (id) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8084/cart/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Delete failed');
      fetchCart();
    } catch (err) {
      setErrorMsg('Failed to remove item');
    }
  };

  const placeOrder = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const shippingAddress = prompt("Enter shipping address:");
    if (!shippingAddress) return;

    try {
      const res = await fetch('http://localhost:8085/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress, cartItems }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Order failed');
      }

      alert('Order placed successfully!');
      setCartItems([]);
      setGrandTotal(0);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-5">Loading cart...</div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/user-dashboard')}
        >
          ← Back to Home
        </button>
        <h2 className="text-center flex-grow-1">Your Cart</h2>
        <div style={{ width: '120px' }}></div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger text-center">
          {errorMsg}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-success">
            <tr>
              <th>Item</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.productName}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      style={{ width: '70px' }}
                      value={item.quantity}
                      onChange={(e) => 
                        updateQuantity(item.productId, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => deleteItem(item.productId)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Your cart is empty
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {cartItems.length > 0 && (
        <div className="text-end mt-3">
          <h4>Total: ₹{grandTotal.toFixed(2)}</h4>
          <button
            onClick={placeOrder}
            className="btn btn-success btn-lg"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
