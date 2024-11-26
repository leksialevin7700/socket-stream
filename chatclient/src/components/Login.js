import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Login.css'; // Import the CSS file here

const Login = ({ setCurrentUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // You can remove this as we will use alert instead
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous error
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { username, password });
            setCurrentUser(res.data.username);
            localStorage.setItem("token", res.data.token);
            alert("Login successful!"); // Display alert on successful login
            navigate("/users"); // Redirect to users page after successful login
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
            alert(errorMessage); // Display error message in alert
        }
    };

    return (
        <div className="login-container">
            <div className="glass-effect">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                {/* Error paragraph removed since we are using alert */}
                <p>
                    New user? <Link to="/register" className="register-link">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
