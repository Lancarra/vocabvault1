import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../../services/userService.js";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            login(data.token, data.userId);
            console.log("Successful login:", data);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
        }

    };

    return (
        <div className="auth-container">
            <form className="auth-box" onSubmit={handleSubmit}>
                <h2>Log In</h2>
                <p className="auth-subtext">
                    New user? <Link to="/signup">Create an account</Link>
                </p>
                <div className="input-group">
                    <span className="icon">📧</span>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <span className="icon">🔒</span>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="full-width-btn">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;