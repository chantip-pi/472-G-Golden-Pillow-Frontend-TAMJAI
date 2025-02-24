import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AdminProfilePage.css";

function CheckDeliveryOrderPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [emsCode, setEmsCode] = useState("");
  const [orderId, setorderId] = useState(null);
  const [selectOrder, setSelectOrder] = useState(null);

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
      const order = orders.find((order) => order.order_id === orderId);
      setSelectOrder(order);
    }
  }, [orderId, orders]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  const customerPaymentOrders = orders.filter(
    (order) =>
      order.delivery_status === "yet to send" &&
      order.payment_status === "Approved"
  );

  const handleSelectOrder = (orderId) => {
    setorderId(orderId);
  };


  const handleAddDelivery = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:13889/delivered-orders`, {
        order_id: orderId,
        ems_code: emsCode,
        staff_id: userId
      });
      alert("Delivery Order has been made.");
      await axios.post(`http://localhost:13889/orders/updatedeliveryStatus`, {
        orderId: orderId,
        delivery_status: "sent the packet",
      });
      alert("Order delivery status updated to sent the packet.");
      window.location.reload();
    } catch (error) {
      console.error("Error updating delivery status status:", error);
      alert("Failed to update delivery status status.");
    }
  };


  const handleInputChange = (event) => {
    setEmsCode(event.target.value); 
  };

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
        </div>
      </div>

      {/* Orders Section */}
      <div className="orders-grid">
        {/* Customer Payment Section */}
        <div>
          <h2 className="section-title">To be Delivered</h2>
          <div className="orders-section">
            {customerPaymentOrders.map((order) => (
              <div key={order.order_id} className="order-card">
                <p>Order ID: {order.order_id}</p>
                <p>Username: {order.username}</p>
                <p>Total Price: ${order.total_price}</p>
                <p>
                  Purchased Date:{" "}
                  {new Date(order.order_date).toLocaleDateString()}
                </p>
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
                  <span className="detail-infolabel">Order's EMS</span>
                  <div className="input-group">
                  <form onSubmit={handleAddDelivery} className="ems-form">
                    <input
                      type="text"
                      name="ems_code"
                      placeholder="Enter EMS code"
                      required
                      value={emsCode} 
                      onChange={handleInputChange}
                    />
                    <button className="see-slip-button" type="submit">
                      Confirm
                    </button>
                  </form>
                  </div>
                </div>
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

export default CheckDeliveryOrderPage;
