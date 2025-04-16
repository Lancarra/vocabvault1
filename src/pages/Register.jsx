import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(form);
        if (result.success) {
            alert("Registration successful!");
            navigate("/dashboard");
        } else {
            console.error("Registration failed:", result.message);
            alert(`Registration failed: ${result.message}`);
        }
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <button type="submit">Register</button>
            <p>Already have an account? <Link to="/">Login</Link></p>
        </form>
    );
};

export default Register;
