import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser } from "../../../services/userService"; // loginUser — если хочешь авто-логин
import { useAuth } from "../../../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ теперь внутри компонента

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // 🔐 1. Зарегистрировать
            await registerUser(form.email, form.password, form.username);

            // ✅ 2. Авто-логин сразу после регистрации
            const loginData = await loginUser(form.email, form.password);

            // 🧠 3. Сохранить в контекст и localStorage
            login(loginData.token, loginData.userId);

            // 🚀 4. Перенаправление на Dashboard
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed";
            console.error("Registration error:", message);
            setError(message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-box" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <p className="auth-subtext">
                    Already have an account? <Link to="/">Log In</Link>
                </p>

                <div className="input-group">
                    <span className="icon">🙍</span>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <span className="icon">📧</span>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
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
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <span className="icon">🔒</span>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && (
                    <p style={{ color: "red", marginBottom: "1rem", fontSize: "0.95rem" }}>
                        {error}
                    </p>
                )}

                <button type="submit" className="full-width-btn">Register</button>
            </form>
        </div>
    );
};

export default Register;
