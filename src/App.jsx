import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderDetails from "./pages/ProviderDetails";

import "./css/App.css";


function App() {

    // Start with HOME page
    const [page, setPage] = useState("home");

    const [selectedService, setSelectedService] = useState(null);


    // Login handling
    const handleLogin = () => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (user?.role === "PROVIDER") {

            setPage("provider-dashboard");

        } else {

            setPage("dashboard");

        }
    };


    // Logout handling
    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setPage("home");
    };


    return (

        <div className="app-container">


            {/* =========================
                HOME / LANDING PAGE
            ========================== */}

            {page === "home" && (

                <div className="landing-page">


                    {/* SIDE MENU */}

                    <div className="side-menu">

                        <div className="side-logo">
                            🏠
                        </div>

                        <button
                            onClick={() => setPage("home")}
                        >
                            Home
                        </button>

                        <button
                            onClick={() => setPage("login")}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => setPage("register")}
                        >
                            Register
                        </button>

                    </div>


                    {/* HERO */}

                    <section className="landing-hero">


                        <div className="hero-content">

                            <div className="small-heading">
                                🏠 SMART HOME SERVICES
                            </div>

                            <h1>
                                Your Home.
                                <br />
                                Our
                                <span> Expertise.</span>
                            </h1>

                            <p>
                                Connect with trusted professionals
                                for reliable, fast and affordable
                                home services — all in one place.
                            </p>


                            <div className="hero-buttons">

                                <button
                                    className="hero-main-btn"
                                    onClick={() => setPage("login")}
                                >
                                    Get Started →
                                </button>

                                <button
                                    className="hero-outline-btn"
                                    onClick={() => setPage("register")}
                                >
                                    Create Account
                                </button>

                            </div>

                        </div>


                        {/* HERO VISUAL */}

                        <div className="hero-visual">

                            <div className="home-circle">

                                <div className="home-icon">
                                    🏠
                                </div>

                            </div>


                            <div className="floating-card card-one">

                                🔧
                                <div>
                                    <strong>
                                        Plumbing
                                    </strong>

                                    <small>
                                        Professional service
                                    </small>
                                </div>

                            </div>


                            <div className="floating-card card-two">

                                ⭐

                                <div>
                                    <strong>
                                        4.8/5 Rating
                                    </strong>

                                    <small>
                                        Trusted professionals
                                    </small>
                                </div>

                            </div>


                            <div className="floating-card card-three">

                                ⚡

                                <div>
                                    <strong>
                                        Quick Booking
                                    </strong>

                                    <small>
                                        Easy & convenient
                                    </small>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* SERVICES */}

                    <section className="landing-section">

                        <div className="section-heading">

                            <span>
                                OUR SERVICES
                            </span>

                            <h2>
                                Everything Your Home Needs
                            </h2>

                            <p>
                                Find skilled professionals for
                                all your essential home services.
                            </p>

                        </div>


                        <div className="service-preview-grid">


                            <div className="service-preview">
                                <div className="service-icon">
                                    🔧
                                </div>

                                <h3>
                                    Plumbing
                                </h3>

                                <p>
                                    Pipe, tap and water repair
                                    services.
                                </p>
                            </div>


                            <div className="service-preview">
                                <div className="service-icon">
                                    ⚡
                                </div>

                                <h3>
                                    Electrical
                                </h3>

                                <p>
                                    Safe and reliable electrical
                                    repair services.
                                </p>
                            </div>


                            <div className="service-preview">
                                <div className="service-icon">
                                    🧹
                                </div>

                                <h3>
                                    Cleaning
                                </h3>

                                <p>
                                    Professional home cleaning
                                    services.
                                </p>
                            </div>


                            <div className="service-preview">
                                <div className="service-icon">
                                    ❄️
                                </div>

                                <h3>
                                    AC Repair
                                </h3>

                                <p>
                                    AC installation and repair
                                    services.
                                </p>
                            </div>


                            <div className="service-preview">
                                <div className="service-icon">
                                    🪚
                                </div>

                                <h3>
                                    Carpentry
                                </h3>

                                <p>
                                    Furniture and woodwork
                                    solutions.
                                </p>
                            </div>


                            <div className="service-preview">
                                <div className="service-icon">
                                    🎨
                                </div>

                                <h3>
                                    Painting
                                </h3>

                                <p>
                                    Professional interior and
                                    exterior painting.
                                </p>
                            </div>

                        </div>

                    </section>


                    {/* WHY CHOOSE US */}

                    <section className="why-section">

                        <div className="section-heading">

                            <span>
                                WHY CHOOSE US
                            </span>

                            <h2>
                                Simple. Reliable. Convenient.
                            </h2>

                        </div>


                        <div className="features-grid">


                            <div className="feature-box">

                                <div>
                                    ✓
                                </div>

                                <h3>
                                    Verified Professionals
                                </h3>

                                <p>
                                    Connect with trusted and
                                    verified service providers.
                                </p>

                            </div>


                            <div className="feature-box">

                                <div>
                                    ⚡
                                </div>

                                <h3>
                                    Easy Booking
                                </h3>

                                <p>
                                    Book your required service
                                    in just a few steps.
                                </p>

                            </div>


                            <div className="feature-box">

                                <div>
                                    📍
                                </div>

                                <h3>
                                    Track Your Service
                                </h3>

                                <p>
                                    Track your booking from
                                    pending to completion.
                                </p>

                            </div>


                            <div className="feature-box">

                                <div>
                                    ⭐
                                </div>

                                <h3>
                                    Ratings & Reviews
                                </h3>

                                <p>
                                    Share your experience and
                                    rate your service provider.
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* STATISTICS */}

                    <section className="stats-section">

                        <div>
                            <strong>
                                500+
                            </strong>

                            <span>
                                Service Providers
                            </span>
                        </div>


                        <div>
                            <strong>
                                1000+
                            </strong>

                            <span>
                                Services Completed
                            </span>
                        </div>


                        <div>
                            <strong>
                                4.8★
                            </strong>

                            <span>
                                Average Rating
                            </span>
                        </div>


                        <div>
                            <strong>
                                24/7
                            </strong>

                            <span>
                                Easy Booking
                            </span>
                        </div>

                    </section>


                    {/* CTA */}

                    <section className="cta-section">

                        <h2>
                            Need a Service at Home?
                        </h2>

                        <p>
                            Get connected with the right
                            professional today.
                        </p>

                        <button
                            onClick={() => setPage("register")}
                        >
                            Get Started →
                        </button>

                    </section>


                    {/* FOOTER */}

                    <footer className="landing-footer">

                        <strong>
                            🏠 SmartHome Services
                        </strong>

                        <p>
                            Making home services simple,
                            reliable and convenient.
                        </p>

                        <small>
                            © 2026 SmartHome Services
                        </small>

                    </footer>

                </div>

            )}


            {/* =========================
                LOGIN
            ========================== */}

            {page === "login" && (

                <Login
                    onLogin={handleLogin}
                />

            )}


            {/* =========================
                REGISTER
            ========================== */}

            {page === "register" && (
    <Register
        onRegistrationComplete={(role) => {
            if (role === "PROVIDER") {
                setPage("provider-details");
            } else {
                setPage("login");
            }
        }}
    />
)}


            {/* =========================
                CUSTOMER DASHBOARD
            ========================== */}

            {page === "dashboard" && (

                <>

                    <Dashboard
                        onViewServices={() =>
                            setPage("services")
                        }

                        onViewBookings={() =>
                            setPage("bookings")
                        }
                    />

                    <br />

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </>

            )}


            {/* =========================
                SERVICES
            ========================== */}

            {page === "services" && (

                <>

                    <Services
                        onBookService={(service) => {

                            setSelectedService(service);

                            setPage("booking");

                        }}
                    />

                    <br />

                    <button
                        onClick={() =>
                            setPage("dashboard")
                        }
                    >
                        Back to Dashboard
                    </button>

                </>

            )}


            {/* =========================
                BOOKING
            ========================== */}

            {page === "booking" &&
                selectedService && (

                    <Booking
                        service={selectedService}

                        onBack={() =>
                            setPage("services")
                        }
                    />

                )
            }


            {/* =========================
                MY BOOKINGS
            ========================== */}

            {page === "bookings" && (

                <MyBookings
                    onBack={() =>
                        setPage("dashboard")
                    }
                />

            )}
            {/* =========================
             PROVIDER DETAILS
    ========================== */}
{page === "provider-details" && (
    <ProviderDetails
        onComplete={() =>
            setPage("login")
        }
    />
)}


            {/* =========================
                PROVIDER DASHBOARD
            ========================== */}

            {page === "provider-dashboard" && (

                <>

                    <ProviderDashboard />

                    <br />

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </>

            )}

        </div>
    );
}


export default App;