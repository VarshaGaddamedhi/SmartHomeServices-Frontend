import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({ onViewServices, onViewBookings }) {
    const storedUser = localStorage.getItem("user");
    let user = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }

    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [bookingError, setBookingError] = useState("");

    useEffect(() => {
        let active = true;

        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token || !user?.id) {
                    if (active) {
                        setBookings([]);
                        setBookingError("Please log in to view your booking summary.");
                    }
                    return;
                }

                const response = await axios.get(
                    "http://localhost:8080/bookings",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const customerBookings = response.data.filter(
                    (booking) =>
                        String(booking.customer?.id) === String(user.id) ||
                        (
                            booking.customer?.email &&
                            user.email &&
                            booking.customer.email.toLowerCase() === user.email.toLowerCase()
                        )
                );

                if (active) {
                    setBookings(customerBookings);
                    setBookingError("");
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);

                if (active) {
                    setBookingError("Your booking summary is temporarily unavailable.");
                }
            } finally {
                if (active) {
                    setLoadingBookings(false);
                }
            }
        };

        fetchBookings();

        return () => {
            active = false;
        };
    }, [user?.id, user?.email]);

    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
        (booking) => booking.status?.toUpperCase() === "PENDING"
    ).length;

    const acceptedBookings = bookings.filter(
        (booking) => booking.status?.toUpperCase() === "ACCEPTED"
    ).length;

    const completedBookings = bookings.filter(
        (booking) => booking.status?.toUpperCase() === "COMPLETED"
    ).length;

    const popularServices = [
        {
            name: "Plumbing",
            description: "Pipe and tap repairs",
            icon: "🔧"
        },
        {
            name: "Electrical Repair",
            description: "Electrical repairs and fittings",
            icon: "⚡"
        },
        {
            name: "Cleaning",
            description: "Professional home cleaning",
            icon: "🧹"
        },
        {
            name: "AC Repair",
            description: "Cooling and AC maintenance",
            icon: "❄️"
        },
        {
            name: "Carpentry",
            description: "Furniture and woodwork",
            icon: "🪚"
        },
        {
            name: "Painting",
            description: "Refresh your home interiors",
            icon: "🎨"
        }
    ];

    return (
        <div className="customer-dashboard">
            <nav className="dashboard-navbar">
                <div className="dashboard-logo">
                    <span>🏠</span>
                    <span>SmartHome</span>
                </div>

                <div className="dashboard-user">
                    <div className="user-avatar">
                        {(user?.name || "U").charAt(0).toUpperCase()}
                    </div>

                    <div className="dashboard-user-info">
                        <strong>{user?.name || "User"}</strong>
                        <span>Customer Account</span>
                    </div>
                </div>
            </nav>

            <main>
                <section className="dashboard-welcome">
                    <div className="dashboard-welcome-content">
                        <span className="dashboard-label">
                            YOUR PERSONAL HOME SERVICE HUB
                        </span>

                        <h1>
                            Welcome back, <span>{user?.name || "User"}!</span> 👋
                        </h1>

                        <p>
                            A better home starts here. Discover trusted professionals,
                            schedule services, and manage your bookings in one place.
                        </p>

                        <div className="dashboard-welcome-actions">
                            <button
                                type="button"
                                className="dashboard-primary-btn"
                                onClick={onViewServices}
                            >
                                Explore Services <span>→</span>
                            </button>

                            <button
                                type="button"
                                className="dashboard-secondary-btn"
                                onClick={onViewBookings}
                            >
                                View My Bookings
                            </button>
                        </div>
                    </div>

                    <div className="welcome-house">
                        <div className="welcome-house-circle">🏡</div>
                        <span className="welcome-house-caption">
                            Your home, cared for.
                        </span>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="dashboard-section-title">
                        <div>
                            <span>YOUR ACTIVITY</span>
                            <h2>Booking overview</h2>
                        </div>

                        <button
                            type="button"
                            className="dashboard-text-link"
                            onClick={onViewBookings}
                        >
                            View all bookings →
                        </button>
                    </div>

                    {bookingError && (
                        <p className="dashboard-booking-message" role="status">
                            {bookingError}
                        </p>
                    )}

                    <div className="booking-summary-grid">
                        <div className="booking-summary-card">
                            <div className="booking-summary-icon blue">📋</div>
                            <div>
                                <span>Total Bookings</span>
                                <h3>{loadingBookings ? "..." : totalBookings}</h3>
                                <small>All your service requests</small>
                            </div>
                        </div>

                        <div className="booking-summary-card">
                            <div className="booking-summary-icon orange">⏳</div>
                            <div>
                                <span>Pending</span>
                                <h3>{loadingBookings ? "..." : pendingBookings}</h3>
                                <small>Awaiting confirmation</small>
                            </div>
                        </div>

                        <div className="booking-summary-card">
                            <div className="booking-summary-icon purple">✓</div>
                            <div>
                                <span>Accepted</span>
                                <h3>{loadingBookings ? "..." : acceptedBookings}</h3>
                                <small>Confirmed service requests</small>
                            </div>
                        </div>

                        <div className="booking-summary-card">
                            <div className="booking-summary-icon green">⭐</div>
                            <div>
                                <span>Completed</span>
                                <h3>{loadingBookings ? "..." : completedBookings}</h3>
                                <small>Successfully completed</small>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="dashboard-section-title">
                        <div>
                            <span>GET THINGS DONE</span>
                            <h2>How can we help you today?</h2>
                        </div>
                    </div>

                    <div className="dashboard-action-grid">
                        <button
                            type="button"
                            className="dashboard-action-card"
                            onClick={onViewServices}
                        >
                            <div className="dashboard-action-icon blue">🔧</div>

                            <div className="action-content">
                                <h3>Find a Service</h3>
                                <p>
                                    Discover home services and find the right
                                    professional for your needs.
                                </p>
                                <span>Explore Services →</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="dashboard-action-card"
                            onClick={onViewBookings}
                        >
                            <div className="dashboard-action-icon purple">📋</div>

                            <div className="action-content">
                                <h3>My Bookings</h3>
                                <p>
                                    Check booking details, view your schedule,
                                    and track service progress.
                                </p>
                                <span>Manage Bookings →</span>
                            </div>
                        </button>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="dashboard-section-title">
                        <div>
                            <span>OUR SERVICES</span>
                            <h2>Everything your home needs</h2>
                            <p className="dashboard-section-description">
                                Find help for everyday repairs, maintenance, and
                                home improvement.
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-service-grid">
                        {popularServices.map((service) => (
                            <button
                                type="button"
                                className="dashboard-service-card"
                                key={service.name}
                                onClick={onViewServices}
                                aria-label={`Browse ${service.name} services`}
                            >
                                <div className="service-card-icon">
                                    {service.icon}
                                </div>

                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                                <span className="dashboard-service-link">
                                    Find a professional →
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="dashboard-trust">
                    <div className="trust-item">
                        <div>✓</div>
                        <span>Verified Professionals</span>
                    </div>

                    <div className="trust-item">
                        <div>⚡</div>
                        <span>Convenient Booking</span>
                    </div>

                    <div className="trust-item">
                        <div>⭐</div>
                        <span>Quality Service</span>
                    </div>

                    <div className="trust-item">
                        <div>🔒</div>
                        <span>Secure Platform</span>
                    </div>
                </section>
            </main>

            <footer className="dashboard-footer">
                <strong>🏠 SmartHome Services</strong>
                <p>Making home services simple, reliable, and convenient.</p>
                <small>© 2026 SmartHome Services</small>
            </footer>
        </div>
    );
}

export default Dashboard;