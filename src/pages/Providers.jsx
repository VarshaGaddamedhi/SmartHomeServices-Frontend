import { useEffect, useState } from "react";
import axios from "axios";

function Providers() {

    const [providers, setProviders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        axios.get(
            "http://localhost:8080/providers",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            setProviders(response.data);
        })
        .catch((error) => {
            console.log(error);
            setError("Unable to load service providers");
        });

    }, []);

    return (
        <div>

            <h2>Available Service Providers</h2>

            {error && <p>{error}</p>}

            {providers.map((provider) => (

                <div key={provider.id}>

                    <h3>{provider.name}</h3>

                    <p>
                        Experience: {provider.experience}
                    </p>

                    <p>
                        Rating: {provider.rating}
                    </p>

                    <p>
                        Phone: {provider.phone}
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