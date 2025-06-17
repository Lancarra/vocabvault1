import React from 'react';
import './style/main.css';
import {Link, useNavigate} from "react-router-dom";
import SearchImg from '../../assets/search-img.png';

function MainPage() {
    const navigate = useNavigate();
    return (
        <div className="app_layout">
            <header className="header">
                <div className="header-left">
                    <h2 className="logo">LearnIT</h2>
                </div>

                <div className="header-center">
                    <div className="search_bar">
                        <img src={SearchImg} alt="search" />
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>

                <div className="header-right">
                    <a href="/login" className="login-btn">Log in</a>
                </div>
            </header>


            <main className="main-page-content">
                <div className="container">
                    <div className="main_block-title">
                        <h1>What describes you best?</h1>
                        <p className="subtext">
                            Let us tailor your experience — choose the role that fits you.
                        </p>
                        <button onClick={() => navigate('/signup')} className="register-btn">
                            Register for free
                        </button>
                    </div>

                    <div className="main_block cards">
                        <Link to="/login" state={{ title: "teacher" }}>
                            <div className="auth_card">I am a teacher</div>
                        </Link>
                        <Link to="/login" state={{ title: "student" }}>
                            <div className="auth_card">I am a student</div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MainPage;