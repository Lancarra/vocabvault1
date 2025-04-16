
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form);
            alert("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-box" onSubmit={handleSubmit}>
                <h2>Log In</h2>
                <p className="auth-subtext">
                    New user? <Link to="/register">Create an account</Link>
                </p>
                <div className="input-group">
                    <span className="icon">👤</span>
                    <input
                        type="text"
                        name="username"
                        placeholder="Email address"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <span className="icon">🔒</span>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="full-width-btn">Log in</button>
            </form>
        </div>
    );
};

export default Login;
