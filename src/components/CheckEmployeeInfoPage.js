import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CheckEmployeeInfoPage.css"; // Ensure this CSS matches the new design

const CheckEmployeeInfoPage = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response1 = await axios.get(
          `http://localhost:13889/user/${staffId}`
        );
        setUserData(response1.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("User not found. Please log in again.");
      }
    };

    fetchUserData();
  }, [staffId]);


   // Handle user deletion
   // Handle user deletion in the frontend
const handleDeleteUser = async () => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      // Make a DELETE request to the backend
      await axios.delete(`http://localhost:13889/delete-user/${staffId}`);
      alert("User deleted successfully");
      navigate(-1); 
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("There was an issue deleting the user.");
  }
};


  if (!userData) {
    return <p>Loading profile...</p>;
  }


  return (
    <div className="staff-container">
       <div className="add-role-nav">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <button className="delete-button" onClick={handleDeleteUser}>Delete</button>
        </div>
        <div className="staff-info">
          <p><strong>Username:</strong> <span>{userData.username}</span></p>
          <p><strong>Name:</strong> <span>{userData.name}</span></p>
          <p><strong>Last Name:</strong> <span>{userData.lastname}</span></p>
          <p><strong>Role:</strong> <span>{userData.role}</span></p>
          <p><strong>Email:</strong> <span>{userData.email}</span></p>
          <p><strong>Phone Number:</strong> <span>{userData.phone_number}</span></p>
          <p><strong>Address:</strong> <span>{userData.address}</span></p>
          <p><strong>Road:</strong> <span>{userData.name_road}</span></p>
          <p><strong>District:</strong> <span>{userData.district}</span></p>
          <p><strong>Province:</strong> <span>{userData.province}</span></p>
          <p><strong>Postal Code:</strong> <span>{userData.postal_code}</span></p>
        </div>

    </div>

  );
};

export default CheckEmployeeInfoPage;
