import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Booking({ service, onBack }) {
    const [providers, setProviders] = useState([]);
    const [providerId, setProviderId] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [address, setAddress] = useState("");
    const [loadingProviders, setLoadingProviders] = useState(true);
    const [providerError, setProviderError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const fetchProviders = async () => {
        setLoadingProviders(true);
        setProviderError("");
        setProviders([]);
        setProviderId("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setProviderError("Please log in again to load service providers.");
                return;
            }

            const response = await axios.get(
                "http://localhost:8080/providers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProviders(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            console.error("Unable to load providers:", error);

            setProviderError(
                error.response?.status === 401 ||
                error.response?.status === 403
                    ? "Your session may have expired. Please log in again."
                    : "Unable to load providers. Please try again."
            );
        } finally {
            setLoadingProviders(false);
        }
    };

    useEffect(() => {
        let active = true;

        const loadProviders = async () => {
            setLoadingProviders(true);
            setProviderError("");
            setProviders([]);
            setProviderId("");

            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Please log in again to load service providers.");
                }

                const response = await axios.get(
                    "http://localhost:8080/providers",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (active) {
                    setProviders(
                        Array.isArray(response.data) ? response.data : []
                    );
                }
            } catch (error) {
                console.error("Unable to load providers:", error);

                if (active) {
                    setProviderError(
                        error.response?.status === 401 ||
                        error.response?.status === 403
                            ? "Your session may have expired. Please log in again."
                            : error.message?.startsWith("Please log in")
                            ? error.message
                            : "Unable to load providers. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoadingProviders(false);
                }
            }
        };

        loadProviders();

        return () => {
            active = false;
        };
    }, [service?.id]);

    const matchingProviders = useMemo(() => {
        const selectedServiceName = (service?.name || "")
            .trim()
            .toLowerCase();

        return providers.filter((provider) => {
            const providerServiceType = (
                provider.serviceType || ""
            ).trim().toLowerCase();

            return (
                providerServiceType !== "" &&
                providerServiceType === selectedServiceName
            );
        });
    }, [providers, service]);

    const convertTo24Hour = (time) => {
        if (!time) return "";

        const match = time.match(/^(\d{1,2}):(\d{2}):(AM|PM)$/);

        if (!match) return "";

        let hour = Number(match[1]);
        const minute = match[2];
        const period = match[3];

        if (hour < 1 || hour > 12 || Number(minute) > 59) {
            return "";
        }

        if (period === "AM" && hour === 12) {
            hour = 0;
        } else if (period === "PM" && hour !== 12) {
            hour += 12;
        }

        return `${String(hour).padStart(2, "0")}:${minute}:00`;
    };

    const getToday = () => {
        const now = new Date();
        const localOffset = now.getTimezoneOffset() * 60000;

        return new Date(now.getTime() - localOffset)
            .toISOString()
            .slice(0, 10);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");

        if (!service?.id) {
            setMessage("Please select a valid service.");
            setMessageType("error");
            return;
        }

        if (bookingDate < getToday()) {
            setMessage("Please select today or a future date.");
            setMessageType("error");
            return;
        }

        const selectedProvider = matchingProviders.find(
            (provider) => String(provider.id) === String(providerId)
        );

        if (!selectedProvider) {
            setMessage("Please select a provider offering this service.");
            setMessageType("error");
            return;
        }

        let user;

        try {
            user = JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            setMessage("Your account details could not be read. Please log in again.");
            setMessageType("error");
            return;
        }

        const token = localStorage.getItem("token");

        if (!user?.id || !token) {
            setMessage("Please log in before booking a service.");
            setMessageType("error");
            return;
        }

        if (!bookingDate || !bookingTime || !address.trim()) {
            setMessage("Please complete all booking details.");
            setMessageType("error");
            return;
        }

        const timeForBackend = convertTo24Hour(bookingTime);

        if (!timeForBackend) {
            setMessage("Please select a valid booking time.");
            setMessageType("error");
            return;
        }

        setSubmitting(true);

        try {
            await axios.post(
                "http://localhost:8080/bookings",
                {
                    customerId: user.id,
                    serviceId: service.id,
                    providerId: Number(providerId),
                    bookingDate,
                    bookingTime: timeForBackend,
                    address: address.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Your booking was created successfully!");
            setMessageType("success");

            setTimeout(() => {
                onBack();
            }, 1200);
        } catch (error) {
            console.error("Booking failed:", error);

            setMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Booking failed. Please check your details and try again."
            );
            setMessageType("error");
        } finally {
            setSubmitting(false);
        }
    };

    const getServiceIcon = (name = "") => {
        const value = name.toLowerCase();

        if (value.includes("plumb")) return "🔧";
        if (value.includes("electric")) return "⚡";
        if (value.includes("clean")) return "🧹";
        if (value.includes("carp")) return "🪚";
        if (value.includes("ac") || value.includes("air condition")) {
            return "❄️";
        }
        if (value.includes("paint")) return "🎨";

        return "🏠";
    };

    return (
        <div className="booking-page">
            <section className="booking-header">
                <div>
                    <span className="booking-label">SERVICE BOOKING</span>

                    <h1>
                        Book your
                        <span> home service.</span>
                    </h1>

                    <p>
                        Choose a professional who offers your selected
                        service, then select a convenient date and time.
                    </p>
                </div>

                <div className="booking-header-icon" aria-hidden="true">
                    📅
                </div>
            </section>

            <section className="booking-content">
                <div className="booking-service-card">
                    <div className="booking-service-icon" aria-hidden="true">
                        {getServiceIcon(service?.name)}
                    </div>

                    <div className="booking-service-info">
                        <span>SELECTED SERVICE</span>
                        <h2>{service?.name || "Home Service"}</h2>
                        <p>
                            {service?.description ||
                                "Professional home service by trusted providers."}
                        </p>
                    </div>

                    <div className="booking-price">
                        <small>Starting from</small>
                        <strong>
                            ₹{Number(service?.basePrice ?? 0).toLocaleString("en-IN")}
                        </strong>
                    </div>
                </div>

                <div className="booking-form-card">
                    <div className="booking-form-heading">
                        <span>BOOKING DETAILS</span>
                        <h2>Schedule your service</h2>
                        <p>
                            Select a matching provider and enter your
                            booking details below.
                        </p>
                    </div>

                    {message && (
                        <div
                            className={`booking-feedback booking-feedback-${messageType}`}
                            role={messageType === "error" ? "alert" : "status"}
                            aria-live="polite"
                        >
                            <span>
                                {messageType === "success" ? "✓" : "⚠️"}
                            </span>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleBooking}>
                        <div className="booking-field">
                            <label htmlFor="provider">
                                Select {service?.name || "Service"} Provider
                            </label>

                            <select
                                id="provider"
                                value={providerId}
                                onChange={(e) => {
                                    setProviderId(e.target.value);
                                    setMessage("");
                                }}
                                required
                                disabled={
                                    loadingProviders ||
                                    !!providerError ||
                                    matchingProviders.length === 0 ||
                                    submitting
                                }
                            >
                                <option value="">
                                    {loadingProviders
                                        ? "Loading providers..."
                                        : providerError
                                        ? "Providers unavailable"
                                        : matchingProviders.length === 0
                                        ? `No providers offer ${service?.name || "this service"}`
                                        : "Choose a service provider"}
                                </option>

                                {matchingProviders.map((provider) => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.name} - ⭐ {provider.rating ?? 0}
                                        {provider.serviceArea
                                            ? ` - ${provider.serviceArea}`
                                            : ""}
                                    </option>
                                ))}
                            </select>

                            {providerError ? (
                                <small role="alert">{providerError}</small>
                            ) : loadingProviders ? (
                                <small>Finding matching professionals...</small>
                            ) : matchingProviders.length === 0 ? (
                                <small>
                                    No providers are registered for this
                                    service yet. Please try another service
                                    or register a matching provider.
                                </small>
                            ) : (
                                <small>
                                    Showing {matchingProviders.length} provider(s)
                                    offering {service?.name}.
                                </small>
                            )}

                            {providerError && (
                                <button
                                    type="button"
                                    className="services-refresh"
                                    onClick={fetchProviders}
                                    disabled={loadingProviders}
                                >
                                    {loadingProviders ? "Loading..." : "Retry"}
                                </button>
                            )}
                        </div>

                        <div className="booking-row">
                            <div className="booking-field">
                                <label htmlFor="bookingDate">Booking Date</label>

                                <input
                                    id="bookingDate"
                                    type="date"
                                    min={getToday()}
                                    value={bookingDate}
                                    onChange={(e) => {
                                        setBookingDate(e.target.value);
                                        setMessage("");
                                    }}
                                    required
                                    disabled={submitting}
                                />

                                <small>Select your preferred service date.</small>
                            </div>

                            <div className="booking-field">
                                <label htmlFor="bookingTime">Booking Time</label>

                                <select
                                    id="bookingTime"
                                    value={bookingTime}
                                    onChange={(e) => {
                                        setBookingTime(e.target.value);
                                        setMessage("");
                                    }}
                                    required
                                    disabled={submitting}
                                >
                                    <option value="">Select time</option>
                                    <option value="09:00:AM">09:00 AM</option>
                                    <option value="10:00:AM">10:00 AM</option>
                                    <option value="11:00:AM">11:00 AM</option>
                                    <option value="12:00:PM">12:00 PM</option>
                                    <option value="01:00:PM">01:00 PM</option>
                                    <option value="02:00:PM">02:00 PM</option>
                                    <option value="03:00:PM">03:00 PM</option>
                                    <option value="04:00:PM">04:00 PM</option>
                                    <option value="05:00:PM">05:00 PM</option>
                                    <option value="06:00:PM">06:00 PM</option>
                                    <option value="07:00:PM">07:00 PM</option>
                                    <option value="08:00:PM">08:00 PM</option>
                                </select>

                                <small>Select a convenient time.</small>
                            </div>
                        </div>

                        <div className="booking-field">
                            <label htmlFor="address">Service Address</label>

                            <textarea
                                id="address"
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                    setMessage("");
                                }}
                                placeholder="Enter the complete address where the service is required"
                                rows="4"
                                required
                                disabled={submitting}
                            />

                            <small>
                                Provide the location where the professional
                                should visit.
                            </small>
                        </div>

                        <div className="booking-note">
                            <span aria-hidden="true">🔒</span>
                            <div>
                                <strong>Secure Booking</strong>
                                <p>
                                    Your booking details will be submitted
                                    securely to the service platform.
                                </p>
                            </div>
                        </div>

                        <div className="booking-buttons">
                            <button
                                type="button"
                                className="booking-back-btn"
                                onClick={onBack}
                                disabled={submitting}
                            >
                                ← Back to Services
                            </button>

                            <button
                                type="submit"
                                className="booking-confirm-btn"
                                disabled={
                                    submitting ||
                                    loadingProviders ||
                                    !!providerError ||
                                    matchingProviders.length === 0
                                }
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Confirm Booking →"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="booking-trust">
                <div>
                    <span>✓</span>
                    <strong>Service Matching</strong>
                    <small>Providers for your selected service</small>
                </div>

                <div>
                    <span>⭐</span>
                    <strong>Rated Professionals</strong>
                    <small>Compare provider ratings</small>
                </div>

                <div>
                    <span>🔒</span>
                    <strong>Secure Booking</strong>
                    <small>Your information is protected</small>
                </div>
            </section>
        </div>
    );
}

export default Booking;