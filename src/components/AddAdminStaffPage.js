import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddAdminStaffPage.css";

function AddAdminStaffPage() {
  // Corrected the component name here
  const navigate = useNavigate(); // Use React Router's navigate for redirection

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
    lastname: "",
    phone_number: "",
    province: "",
    district: "",
    name_road: "",
    house_details: "",
    address: "",
    postal_code: "",
    role: "admin"
  });

  // Function to check if the username is already taken
  const checkUsername = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:13889/check-username/${username}`
      );
      if (response.status === 409) {
        alert("Username is already taken");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking username:", error);
      alert("An error occurred while checking the username.");
      return false;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // 2. Check if all fields are filled
    for (const key in userData) {
      if (!userData[key]) {
        alert(`Please fill the ${key} field.`);
        return;
      }
    }

    // 3. Validate email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userData.email)) {
      alert("Invalid email address");
      return;
    }

    // 4. Check if username is already taken
    const isUsernameAvailable = await checkUsername(userData.username);
    if (!isUsernameAvailable) return;

    // 5. Send data to backend if validations pass
    try {
      const response = await fetch("http://localhost:13889/register-admin-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("User registered successfully!");
        navigate(-1);
      } else {
        alert(`Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRole = (role) => {
    setUserData((prev) => ({ ...prev, role }));
  };
  
  return (
    <div className="register-container">
      <div className="add-role-nav">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <button
          type="submit"
          className="confirm-detail-button"
          onClick={handleRegister}
        >
          Confirm Detail
        </button>
      </div>
      <div className="select-header">
        <h2 className="select-role-title">Select Role</h2>
        <div className="role-buttons">
        <button
            className={`role-button ${userData.role === "admin" ? "role-button-focused" : ""}`}
            onClick={() => handleRole("admin")}
            autoFocus
          >
            Admin
          </button>
          <button
            className={`role-button ${userData.role === "packaging staff" ? "role-button-focused" : ""}`}
            onClick={() => handleRole("packaging staff")}
          >
            Packaging Staff
          </button>
          <button
            className={`role-button ${userData.role === "delivering staff" ? "role-button-focused" : ""}`}
            onClick={() => handleRole("delivering staff")}
          >
            Delivery Staff
          </button>
        </div>
      </div>

      <form onSubmit={handleRegister} className="register-form">
        <h2 className="section-title">User Details</h2>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="user-details">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />
        </div>

        <h2 className="section-title">Address</h2>
        <div className="address-details">
          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="province"
            placeholder="Province"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="district"
            placeholder="District and Sub-District"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name_road"
            placeholder="Road"
            onChange={handleChange}
          />
          <input
            type="text"
            name="house_details"
            placeholder="House Details"
            onChange={handleChange}
          />
          <input
            type="text"
            name="postal_code"
            placeholder="Postal Code"
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </div>
  );
}

export default AddAdminStaffPage; // Make sure to export the correct component
