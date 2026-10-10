import { useState } from "react";
import axios from "axios";

function Register({ onRegistrationComplete }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("CUSTOMER");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/auth/register",
                {
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    role: role
                }
            );

            console.log("Registration Response:", response.data);

            if (response.data.message === "Registration successful") {

                /*
                 * Save JWT token
                 * returned after registration.
                 */
                if (response.data.token) {
                    localStorage.setItem(
                        "token",
                        response.data.token
                    );
                }

                /*
                 * Save registered user details.
                 */
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data)
                );

                alert("Registration successful!");

                /*
                 * Customer → Login
                 * Provider → Provider Details
                 */
                onRegistrationComplete(role);

            } else {

                alert(response.data.message);
            }

        } catch (error) {

            console.log("Registration error:", error);

            if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Registration failed"
                );

            } else {

                alert("Failed to connect to backend.");
            }
        }
    };

    return (
        <div className="register-page">

            <div className="register-showcase">

                <div className="register-brand">
                    🏠 SmartHome Services
                </div>

                <div className="register-showcase-content">

                    <span className="register-tag">
                        JOIN SMART HOME
                    </span>

                    <h1>
                        Make your home<br />
                        <span>better.</span>
                    </h1>

                    <p>
                        Create your account and get access to
                        reliable home service professionals,
                        easy booking and service tracking.
                    </p>

                    <div className="register-features">

                        <div>
                            <span>✓</span>
                            Trusted service professionals
                        </div>

                        <div>
                            <span>✓</span>
                            Simple and quick booking
                        </div>

                        <div>
                            <span>✓</span>
                            Manage your services easily
                        </div>

                    </div>

                </div>

            </div>


            <div className="register-form-section">

                <div className="register-card">

                    <div className="register-icon">
                        ✨
                    </div>

                    <h2>
                        Create Account
                    </h2>

                    <p className="register-subtitle">
                        Join SmartHome Services today
                    </p>


                    <form onSubmit={handleRegister}>

                        <div className="register-input-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="register-input-group">

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


                        <div className="register-input-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="register-input-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="register-input-group">

                            <label>
                                Account Type
                            </label>

                            <div className="role-selection">

                                <label className="role-option">

                                    <input
                                        type="radio"
                                        name="role"
                                        value="CUSTOMER"
                                        checked={role === "CUSTOMER"}
                                        onChange={(e) =>
                                            setRole(e.target.value)
                                        }
                                    />

                                    <span>
                                        👤 Customer
                                    </span>

                                </label>


                                <label className="role-option">

                                    <input
                                        type="radio"
                                        name="role"
                                        value="PROVIDER"
                                        checked={role === "PROVIDER"}
                                        onChange={(e) =>
                                            setRole(e.target.value)
                                        }
                                    />

                                    <span>
                                        👨‍🔧 Service Provider
                                    </span>

                                </label>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="register-submit"
                        >
                            Create My Account →
                        </button>

                    </form>


                    <div className="register-security">
                        🔒 Your information is securely protected
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;