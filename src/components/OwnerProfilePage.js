import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './OwnerProfilePage.css';


function OwnerProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("Months");
  const [adminUsers, setAdminUsers] = useState([]);
  const [staffUsers, setStaffUsers] = useState([])
  const [salesSummary, setSalesSummary] = useState([]);
  const [incomeSummary, setIncomeSummary] = useState([]);

  useEffect(() => {
    const fetchIncomeSummary = async () => {
      try {
        const response = await axios.get(`http://localhost:13889/income-summary`);
        setIncomeSummary(response.data);
      } catch (error) {
        console.error('Error fetching income summary:', error);
      }
    };

    fetchIncomeSummary();
  }, []);

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        if (selectedMonth !== "Months") {
          const monthMap = {
            January: "2024-01",
            February: "2024-02",
            March: "2024-03",
            April: "2024-04",
            May: "2024-05",
            June: "2024-06",
            July: "2024-07",
            August: "2024-08",
            September: "2024-09",
            October: "2024-10",
            November: "2024-11",
            December: "2024-12",
          };
          const month = monthMap[selectedMonth];
          if (month) {
            const response = await axios.get(`http://localhost:13889/sales-summary/${month}`);
            setSalesSummary(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching sales summary:', error);
      }
    };

    fetchSalesSummary();
  }, [selectedMonth]);

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

    const fetchAdminUsers = async () => {
      try {
        const response = await axios.get('http://localhost:13889/allusers');
        const admins = response.data.filter(user => user.role === 'admin');
        setAdminUsers(admins);
      } catch (error) {
        console.error('Error fetching admin users:', error);
      }
    };

    const fetchStaffUsers = async () => {
      try {
        const response = await axios.get('http://localhost:13889/allusers');
        const staffs = response.data.filter(user => user.role === 'packaging staff' || user.role === 'delivering staff');
        console.log(staffs);
        setStaffUsers(staffs);
      } catch (error) {
        console.error('Error fetching staff users:', error);
      }
    };

    fetchUserData();
    fetchAdminUsers();
    fetchStaffUsers();
  }, [userId, navigate]);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  };

  return (
    <div className="owner-profile">
    <div className="owner-dashboard-container">
      <header className="header-dashboard">
        <h1>Owner Dashboard</h1>
        <div className="button-container">
          <button className="add-role-button" onClick={() => navigate('/addRole')}>Add Admin and Staff</button>
          <button className="logout-button" onClick={() => navigate('/login')}>Log out</button>
        </div>
      </header>
      <div className="dashboard-layout">
        {/* User Info Section */}
        <div className="user-info-section card">
          <h2>User Info Details</h2>
          {userData ? (
            <div className="user-info-details">
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Name:</strong> {userData.name} {userData.lastname}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Phone:</strong> {userData.phone_number}</p>
              <p><strong>Address:</strong> {userData.address}, {userData.name_road}, {userData.district}, {userData.province}, {userData.postal_code}</p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>

        {/* Admin List Section */}
        <div className="admin-list-section card">
          <h2>Admin List</h2>
          <div className="admin-list-scrollable">
            {adminUsers.length > 0 ? (
              adminUsers.map((admin) => (
                <div key={admin.user_id} className="admin-card">
                  <div className="card-container">
                    <div>
                      <p><strong>Username:</strong> {admin.username}</p>
                      <p><strong>Name:</strong> {admin.name} {admin.lastname}</p>
                      <p><strong>Email:</strong> {admin.email}</p>
                    </div>
                    <button className="check-button" onClick={() => navigate(`/profileEmployee/${admin.user_id}`)}>Check</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No admin users found.</p>
            )}
          </div>
        </div>

        {/* Staff List Section */}
        <div className="admin-list-section card">
          <h2>Staff List</h2>
          <div className="admin-list-scrollable">
            {staffUsers.length > 0 ? (
              staffUsers.map((staff) => (
                  <div key={staff.user_id} className="admin-card">
                    <div className="card-container">
                    <div>
                      <p><strong>Username:</strong> {staff.username}</p>
                      <p><strong>Name:</strong> {staff.name} {staff.lastname}</p>
                      <p><strong>Email:</strong> {staff.email}</p>
                    </div>
                    <button className="check-button" onClick={() => navigate(`/profileEmployee/${staff.user_id}`)}>Check</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No staff users found.</p>
            )}
          </div>
        </div>

        {/* Sales Section */}
        <div className="sales-section card">
          <div className="sales-header">
            <h2>Sales Summary</h2>
            <select value={selectedMonth} onChange={handleMonthChange} className="month-select">
              <option value="Months">Months</option>
              {Object.keys({
                January: "2024-01",
                February: "2024-02",
                March: "2024-03",
                April: "2024-04",
                May: "2024-05",
                June: "2024-06",
                July: "2024-07",
                August: "2024-08",
                September: "2024-09",
                October: "2024-10",
                November: "2024-11",
                December: "2024-12",
              }).map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="sales-summary-content">
            {salesSummary.length > 0 ? (
              salesSummary.map((product, index) => (
                <div key={index} className="sales-summary-card">
                  <p><strong>Product Name:</strong> {product.lot_id} - Grade: {product.grade}</p>
                  <p><strong>Total Sold:</strong> {product.totalQuantity}</p>
                  <p><strong>Total Revenue:</strong> {product.totalRevenue}</p>
                  <p><strong>Total Profit:</strong> {product.totalProfit}</p>
                </div>
              ))
            ) : (
              <p>Select a month to view sales summary.</p>
            )}
          </div>
        </div>

        {/* Income Section */}
        <div className="income-section card">
          <h2>Income</h2>
          <div className="income-summary-content">
            {incomeSummary.length > 0 ? (
              incomeSummary.map((income, index) => (
                <div key={index} className="income-summary-card">
                  <p><strong>{income.month}:</strong> {income.totalIncome} บาท</p>
                </div>
              ))
            ) : (
              <p>Loading income summary...</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default OwnerProfilePage;
