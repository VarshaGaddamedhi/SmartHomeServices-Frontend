import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API_URL from "../api";

function Services({ onBookService }) {
    const [services, setServices] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const fetchServices = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Your session may have expired. Please log in again.");
                return;
            }

            const response = await axios.get(
                `${API_URL}/services`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!Array.isArray(response.data)) {
                setError("The services response was invalid. Please try again.");
                return;
            }

            setServices(response.data);
        } catch (err) {
            console.error("Unable to load services:", err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("Your session may have expired. Please log in again.");
            } else {
                setError("Unable to load services. Check your connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const getServiceIcon = (name = "") => {
        const value = name.toLowerCase();

        if (value.includes("plumb")) return "🔧";
        if (value.includes("electric")) return "⚡";
        if (value.includes("clean")) return "🧹";
        if (value.includes("carp")) return "🪚";
        if (value.includes("ac") || value.includes("air condition")) return "❄️";
        if (value.includes("paint")) return "🎨";

        return "🏠";
    };

    const categories = useMemo(
        () => [
            "All",
            "Plumbing",
            "Electrical Repair",
            "Cleaning",
            "Carpentry",
            "AC Repair",
            "Painting"
        ],
        []
    );

    const filteredServices = useMemo(() => {
        const query = search.trim().toLowerCase();

        return services.filter((service) => {
            const name = (service.name || "").toLowerCase();
            const description = (service.description || "").toLowerCase();

            const matchesSearch =
                name.includes(query) || description.includes(query);

            const matchesCategory =
                selectedCategory === "All" ||
                name === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [services, search, selectedCategory]);

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("All");
    };

    const handleBookService = (service) => {
        if (typeof onBookService === "function") {
            onBookService(service);
        }
    };

    return (
        <div className="services-page">
            <section className="services-header">
                <div>
                    <span className="services-label">
                        SMART HOME SERVICES
                    </span>

                    <h1>
                        Find the right
                        <br />
                        <span>service for your home.</span>
                    </h1>

                    <p>
                        Discover home services, compare starting prices,
                        and book a service that fits your needs.
                    </p>
                </div>

                <div className="services-header-icon" aria-hidden="true">
                    🏠
                </div>
            </section>

            <section className="services-content">
                <div className="services-title">
                    <div>
                        <span>AVAILABLE SERVICES</span>
                        <h2>What do you need help with?</h2>
                    </div>

                    <div className="service-count" aria-live="polite">
                        {filteredServices.length}{" "}
                        {filteredServices.length === 1 ? "Service" : "Services"}
                    </div>
                </div>

                <div className="services-toolbar">
                    <div className="services-search">
                        <span aria-hidden="true">🔍</span>

                        <input
                            type="search"
                            placeholder="Search plumbing, cleaning..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search services"
                        />

                        {search && (
                            <button
                                type="button"
                                className="services-clear"
                                onClick={() => setSearch("")}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        className="services-refresh"
                        onClick={fetchServices}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "↻ Refresh"}
                    </button>
                </div>

                <div className="services-filters">
                    {categories.map((category) => (
                        <button
                            type="button"
                            key={category}
                            className={`services-filter ${
                                selectedCategory === category ? "active" : ""
                            }`}
                            onClick={() => setSelectedCategory(category)}
                            aria-pressed={selectedCategory === category}
                        >
                            {category === "All" ? "All Services" : category}
                        </button>
                    ))}

                    {(search || selectedCategory !== "All") && (
                        <button
                            type="button"
                            className="services-filter"
                            onClick={clearFilters}
                        >
                            Clear Filters ✕
                        </button>
                    )}
                </div>

                {error && (
                    <div className="services-error" role="alert">
                        <span>⚠️ {error}</span>

                        <button
                            type="button"
                            onClick={fetchServices}
                            disabled={loading}
                        >
                            {loading ? "Trying again..." : "Try again"}
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="services-empty" role="status">
                        <div aria-hidden="true">⏳</div>
                        <h3>Finding services for you...</h3>
                        <p>Please wait while we load available services.</p>
                    </div>
                )}

                {!loading && !error && services.length === 0 && (
                    <div className="services-empty">
                        <div aria-hidden="true">🏠</div>
                        <h3>No services available yet</h3>
                        <p>Please check back later.</p>

                        <button
                            type="button"
                            className="service-book-btn"
                            onClick={fetchServices}
                        >
                            Refresh Services
                        </button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    services.length > 0 &&
                    filteredServices.length === 0 && (
                        <div className="services-empty">
                            <div aria-hidden="true">🔎</div>
                            <h3>No matching services</h3>
                            <p>
                                Try another search or select a different
                                category.
                            </p>

                            <button
                                type="button"
                                className="service-book-btn"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                {!loading && !error && filteredServices.length > 0 && (
                    <div className="services-grid">
                        {filteredServices.map((service) => (
                            <article
                                className="service-card"
                                key={service.id}
                            >
                                <div className="service-card-top">
                                    <div
                                        className="service-main-icon"
                                        aria-hidden="true"
                                    >
                                        {getServiceIcon(service.name)}
                                    </div>

                                    <span className="service-status">
                                        Available
                                    </span>
                                </div>

                                <h3>{service.name}</h3>

                                <p className="service-description">
                                    {service.description ||
                                        "Professional home service from our service catalogue."}
                                </p>

                                <div className="service-price">
                                    <div>
                                        <small>Starting from</small>

                                        <strong>
                                            ₹
                                            {Number(
                                                service.basePrice ?? 0
                                            ).toLocaleString("en-IN")}
                                        </strong>
                                        <small> per service</small>
                                    </div>

                                    <span aria-hidden="true">💰</span>
                                </div>

                                <button
                                    type="button"
                                    className="service-book-btn"
                                    onClick={() => handleBookService(service)}
                                >
                                    Book This Service →
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="services-trust">
                <div className="services-trust-item">
                    <span aria-hidden="true">✓</span>

                    <div>
                        <strong>Trusted Professionals</strong>
                        <small>Explore available providers</small>
                    </div>
                </div>

                <div className="services-trust-item">
                    <span aria-hidden="true">⚡</span>

                    <div>
                        <strong>Quick Booking</strong>
                        <small>A simple booking process</small>
                    </div>
                </div>

                <div className="services-trust-item">
                    <span aria-hidden="true">🔒</span>

                    <div>
                        <strong>Secure Platform</strong>
                        <small>Authentication-protected access</small>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;