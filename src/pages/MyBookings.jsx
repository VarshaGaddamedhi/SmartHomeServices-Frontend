import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

function MyBookings({ onBack }) {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            setError("Please log in to view your bookings.");
            setLoading(false);
            return;
        }

        let user;

        try {
            user = JSON.parse(storedUser);
        } catch {
            setError("Unable to read your account details. Please log in again.");
            setLoading(false);
            return;
        }

        if (!user?.id) {
            setError("Your account details are incomplete. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/bookings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!Array.isArray(response.data)) {
                setError("The booking information could not be read. Please try again.");
                return;
            }

            const myBookings = response.data.filter(
                (booking) =>
                    booking.customer &&
                    String(booking.customer.id) === String(user.id)
            );

            setBookings(myBookings);
        } catch (err) {
            console.error("Booking error:", err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("Your session may have expired. Please log in again.");
            } else {
                setError("Unable to load bookings. Check your connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const formatTime = (time) => {
        if (!time) return "Not specified";

        const match = String(time).match(/^(\d{1,2}):(\d{2})/);

        if (!match) return "Not specified";

        let hour = Number(match[1]);
        const minutes = match[2];

        if (hour < 0 || hour > 23) return "Not specified";

        const period = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;

        return `${String(hour).padStart(2, "0")}:${minutes} ${period}`;
    };

    const formatDate = (date) => {
        if (!date) return "Not specified";

        const dateObject = new Date(date);

        if (Number.isNaN(dateObject.getTime())) {
            return "Not specified";
        }

        return dateObject.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        });
    };

    const getStatusClass = (status) => {
        switch (status?.toUpperCase().replace(/[\s_-]/g, "")) {
            case "PENDING":
                return "status-pending";
            case "ACCEPTED":
                return "status-accepted";
            case "INPROGRESS":
                return "status-progress";
            case "COMPLETED":
                return "status-completed";
            case "REJECTED":
                return "status-rejected";
            case "CANCELLED":
                return "status-cancelled";
            default:
                return "status-default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase().replace(/[\s_-]/g, "")) {
            case "PENDING":
                return "⏳";
            case "ACCEPTED":
                return "✓";
            case "INPROGRESS":
                return "🔄";
            case "COMPLETED":
                return "✅";
            case "REJECTED":
                return "✕";
            case "CANCELLED":
                return "⚠️";
            default:
                return "•";
        }
    };

    const getStatusLabel = (status) => {
        if (!status) return "Unknown";

        return status
            .toLowerCase()
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getServiceIcon = (name) => {
        const serviceName = name?.toLowerCase() || "";

        if (serviceName.includes("plumb")) return "🔧";
        if (serviceName.includes("electric")) return "⚡";
        if (serviceName.includes("clean")) return "🧹";
        if (serviceName.includes("carp")) return "🪚";
        if (
            serviceName.includes("ac") ||
            serviceName.includes("air condition")
        ) {
            return "❄️";
        }
        if (serviceName.includes("paint")) return "🎨";

        return "🏠";
    };

    return (
        <div className="my-bookings-page">
            <section className="bookings-header">
                <div>
                    <span className="bookings-label">CUSTOMER BOOKINGS</span>

                    <h1>
                        Manage your <span>bookings.</span>
                    </h1>

                    <p>
                        View your scheduled services, track booking status,
                        and keep all your home service requests in one place.
                    </p>
                </div>

                <div className="bookings-header-icon" aria-hidden="true">
                    📋
                </div>
            </section>

            <section className="bookings-content">
                <div className="bookings-title-row">
                    <div>
                        <span>YOUR BOOKINGS</span>
                        <h2>Service history</h2>
                    </div>

                    <div className="booking-count" aria-live="polite">
                        {bookings.length}{" "}
                        {bookings.length === 1 ? "Booking" : "Bookings"}
                    </div>
                </div>

                {!loading && !error && bookings.length > 0 && (
                    <div className="services-toolbar">
                        <span>View and track your service requests.</span>

                        <button
                            type="button"
                            className="services-refresh"
                            onClick={fetchBookings}
                            disabled={loading}
                        >
                            ↻ Refresh Bookings
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="bookings-empty" role="status">
                        <div className="empty-booking-icon">⏳</div>
                        <h3>Loading your bookings...</h3>
                        <p>
                            Please wait while we retrieve your service history.
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bookings-error" role="alert">
                        <p>⚠️ {error}</p>

                        <button
                            type="button"
                            className="empty-booking-btn"
                            onClick={fetchBookings}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="bookings-empty">
                        <div className="empty-booking-icon">📋</div>
                        <h3>No bookings yet</h3>
                        <p>
                            You haven't booked any home services yet.
                            Explore our services to get started.
                        </p>

                        <button
                            type="button"
                            onClick={onBack}
                            className="empty-booking-btn"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <div className="bookings-grid">
                        {bookings.map((booking) => (
                            <article
                                className="booking-history-card"
                                key={booking.id}
                            >
                                <div className="booking-card-top">
                                    <div
                                        className="booking-service-icon-small"
                                        aria-hidden="true"
                                    >
                                        {getServiceIcon(booking.service?.name)}
                                    </div>

                                    <div className="booking-card-title">
                                        <span>BOOKING #{booking.id}</span>
                                        <h3>
                                            {booking.service?.name || "Home Service"}
                                        </h3>
                                    </div>

                                    <div
                                        className={`booking-status ${getStatusClass(booking.status)}`}
                                    >
                                        <span>{getStatusIcon(booking.status)}</span>
                                        {getStatusLabel(booking.status)}
                                    </div>
                                </div>

                                <div className="booking-details">
                                    <div className="booking-detail">
                                        <span className="detail-icon">👨‍🔧</span>
                                        <div>
                                            <small>PROVIDER</small>
                                            <strong>
                                                {booking.provider?.name || "Not assigned"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="booking-detail">
                                        <span className="detail-icon">📅</span>
                                        <div>
                                            <small>DATE</small>
                                            <strong>
                                                {formatDate(booking.bookingDate)}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="booking-detail">
                                        <span className="detail-icon">🕐</span>
                                        <div>
                                            <small>TIME</small>
                                            <strong>
                                                {formatTime(booking.bookingTime)}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="booking-detail">
                                        <span className="detail-icon">💰</span>
                                        <div>
                                            <small>PRICE</small>
                                            <strong>
                                                ₹{Number(booking.price ?? 0).toLocaleString("en-IN")}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-address">
                                    <span>📍</span>
                                    <div>
                                        <small>SERVICE ADDRESS</small>
                                        <p>
                                            {booking.address || "Address not available"}
                                        </p>
                                    </div>
                                </div>

                                <div className="booking-card-footer">
                                    <span>SmartHome Services</span>
                                    <strong>
                                        {getStatusIcon(booking.status)}{" "}
                                        {getStatusLabel(booking.status)}
                                    </strong>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="bookings-back-btn"
                    >
                        ← Back to Dashboard
                    </button>
                )}
            </section>

            <section className="bookings-trust">
                <div>
                    <span>🔒</span>
                    <div>
                        <strong>Secure Bookings</strong>
                        <small>Your information is protected</small>
                    </div>
                </div>

                <div>
                    <span>✓</span>
                    <div>
                        <strong>Verified Professionals</strong>
                        <small>Trusted service providers</small>
                    </div>
                </div>

                <div>
                    <span>⭐</span>
                    <div>
                        <strong>Quality Services</strong>
                        <small>Reliable home professionals</small>
                    </div>
                </div>
            </section>

            <footer className="bookings-footer">
                <strong>🏠 SmartHome Services</strong>
                <p>Making home services simple, reliable and convenient.</p>
                <small>© 2026 SmartHome Services</small>
            </footer>
        </div>
    );
}

export default MyBookings;