import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

function Providers() {
    const [providers, setProviders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please log in to view service providers.");
            setLoading(false);
            return;
        }

        axios.get(`${API_URL}/providers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setProviders(response.data);
            setError("");
        })
        .catch((error) => {
            console.error("Error loading providers:", error);
            setError("Unable to load service providers. Please try again.");
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div>
            <h2>Available Service Providers</h2>

            {loading && <p>Loading service providers...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && providers.length === 0 && (
                <p>No service providers are available yet.</p>
            )}

            {providers.map((provider) => (
                <div key={provider.id}>
                    <h3>{provider.name}</h3>

                    <p>
                        Service Type: {provider.serviceType || "Not specified"}
                    </p>

                    <p>
                        Experience: {provider.experience ?? 0} years
                    </p>

                    <p>
                        Rating: {provider.rating ?? 0} / 5
                    </p>

                    <p>
                        Phone: {provider.phone || "Not available"}
                    </p>

                    <p>
                        Service Area: {provider.serviceArea || "Not specified"}
                    </p>

                    <p>
                        Verified: {provider.verified ? "Yes" : "No"}
                    </p>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Providers;