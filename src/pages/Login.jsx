import { useState } from "react";
import axios from "axios";
import API_URL from "../api";

function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/auth/login`,
                {
                    email: email,
                    password: password
                }
            );

            console.log(response.data);

            if (response.data.token) {

                localStorage.setItem(
                    "token",
                    response.data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data)
                );

                alert("Login successful!");

                onLogin();

            } else {

                alert(response.data.message);

            }

        } catch (error) {

            console.log(error);

            alert("Login failed");

        }
    };

    return (

        <div className="login-page">

            {/* Left Side */}

            <div className="login-showcase">

                <div className="login-brand">
                    🏠 SmartHome Services
                </div>

                <div className="login-showcase-content">

                    <span className="login-tag">
                        WELCOME BACK
                    </span>

                    <h1>
                        Your home,
                        <br />
                        <span>taken care of.</span>
                    </h1>

                    <p>
                        Sign in to connect with trusted
                        professionals and manage all your
                        home services in one place.
                    </p>

                    <div className="login-features">

                        <div>
                            <span>✓</span>
                            Verified professionals
                        </div>

                        <div>
                            <span>✓</span>
                            Easy service booking
                        </div>

                        <div>
                            <span>✓</span>
                            Track your bookings
                        </div>

                    </div>

                </div>

            </div>


            {/* Right Side */}

            <div className="login-form-section">

                <div className="login-card">

                    <div className="login-icon">
                        🔐
                    </div>

                    <h2>
                        Welcome Back
                    </h2>

                    <p className="login-subtitle">
                        Login to your SmartHome account
                    </p>


                    <form onSubmit={handleLogin}>

                        {/* Email */}

                        <div className="input-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Login Button */}

                        <button
                            type="submit"
                            className="login-submit"
                        >
                            Login to Account →
                        </button>

                    </form>


                    <div className="login-security">

                        🔒 Your information is securely
                        authenticated

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;