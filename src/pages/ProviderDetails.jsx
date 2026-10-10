import { useState } from "react";
import axios from "axios";

function ProviderDetails({ onComplete }) {

    const [serviceType, setServiceType] = useState("");
    const [experience, setExperience] = useState("");
    const [serviceArea, setServiceArea] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [description, setDescription] = useState("");
    const [availability, setAvailability] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            // Get registered provider details
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user) {
                alert("User information not found. Please login again.");
                return;
            }

            const providerData = {
                name: user.name,
                email: user.email,
                phone: user.phone,

                experience: experience,
                rating: 0,
                verified: false,

                serviceType: serviceType,
                serviceArea: serviceArea,
                basePrice: Number(basePrice),
                description: description,
                availability: availability
            };

            console.log("Provider Data:", providerData);

            const token = localStorage.getItem("token");

const response = await axios.post(
    "http://localhost:8080/providers",
    providerData,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

            console.log("Provider saved:", response.data);

            alert("Provider details saved successfully!");

            onComplete();

        } catch (error) {

            console.log("Provider save error:", error);

            if (error.response) {
                alert(
                    "Failed to save provider details: " +
                    (error.response.data?.message || "Server error")
                );
            } else {
                alert("Failed to connect to backend.");
            }
        }
    };

    return (
        <div className="provider-details-page">

            <div className="provider-details-card">

                <div className="provider-details-icon">
                    👨‍🔧
                </div>

                <h1>
                    Complete Your Provider Profile
                </h1>

                <p className="provider-details-subtitle">
                    Tell customers about your services and experience.
                </p>


                <form onSubmit={handleSubmit}>

                    {/* SERVICE TYPE */}

                    <div className="provider-input-group">

                        <label>
                            Service Type
                        </label>

                        <select
                            value={serviceType}
                            onChange={(e) =>
                                setServiceType(e.target.value)
                            }
                            required
                        >
                            <option value="">
                                Select your service
                            </option>

                            <option value="Plumbing">
                                🔧 Plumbing
                            </option>

                            <option value="Electrical Repair">
                                ⚡ Electrical Repair
                            </option>

                            <option value="Cleaning">
                                🧹 Cleaning
                            </option>

                            <option value="AC Repair">
                                ❄️ AC Repair
                            </option>

                            <option value="Carpentry">
                                🪚 Carpentry
                            </option>

                            <option value="Painting">
                                🎨 Painting
                            </option>

                        </select>

                    </div>


                    {/* EXPERIENCE */}

                    <div className="provider-input-group">

                        <label>
                            Years of Experience
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="Example: 5"
                            value={experience}
                            onChange={(e) =>
                                setExperience(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* SERVICE AREA */}

                    <div className="provider-input-group">

                        <label>
                            Service Area
                        </label>

                        <input
                            type="text"
                            placeholder="Example: Hyderabad"
                            value={serviceArea}
                            onChange={(e) =>
                                setServiceArea(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* BASE PRICE */}

                    <div className="provider-input-group">

                        <label>
                            Base Price (₹)
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="Example: 500"
                            value={basePrice}
                            onChange={(e) =>
                                setBasePrice(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="provider-input-group">

                        <label>
                            Service Description
                        </label>

                        <textarea
                            placeholder="Describe the services you provide..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows="4"
                            required
                        />

                    </div>


                    {/* AVAILABILITY */}

                    <div className="provider-input-group">

                        <label>
                            Availability
                        </label>

                        <select
                            value={availability}
                            onChange={(e) =>
                                setAvailability(e.target.value)
                            }
                            required
                        >

                            <option value="">
                                Select availability
                            </option>

                            <option value="Monday - Friday">
                                Monday - Friday
                            </option>

                            <option value="Monday - Saturday">
                                Monday - Saturday
                            </option>

                            <option value="All Days">
                                All Days
                            </option>

                        </select>

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="provider-details-submit"
                    >
                        Save Provider Details →
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ProviderDetails;