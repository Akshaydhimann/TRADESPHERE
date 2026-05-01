import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // ✅ Redirect back to frontend signup after logout
      window.location.href = "http://localhost:3000/signup";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="/logo.png" style={{ width: "50px" }} alt="TradeSphere Logo" />

      <div className="menus">
        <ul>
          <li>
            {/* ✅ All paths prefixed with /dashboard/ to match the BrowserRouter mount point */}
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/apps"
              onClick={() => handleMenuClick(5)}
            >
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>

        <hr />

        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">
            {auth.currentUser?.displayName
              ? auth.currentUser.displayName.slice(0, 2).toUpperCase()
              : auth.currentUser?.email?.slice(0, 2).toUpperCase() || "ZU"}
          </div>
          <p className="username">
            {auth.currentUser?.displayName ||
              auth.currentUser?.email ||
              "USERID"}
          </p>
        </div>

        {/* ✅ Logout option in profile dropdown */}
        {isProfileDropdownOpen && (
          <div
            className="profile-dropdown"
            style={{
              position: "absolute",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 100,
            }}
            onClick={handleLogout}
          >
            Logout
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;