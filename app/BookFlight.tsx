"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false });

export default function BookFlight({ flight, onBooked, onBack }: { flight: any; onBooked: () => void; onBack: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<any>(null);
    const [error, setError] = useState("");

    async function handleBook() {
        if (!name || !email) {
            setError("Please fill in both name and email");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scheduleId: flight._id,
                    passengerName: name,
                    passengerEmail: email,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Booking failed");
            } else {
                setSuccess(data);
            }
        } catch {
            setError("Network error");
        } finally {
            setSubmitting(false);
        }
    }

    const seatsLeft = flight.aircraft.model.passengerCapacity - (flight.bookings?.length || 0);

    if (success) {
        return (
            <div style={{ backgroundColor: "#e8f5e9", borderRadius: "8px", padding: "32px" }}>
                <h2 style={{ color: "#2e7d32", fontSize: "24px", marginBottom: "16px", textAlign: "center" }}>Booking Confirmed!</h2>

                <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0c1d36", marginBottom: "12px" }}>Booking Invoice</h3>
                    <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.8" }}>
                        <p><strong>Booking Reference:</strong> {success.bookingRef}</p>
                        <p><strong>Passenger:</strong> {success.passengerName}</p>
                        <p><strong>Flight:</strong> {flight.flightNumber}</p>
                        <p><strong>Aircraft:</strong> {flight.aircraft.model.aircraftModel}</p>
                        <p><strong>From:</strong> {flight.origin.name} ({flight.origin.icao})</p>
                        <p><strong>To:</strong> {flight.destination.name} ({flight.destination.icao})</p>
                        <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString("en-NZ", {
                            timeZone: flight.origin.timezone,
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                            hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short",
                        })}</p>
                        <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString("en-NZ", {
                            timeZone: flight.destination.timezone,
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                            hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short",
                        })}</p>
                        <p><strong>Duration:</strong> {flight.durationMinutes} minutes</p>
                        <p style={{ fontSize: "18px", marginTop: "8px" }}><strong>Price:</strong> ${flight.price} NZD</p>
                    </div>
                </div>

                <div style={{ textAlign: "center" }}>
                    <button onClick={onBooked}
                            style={{ backgroundColor: "#0c1d36", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer" }}>
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <button onClick={onBack}
                    style={{ background: "none", border: "none", color: "#132f59", cursor: "pointer", marginBottom: "16px", fontSize: "14px" }}>
                ← Back to search
            </button>

            {/* flight summary */}
            <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>
                    {flight.flightNumber} · {flight.origin.name} → {flight.destination.name}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                    {new Date(flight.departureTime).toLocaleString("en-NZ", {
                        timeZone: flight.origin.timezone,
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZoneName: "short",
                    })} · {flight.durationMinutes} min
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                    Arrives: {new Date(flight.arrivalTime).toLocaleString("en-NZ", {
                    timeZone: flight.destination.timezone,
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZoneName: "short",
                })}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                    {flight.aircraft.model.aircraftModel} · {seatsLeft} seat(s) available
                </div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#0c1d36", marginTop: "12px" }}>
                    ${flight.price} NZD
                </div>
            </div>

            {/* Route map */}
            <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0c1d36", marginBottom: "12px" }}>Route Map</h3>
                <RouteMap origin={flight.origin} destination={flight.destination} />
            </div>

                        {/* passenger form */}
            <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#0c1d36" }}>Passenger Details</h2>

                {error && (
                    <div style={{ backgroundColor: "#fde8e8", color: "#c62828", padding: "10px", borderRadius: "4px", marginBottom: "12px", fontSize: "14px" }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "4px" }}>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                           placeholder="e.g. Jane Smith"
                           style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "4px" }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                           placeholder="e.g. jane@example.com"
                           style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>

                <button onClick={handleBook} disabled={submitting}
                        style={{ width: "100%", backgroundColor: "#d4a843", color: "white", border: "none", padding: "12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
                    {submitting ? "Confirming..." : `Confirm Booking — $${flight.price}`}
                </button>
            </div>
        </div>
    );
}