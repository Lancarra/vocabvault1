import React from 'react';
import './style/main.css';
import {Link, useNavigate} from "react-router-dom";
import SearchImg from '../../assets/search-img.png';

function MainPage() {
    const navigate = useNavigate();
    return (
        <div className="app_layout">
            <header>
                <div className="container header_cont">
                    <div className="logo">
                        <h2>LearnIT</h2> {/* Был img — теперь текст */}
                    </div>
                    <div className="search_bar">
                        <img src={SearchImg} alt="search" />
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="auth_block">
                        <a href="/login" className="login-btn">Log in</a>
                        {/*<a href="/signup">Sign up</a>*/}
                    </div>
                </div>
            </header>

            <main>
                <div className="container">
                    <div className="main_block">
                        <h1>How do you want to study?</h1>
                        <p className="subtext">
                            Master any subject with interactive flashcards, practice tests, and study activities on LearnIT.
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