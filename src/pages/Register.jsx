import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const result = await register(form);
        if (result.success) {
            alert("Registration successful!");
            navigate("/dashboard");
        } else {
            alert(`Registration failed: ${result.message}`);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-box" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <p className="auth-subtext">
                    Already have an account? <Link to="/">Login</Link>
                </p>

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

                <button type="submit" className="full-width-btn">Register</button>
            </form>
        </div>
    );
};

export default Register;
