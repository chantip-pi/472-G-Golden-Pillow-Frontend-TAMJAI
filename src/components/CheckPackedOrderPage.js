import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AdminProfilePage.css";

function CheckPackedOrderPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [selectOrder, setSelectOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [packedStatus, setPackedStatus] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:13889/user/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("User not found. Please log in again.");
        navigate("/login");
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:13889/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchUserData();
    fetchOrders();
  }, [userId, navigate]);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:13889/order/detail/${orderId}`
          );
          setOrderDetails(response.data);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };
      fetchOrderDetails();

      const order = orders.find((order) => order.order_id === orderId);
      setSelectOrder(order);
    }

    const fetchAllProducts = async () => {
      try {
        const response = await fetch("http://localhost:13889/allproductslist");
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllProducts();
  }, [orderId, orders]);

  const toBePreparedOrders = orders.filter(
    (order) =>
      order.payment_status === "Approved" &&
      order.packed_status === "not packed yet"
  );

  const handleSelectOrder = (orderId) => {
    setOrderId(orderId);
  };

  const handlePackedstatusOrder = async () => {
    try {
      await axios.post(`http://localhost:13889/orders/updatePackedStatus`, {
        orderId,
        packed_status: "packed",
      });
      alert("Order delivery status updated to 'packed.'");
      // Refresh the orders list or update state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, packed_status: "packed" }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Error updating packed_status:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to update packed_status.");
    }
  };

  const findProductDetails = (lotId, grade) => {
    const product = allProducts.find(
      (product) => product.lot_id === lotId && product.grade === grade
    );
    return product || null;
  };

  const togglePackedStatus = (index) => {
    setPackedStatus((prevStatus) => {
      const newStatus = { ...prevStatus };
      newStatus[index] = !newStatus[index]; // Toggle the packed status for the product
      return newStatus;
    });
  };

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="admin-container">
      {/* Profile Section */}
      <div className="profile-container">
        <div className="profile-section">
          <h2 className="section-title">User Details</h2>
          <div className="info">
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Name:</strong> {userData.name}
            </p>
            <p>
              <strong>Last Name:</strong> {userData.lastname}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone:</strong> {userData.phone_number}
            </p>
            <p>
              <strong>Address:</strong> {userData.address}
            </p>
            <p>
              <strong>Road:</strong> {userData.name_road}
            </p>
            <p>
              <strong>District:</strong> {userData.district}
            </p>
            <p>
              <strong>Province:</strong> {userData.province}
            </p>
            <p>
              <strong>Postal Code:</strong> {userData.postal_code}
            </p>
          </div>

          <div className="action-buttons">
            <button className="edit-details">Edit your details</button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="orders-grid">
        {/* To be Prepared Section */}
        <div>
          <h2 className="section-title">To be Prepared</h2>
          <div className="orders-section">
            {toBePreparedOrders.map((order) => (
              <div key={order.order_id} className="order-card">
                <p>Username: {order.username}</p>
                <p>Order ID: {order.order_id}</p>
                <p>Total Price: ${order.total_price}</p>
                <button onClick={() => handleSelectOrder(order.order_id)}>
                  Check
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectOrder && (
          <div className="ordercontent-container">
            <div className="orderdetails">
              <p>
                <strong>Order ID:</strong> {selectOrder.order_id}
              </p>
              <p>
                <strong>User ID:</strong> {selectOrder.user_id}
              </p>
              <p>
                <strong>Purchased Date:</strong>{" "}
                {new Date(selectOrder.order_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Address:</strong> {selectOrder.address}
              </p>

              <div className="status-buttons">
                <div className="detail-inforow">
                  <span className="detail-infolabel">
                    Packed status: <p> !!{selectOrder.packed_status}!!</p>
                  </span>
                  <button
                    className="Packedstatus-button"
                    onClick={handlePackedstatusOrder}
                  >
                    All Packed
                  </button>
                </div>
              </div>

              <div className="product-listad">
              {orderDetails &&
              orderDetails.orderLines &&
              orderDetails.orderLines.length > 0 ? (
                orderDetails.orderLines.map((product, index) => {
                  const productDetails = findProductDetails(
                    product.lotId,
                    product.grade
                  );

                  return (
                    <div key={index} className="product-card">
                      {productDetails ? (
                        <>
                          <img
                            src={`http://localhost:13889${productDetails.image_path}`}
                            alt="Product"
                            className="product-image"
                          />
                          <div className="product-infoad">
                            <p>Product Lot: {productDetails.lot_id}</p>
                            <p>Grade: {productDetails.grade}</p>
                            <p>
                              Price each one: {productDetails.sale_price} Baht
                            </p>
                            <p>Amount: {product.amount}</p>
                          </div>
                        </>
                      ) : (
                        <p>Product details not available.</p>
                      )}
                      <button
                        className={`packed-label ${
                          packedStatus[index] ? "pack-green" : "packed-red"
                        }`}
                        onClick={() => togglePackedStatus(index)}
                      >
                        Pack
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>No products in this order.</p>
              )}
            </div>
            
            </div>
          </div>
        )}
      </div>

      <button className="logout-button" onClick={() => navigate("/login")}>
        Log out
      </button>
    </div>
  );
}

export default CheckPackedOrderPage;
