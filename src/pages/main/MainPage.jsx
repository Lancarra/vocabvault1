import React from 'react';
import './style/main.css';
import { useNavigate } from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();

    return (
        <div className="app_layout">
            <header className="header">
                <div className="container header-cont">
                    <div className="header-left">
                        <h2 className="logo">LearnIT</h2>
                    </div>

                    <div className="header-right">
                        <button onClick={() => navigate('/login')} className="login-btn">
                            Log in
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-page-content">
                <div className="container">
                    <div className="main_block-title">
                        <h1>Hello! Let's start learning together?</h1>
                        <p className="subtext">
                            Let us tailor your experience — choose the role that fits you.
                        </p>
                        <button onClick={() => navigate('/signup')} className="register-btn">
                            Don’t have an account? Register now!
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MainPage;
