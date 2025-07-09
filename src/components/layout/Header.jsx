import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/header.css'
import { useAuth } from '../../context/AuthContext.jsx';


export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="logo">
        <h1>JaMoveo</h1>
      </div>
      {!!user &&
        <div className="user-actions">
          <span className="hello">Hello {user.username}</span>
          <span className="divider">|</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>

        </div>}
    </div>
  );
}
