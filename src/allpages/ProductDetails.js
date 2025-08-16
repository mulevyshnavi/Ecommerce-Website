// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");

//     if (!token) {
//       setError("Missing auth token.");
//       return;
//     }

//     fetch(`http://localhost:8083/products/${id}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Failed to fetch product details.");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setProduct(data);
//         setError("");
//       })
//       .catch((err) => {
//         console.error("Error fetching product details:", err);
//         setError("Unable to fetch product details. Please try again.");
//       });
//   }, [id]);

//   const handleAddToCart = async () => {
//     const token = localStorage.getItem("authToken");

//     try {
//       const response = await fetch("http://localhost:8084/cart/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           productName: product.name,
//           price: product.price,
//           quantity: 1,
//         }),
//       });

//       if (response.ok) {
//         setMessage("Product added to cart!");
//       } else {
//         const errText = await response.text();
//         setMessage("Failed to add to cart: " + errText);
//       }
//     } catch (err) {
//       setMessage("Error adding to cart: " + err.message);
//     }
//   };

//   if (error) {
//     return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
//   }

//   if (!product) return <p style={{ textAlign: "center" }}>Loading product details...</p>;

//   return (
//     <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
//       <h2>{product.name}</h2>
//       <img
//         src={product.imageUrl}
//         alt={product.name}
//         style={{
//           width: "100%",
//           maxHeight: "400px",
//           objectFit: "cover",
//           borderRadius: "10px",
//         }}
//       />
//       <div style={{ marginTop: "20px" }}>
//         <p>
//           <strong>Price:</strong> ₹{product.price}
//         </p>
//         <p>
//           <strong>Description:</strong> {product.description || "No description provided."}
//         </p>
//       </div>

//       <button
//         onClick={handleAddToCart}
//         style={{
//           marginTop: "20px",
//           padding: "10px 20px",
//           backgroundColor: "#4CAF50",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Add to Cart
//       </button>

//       {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
//     </div>
//   );
// };

// export default ProductDetail;



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       setError("Missing auth token.");
//       return;
//     }

//     fetch(`http://localhost:8083/products/${id}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Failed to fetch product details.");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setProduct(data);
//         setError("");
//       })
//       .catch((err) => {
//         setError("Unable to fetch product details. Please try again.");
//       });
//   }, [id]);

//   const handleAddToCart = async () => {
//     const token = localStorage.getItem("authToken");
//     try {
//       const response = await fetch("http://localhost:8084/cart/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           productName: product.name,
//           price: product.price,
//           quantity: 1,
//         }),
//       });

//       if (response.ok) {
//         setMessage("Product added to cart!");
//       } else {
//         const errText = await response.text();
//         setMessage("Failed to add to cart: " + errText);
//       }
//     } catch (err) {
//       setMessage("Error adding to cart: " + err.message);
//     }
//   };

//   const handleBackHome = () => {
//     navigate("/user-dashboard");
//   };

//   if (error) {
//     return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
//   }

//   if (!product) return <p style={{ textAlign: "center" }}>Loading product details...</p>;

//   return (
//     <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
//       <h2>{product.name}</h2>
//       <img
//         src={product.imageUrl}
//         alt={product.name}
//         style={{
//           width: "100%",
//           maxHeight: "400px",
//           objectFit: "cover",
//           borderRadius: "10px",
//         }}
//       />
//       <div style={{ marginTop: "20px" }}>
//         <p>
//           <strong>Price:</strong> ₹{product.price}
//         </p>
//         <p>
//           <strong>Description:</strong> {product.description || "No description provided."}
//         </p>
//       </div>

//       <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
//         <button
//           onClick={handleAddToCart}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Add to Cart
//         </button>
//         <button
//           onClick={handleBackHome}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#555",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Back to Home
//         </button>
//       </div>

//       {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
//     </div>
//   );
// };

// export default ProductDetail;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Missing auth token.");
      return;
    }

    fetch(`http://localhost:8083/products/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product details.");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setError("");
      })
      .catch(() => {
        setError("Unable to fetch product details. Please try again.");
      });
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:8084/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
        }),
      });

      if (response.ok) {
        setMessage("Product added to cart!");
      } else {
        const errText = await response.text();
        setMessage("Failed to add to cart: " + errText);
      }
    } catch (err) {
      setMessage("Error adding to cart: " + err.message);
    }
  };

  const handleBackHome = () => {
    navigate("/user-dashboard");
  };

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  if (!product) return <p style={{ textAlign: "center" }}>Loading product details...</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 20px" }}>
      <div
        style={{
          display: "flex",
          maxWidth: "1000px",
          width: "100%",
          gap: "50px",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover",
              borderRadius: "10px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <h2 style={{ fontWeight: "bold", fontSize: "28px" }}>{product.name}</h2>
          <p style={{ fontSize: "20px" }}>
            <strong>Description:</strong> {product.description || "No description provided."}
          </p>
          <p style={{ fontSize: "20px" }}>
            <strong>Price:</strong> ₹{product.price}
          </p>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={handleAddToCart}
              style={{
                padding: "12px 24px",
                backgroundColor: "#4CAF50",
                color: "white",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBackHome}
              style={{
                padding: "12px 24px",
                backgroundColor: "#555",
                color: "white",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back to Home
            </button>
          </div>
          {message && <p style={{ color: "green", marginTop: "10px", fontSize: "16px" }}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
