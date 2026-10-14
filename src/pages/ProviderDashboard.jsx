import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

function ProviderDashboard() {
    const [bookings, setBookings] = useState([]);
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [providerLoading, setProviderLoading] = useState(true);
    const [updatingBooking, setUpdatingBooking] = useState(null);
    const [error, setError] = useState("");
    const [profileError, setProfileError] = useState("");

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        user = null;
    }

    const token = localStorage.getItem("token");

    useEffect(() => {
        let active = true;

        const fetchBookings = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/bookings`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const providerBookings = response.data.filter(
                    (booking) =>
                        (
                            booking.provider?.email &&
                            user?.email &&
                            booking.provider.email.toLowerCase() === user.email.toLowerCase()
                        ) ||
                        (
                            booking.provider?.id != null &&
                            user?.id != null &&
                            String(booking.provider.id) === String(user.id)
                        )
                );

                if (active) {
                    setBookings(providerBookings);
                    setError("");
                }
            } catch (err) {
                console.error("Error fetching provider bookings:", err);

                if (active) {
                    setError("Unable to load your booking requests. Please try again.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        const fetchProvider = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/providers`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const currentProvider = response.data.find(
                    (item) =>
                        item.email?.toLowerCase() === user?.email?.toLowerCase()
                );

                if (active) {
                    setProvider(currentProvider || null);
                    setProfileError("");
                }
            } catch (err) {
                console.error("Error fetching provider profile:", err);

                if (active) {
                    setProfileError("Unable to load provider profile.");
                }
            } finally {
                if (active) setProviderLoading(false);
            }
        };

        if (!token || !user) {
            setError("Please log in to view your provider dashboard.");
            setProfileError("Please log in to view your profile.");
            setLoading(false);
            setProviderLoading(false);
        } else {
            fetchBookings();
            fetchProvider();
        }

        return () => {
            active = false;
        };
    }, [token, user?.id, user?.email]);

    const updateBookingStatus = async (bookingId, status) => {
        try {
            setUpdatingBooking(bookingId);
            setError("");

            await axios.put(
                `${API_URL}/bookings/${bookingId}/status`,
                null,
                {
                    params: { status },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    String(booking.id) === String(bookingId)
                        ? { ...booking, status }
                        : booking
                )
            );
        } catch (err) {
            console.error("Error updating booking:", err);
            setError(
                err.response?.data?.message ||
                "Unable to update booking status. Please try again."
            );
        } finally {
            setUpdatingBooking(null);
        }
    };

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

    const formatTime = (time) => {
        if (!time) return "Not specified";

        const match = String(time).match(/^(\d{1,2}):(\d{2})/);

        if (!match) return "Not specified";

        const hours = Number(match[1]);
        const minutes = match[2];

        if (hours < 0 || hours > 23) return "Not specified";

        const period = hours >= 12 ? "PM" : "AM";
        const hour12 = hours % 12 || 12;

        return `${hour12}:${minutes} ${period}`;
    };

    const formatDate = (date) => {
        if (!date) return "Not specified";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "Not specified";

        return parsedDate.toLocaleDateString("en-IN", {
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

    const getServiceIcon = (name) => {
        const serviceName = name?.toLowerCase() || "";

        if (serviceName.includes("plumb")) return "🔧";
        if (serviceName.includes("electric")) return "⚡";
        if (serviceName.includes("clean")) return "🧹";
        if (serviceName.includes("carp")) return "🪚";
        if (serviceName.includes("air condition") || serviceName.includes("ac repair")) return "❄️";
        if (serviceName.includes("paint")) return "🎨";

        return "🏠";
    };

    const getStatusLabel = (status) => {
        if (!status) return "Unknown";

        return status
            .toLowerCase()
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getActionLabel = (status) => {
        switch (status) {
            case "ACCEPTED":
                return "▶ Start Service";
            case "INPROGRESS":
                return "✓ Complete Service";
            default:
                return "";
        }
    };

    return (
        <div className="provider-dashboard">
            <nav className="provider-navbar">
                <div className="provider-logo">
                    🏠 SmartHome Services
                </div>

                <div className="provider-user">
                    <div className="provider-avatar">
                        {(user?.name || "P").charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <strong>{user?.name || "Provider"}</strong>
                        <span>Service Provider</span>
                    </div>
                </div>
            </nav>

            <main>
                <section className="provider-welcome">
                    <div>
                        <span className="provider-welcome-tag">
                            PROFESSIONAL WORKSPACE
                        </span>

                        <h1>
                            Welcome back, {user?.name || "Provider"}!
                        </h1>

                        <p>
                            Manage customer requests, monitor your service activity,
                            and keep track of your home service appointments.
                        </p>
                    </div>

                    <div className="provider-welcome-icon">🧰</div>
                </section>

                <section className="provider-profile-section">
                    <div className="provider-section-heading">
                        <div>
                            <span className="provider-section-label">MY PROFILE</span>
                            <h2>Provider Information</h2>
                        </div>
                    </div>

                    {providerLoading ? (
                        <div className="provider-profile-loading">
                            <div className="provider-profile-loader">⏳</div>
                            <p>Loading provider profile...</p>
                        </div>
                    ) : profileError ? (
                        <div className="provider-profile-empty">
                            <div>⚠️</div>
                            <h3>Profile unavailable</h3>
                            <p>{profileError}</p>
                        </div>
                    ) : provider ? (
                        <div className="provider-profile-card">
                            <div className="provider-profile-header">
                                <div className="provider-profile-avatar">
                                    {(provider.name || "P").charAt(0).toUpperCase()}
                                </div>

                                <div className="provider-profile-title">
                                    <h2>{provider.name || user?.name || "Provider"}</h2>
                                    <p>{provider.serviceType || "Home Service Professional"}</p>

                                    <div className="provider-profile-verification">
                                        {provider.verified ? (
                                            <span className="provider-verified">
                                                ✓ Verified Provider
                                            </span>
                                        ) : (
                                            <span className="provider-not-verified">
                                                Verification Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="provider-profile-details">
                                <div className="provider-profile-item">
                                    <span className="provider-profile-label">🔧 Service Type</span>
                                    <strong>{provider.serviceType || "Not specified"}</strong>
                                </div>

                                <div className="provider-profile-item">
                                    <span className="provider-profile-label">🏆 Experience</span>
                                    <strong>
                                        {provider.experience != null
                                            ? `${provider.experience} years`
                                            : "Not specified"}
                                    </strong>
                                </div>

                                <div className="provider-profile-item">
                                    <span className="provider-profile-label">⭐ Rating</span>
                                    <strong>{provider.rating ?? 0} / 5</strong>
                                </div>

                                <div className="provider-profile-item">
                                    <span className="provider-profile-label">📍 Service Area</span>
                                    <strong>{provider.serviceArea || "Not specified"}</strong>
                                </div>

                                <div className="provider-profile-item">
                                    <span className="provider-profile-label">💰 Base Price</span>
                                    <strong>
                                        ₹{Number(provider.basePrice ?? 0).toLocaleString("en-IN")}
                                    </strong>
                                </div>

                                <div className="provider-profile-item">
                                    <span className="provider-profile-label">📧 Email</span>
                                    <strong>{provider.email || user?.email || "Not available"}</strong>
                                </div>

                                <div className="provider-profile-item">
                                    <span className="provider-profile-label">📞 Phone</span>
                                    <strong>{provider.phone || user?.phone || "Not available"}</strong>
                                </div>

                                <div className="provider-profile-item">
                                    <span className="provider-profile-label">🟢 Availability</span>
                                    <strong>{provider.availability || "Not specified"}</strong>
                                </div>
                            </div>

                            <div className="provider-profile-description">
                                <span className="provider-profile-label">📝 About My Service</span>
                                <p>
                                    {provider.description ||
                                        "No service description has been added yet."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="provider-profile-empty">
                            <div>👨‍🔧</div>
                            <h3>Provider profile not found</h3>
                            <p>Please complete your provider profile details.</p>
                        </div>
                    )}
                </section>

                <section className="provider-stat-grid">
                    <div className="provider-stat-card">
                        <div className="provider-stat-icon blue">📋</div>
                        <div>
                            <span>Total Bookings</span>
                            <h2>{loading ? "..." : totalBookings}</h2>
                        </div>
                    </div>

                    <div className="provider-stat-card">
                        <div className="provider-stat-icon orange">⏳</div>
                        <div>
                            <span>Pending Requests</span>
                            <h2>{loading ? "..." : pendingBookings}</h2>
                        </div>
                    </div>

                    <div className="provider-stat-card">
                        <div className="provider-stat-icon green">✓</div>
                        <div>
                            <span>Accepted Bookings</span>
                            <h2>{loading ? "..." : acceptedBookings}</h2>
                        </div>
                    </div>

                    <div className="provider-stat-card">
                        <div className="provider-stat-icon purple">⭐</div>
                        <div>
                            <span>Completed Services</span>
                            <h2>{loading ? "..." : completedBookings}</h2>
                        </div>
                    </div>
                </section>

                <section className="provider-bookings-section">
                    <div className="provider-section-heading">
                        <div>
                            <span className="provider-section-label">SERVICE REQUESTS</span>
                            <h2>Booking Management</h2>
                        </div>

                        <span className="provider-booking-count">
                            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
                        </span>
                    </div>

                    {error && (
                        <div className="provider-booking-error" role="alert">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="provider-empty-state">
                            <div className="provider-empty-icon">⏳</div>
                            <h3>Loading bookings...</h3>
                            <p>Please wait while we load your service requests.</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="provider-empty-state">
                            <div className="provider-empty-icon">📭</div>
                            <h3>No booking requests yet</h3>
                            <p>New customer requests assigned to you will appear here.</p>
                        </div>
                    ) : (
                        <div className="provider-booking-list">
                            {bookings.map((booking) => (
                                <article className="provider-booking-card" key={booking.id}>
                                    <div className="provider-booking-main">
                                        <div className="provider-booking-service">
                                            <div className="provider-service-icon">
                                                {getServiceIcon(booking.service?.name)}
                                            </div>

                                            <div>
                                                <h3>{booking.service?.name || "Home Service"}</h3>
                                                <p>Booking #{booking.id}</p>
                                            </div>
                                        </div>

                                        <div className="provider-booking-details">
                                            <div>
                                                <span>Customer</span>
                                                <strong>{booking.customer?.name || "Customer"}</strong>
                                            </div>

                                            <div>
                                                <span>Date</span>
                                                <strong>{formatDate(booking.bookingDate)}</strong>
                                            </div>

                                            <div>
                                                <span>Time</span>
                                                <strong>{formatTime(booking.bookingTime)}</strong>
                                            </div>

                                            <div>
                                                <span>Address</span>
                                                <strong>{booking.address || "Not specified"}</strong>
                                            </div>

                                            <div>
                                                <span>Service Price</span>
                                                <strong>
                                                    ₹{Number(booking.price ?? 0).toLocaleString("en-IN")}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="provider-booking-actions">
                                        <span className={`provider-status ${getStatusClass(booking.status)}`}>
                                            {getStatusLabel(booking.status)}
                                        </span>

                                        {booking.status?.toUpperCase() === "PENDING" && (
                                            <div className="provider-request-buttons">
                                                <button
                                                    type="button"
                                                    className="provider-accept-button"
                                                    onClick={() => updateBookingStatus(booking.id, "ACCEPTED")}
                                                    disabled={updatingBooking === booking.id}
                                                >
                                                    {updatingBooking === booking.id ? "Updating..." : "✓ Accept"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="provider-reject-button"
                                                    onClick={() => updateBookingStatus(booking.id, "REJECTED")}
                                                    disabled={updatingBooking === booking.id}
                                                >
                                                    {updatingBooking === booking.id ? "Updating..." : "✕ Reject"}
                                                </button>
                                            </div>
                                        )}

                                        {["ACCEPTED", "INPROGRESS"].includes(
                                            booking.status?.toUpperCase()
                                        ) && (
                                            <button
                                                type="button"
                                                className="provider-accept-button"
                                                onClick={() =>
                                                    updateBookingStatus(
                                                        booking.id,
                                                        booking.status.toUpperCase() === "ACCEPTED"
                                                            ? "INPROGRESS"
                                                            : "COMPLETED"
                                                    )
                                                }
                                                disabled={updatingBooking === booking.id}
                                            >
                                                {updatingBooking === booking.id
                                                    ? "Updating..."
                                                    : getActionLabel(booking.status.toUpperCase())}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="provider-status-card">
                    <div className="provider-status-left">
                        <div className="provider-status-dot"></div>
                        <div>
                            <h3>Provider Account Status</h3>
                            <p>
                                {provider?.verified
                                    ? "Your provider profile is verified."
                                    : "Your provider verification is pending."}
                            </p>
                        </div>
                    </div>

                    <span className={`provider-online-badge ${provider?.verified ? "" : "provider-pending-badge"}`}>
                        {provider?.verified ? "✓ Verified" : "● Pending Verification"}
                    </span>
                </section>
            </main>

            <footer className="provider-footer">
                <strong>🏠 SmartHome Services</strong>
                <p>Reliable service. Better homes.</p>
                <small>© 2026 SmartHome Services</small>
            </footer>
        </div>
    );
}

export default ProviderDashboard;