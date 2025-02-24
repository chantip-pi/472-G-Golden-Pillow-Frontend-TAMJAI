import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AdminProfilePage.css';

function AdminProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showSlip, setShowSlip] = useState(false);
  const [orderId, setorderId] = useState(null);
  const [selectOrder, setSelectOrder] = useState(null);

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

  useEffect(() => {
    if (orderId) {
      const order = orders.find(order => order.order_id === orderId);
      setSelectOrder(order);
    }
  }, [orderId, orders]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  const customerPaymentOrders = orders.filter(order => order.payment_status === 'Yet to check');

  const handleSelectOrder = (orderId) => {
    setorderId(orderId); 
  };

  const handleAcceptOrder = async () => {
    try {
      console.log(orderId);
      await axios.post(`http://localhost:13889/orders/updatePaymentStatus`, {
        orderId,
        payment_status: 'Approved',
      });
      alert('Order payment status updated to accept.');
      window.location.reload()
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status.');
    }
  };

  const handleRejectOrder = async () => {
    try {
      await axios.post(`http://localhost:13889/orders/updatePaymentStatus`, {
        orderId,
        payment_status: 'Rejected',
      });
      alert('Order payment status updated to reject.');
      window.location.reload()
    } catch (error) {
      console.error('Error updating payment status:', error.response ? error.response.data : error.message);
      alert('Failed to update payment status.');
    }
  };

  const handleShowSlip = () => setShowSlip(true);

  const handlePrintReceipt = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`http://localhost:13889/orders/createreceipt`, {
        orderId,
        userId,
      });
      alert('Receipt created successfully.');
    } catch (error) {
      console.error('Error creating receipt:', error.response ? error.response.data : error.message);
      alert('Failed to create receipt.');
    }
  };

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
                <p><strong>Order ID:</strong> {selectOrder.order_id}</p>
                <p><strong>User ID:</strong> {selectOrder.user_id}</p>
                <p><strong>Purchased Date:</strong> {new Date(selectOrder.order_date).toLocaleDateString()}</p>
                <p><strong>Address:</strong> {selectOrder.address}</p>

                <div className="status-buttons">
                  <div className="detail-inforow">
                    <span className="detail-infolabel">Transfer Slip:</span>
                    <button className="see-slip-button" onClick={handleShowSlip}>See the slip</button>
                  </div>
                  <div className="detail-inforow">
                    <span className="detail-infolabel">Payment Status:</span>
                    <span className="detail-infovalue">
                      <button className="accept-order-button" onClick={handleAcceptOrder}>Accept This Order</button>
                      <button className="reject-order-button" onClick={handleRejectOrder}>Reject This Order</button>
                    </span>
                  </div>

                  <div className="detail-inforow">
                    <span className="detail-infolabel">Receipt:</span>
                    <button className="print-receiptbutton" onClick={handlePrintReceipt}>Print Receipt</button>
                  </div>
                </div>
                {showSlip && (
                <div className="modal-overlay" onClick={() => setShowSlip(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={`http://localhost:13889${selectOrder.slip_payment}`}
                      alt="Transfer Slip"
                      className="slip-image"
                    />
                    <button className="close-button" onClick={() => setShowSlip(false)}>Close</button>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}
      </div>

      <button className="logout-button" onClick={() => navigate('/login')}>
        Log out
      </button>
    </div>
  );
}

export default AdminProfilePage;
