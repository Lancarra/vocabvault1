import React from "react";
import { Link } from "react-router-dom";
import SearchImg from "../../assets/search-img.png";
import "./Header.css"; // подключи стили, если нужно

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <h2 className="logo">LearnIT</h2>
            </div>

            <div className="header-center">
                <div className="search_bar">
                    <img src={SearchImg} alt="search" />
                    <input type="text" placeholder="Search..." disabled />
                </div>
            </div>

            <div className="header-right">
                <Link to="/profile" className="profile-btn">Profile</Link>
            </div>
        </header>
    );
};

export default Header;
