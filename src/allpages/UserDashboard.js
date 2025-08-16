import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8083/products', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleViewDetails = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'cart') navigate('/cart');
    if (tab === 'orders') navigate('/orders');
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
     
      {activeTab === 'home' && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm mb-4 px-3">
          <div className="d-flex align-items-center">
            <img
              src="https://www.nexteducation.in/assets/images/NE-Logo.png"
              alt="NextEdu Logo"
              style={{ height: '40px', marginRight: '15px' }}
            />
            <span className="fw-bold fs-5">NextEdu Mart</span>
          </div>
          <div className="ms-auto d-flex gap-3">
            <button className="btn nav-link text-primary fw-bold" onClick={() => setActiveTab('home')}>
              Home
            </button>
            <button className="btn nav-link" onClick={() => setActiveTab('products')}>
              Products
            </button>
            <button className="btn nav-link" onClick={() => handleTabClick('cart')}>
              Cart
            </button>
            <button className="btn nav-link" onClick={() => handleTabClick('orders')}>
              Orders
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      )}

     
      {activeTab === 'home' && (
        <>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Welcome to NextEdu Mart</h2>
            <p className="text-muted fs-5">Where Learning Begins</p>
            <p className="text-muted">Equipping Classrooms. Empowering Futures.</p>
          </div>

          <div className="mb-4">
            <img
              src="https://image.benq.com/is/image/benqco/education-image-02-1?$ResponsivePreset$"
              alt="Education Banner"
              style={{
                width: '100%',
                height: '350px',
                objectFit: 'cover',
                objectPosition: 'center 30%',
                borderRadius: '10px',
              }}
            />
          </div>

          <h2 className="mb-4">Available Products</h2>
        </>
      )}

     
      {(activeTab === 'home' || activeTab === 'products') && (
        <>
          {activeTab === 'products' && <h2 className="mb-4">All Products</h2>}
          {products.length === 0 ? (
            <div className="alert alert-info">No products available at the moment.</div>
          ) : (
            <div className="row">
              {products.map((product) => (
                <div className="col-md-4 col-lg-3 mb-4" key={product.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300';
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">${product.price.toFixed(2)}</p>
                      <button
                        className="btn btn-primary mt-auto"
                        onClick={() => handleViewDetails(product.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;
