import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AdminProfilePage.css';

function AdminProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:13889/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('User not found. Please log in again.');
        navigate('/login');
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:13889/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchUserData();
    fetchOrders();
  }, [userId, navigate]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  // Filter orders for each section
  const customerPaymentOrders = orders.filter(order => order.payment_status === 'Yet to check');
  const toBePreparedOrders = orders.filter(order => order.packed_status === 'not packed yet');
  const toBeDeliveredOrders = orders.filter(order => order.delivery_status === 'yet to send');

  return (
    <div className="admin-container">
      {/* Profile Section */}
      <div className="profile-container">
        <div className="profile-section">
          <h2 className="section-title">User Details</h2>
          <div className="info">
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Last Name:</strong> {userData.lastname}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone_number}</p>
            <p><strong>Address:</strong> {userData.address}</p>
            <p><strong>Road:</strong> {userData.name_road}</p>
            <p><strong>District:</strong> {userData.district}</p>
            <p><strong>Province:</strong> {userData.province}</p>
            <p><strong>Postal Code:</strong> {userData.postal_code}</p>
          </div>

          <div className="action-buttons">
            <button className="edit-details">Edit your details</button>
            <button>Add Coupon</button>
            <button onClick={() => navigate('/OrderHistory')}>Orders history</button>
            <button onClick={() => navigate('/RegisterProduct')}>Register Products</button>
            <button onClick={() => navigate('/ProductList')}>Product List</button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="orders-grid">
        {/* Customer Payment Section */}
        <div>
          <h2 className="section-title">Check Payment</h2>
          <div className="orders-section">
            {customerPaymentOrders.map(order => (
              <div key={order.order_id} className="order-card">
                <p>Order ID: {order.order_id}</p>
                <p>Username: {order.username}</p>
                <p>Purchased Date: {new Date(order.order_date).toLocaleDateString()}</p>
                <button onClick={() => navigate(`/AdminCheck/${order.order_id}`)}>Check</button>
              </div>
            ))}
          </div>
        </div>

        {/* To be Prepared Section */}
        <div>
          <h2 className="section-title">To be Prepared</h2>
          <div className="orders-section">
            {toBePreparedOrders.map(order => (
              <div key={order.order_id} className="order-card">
                <p>Username: {order.username}</p>
                <p>Order ID: {order.order_id}</p>
                <p>Total Price: ${order.total_price}</p>
                <button onClick={() => navigate(`/AdminCheck/${order.order_id}`)}>Check</button>
              </div>
            ))}
          </div>
        </div>

        {/* To be Delivered Section */}
        <div>
          <h2 className="section-title">To be Delivered</h2>
          <div className="orders-section">
            {toBeDeliveredOrders.map(order => (
              <div key={order.order_id} className="order-card">
                <p>Username: {order.username}</p>
                <p>Order ID: {order.order_id}</p>
                <p>Status: {order.delivery_status}</p>
                <button onClick={() => navigate(`/AdminCheck/${order.order_id}`)}>Check</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="logout-button" onClick={() => navigate('/login')}>
        Log out
      </button>
    </div>
  );
}

export default AdminProfilePage;
