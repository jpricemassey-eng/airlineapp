"use client";

import  { useState } from "react";

export default function MyBookings()
{
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    async function handleLookup()
    {
        if (!email) return;
        setLoading(true);
        setSearched(true);

        try {
            const res = await fetch(`/api/passengers?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch {
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel(scheduleId: string, bookingId: string)
    {
        if (!confirm("Are you sure you want to cancel the booking?")) return;

        setCancellingId(bookingId);
        try {
            const res = await fetch(
                `/api/bookings?scheduleId=${scheduleId}&bookingId=${bookingId}`,
                { method: "DELETE" }
            );
            if (res.ok) {
                setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
            } else {
                alert("Failed to cancel booking");
            }
        } catch {
            alert("Network error");
        } finally {
            setCancellingId(null);
        }
    }

    return (
        <div>
            {/* Email lookup */}
            <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", marginBottom: "24px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "4px" }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                           placeholder="Enter an email for the booking"
                           style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>
                <button onClick={handleLookup} disabled={loading}
                        style={{ backgroundColor: "#0c1d36", color: "white", padding: "10px 24px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                    {loading ? "~Loading~" : "Look Up"}
                </button>
            </div>

            {/* Results */}
            {searched && !loading && bookings.length === 0 && (
                <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>No bookings found for this email.</p>
            )}

            {bookings.filter((b) => b !== null).map((b) => (
                <div key={b.bookingId}
                     style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                            {b.flightNumber} · {b.origin.name} → {b.destination.name}
                        </div>
                        <div style={{ fontSize: "13px", color: "#666" }}>
                            {new Date(b.departureTime).toLocaleString("en-NZ", {
                                weekday: "long",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })} · {b.durationMinutes} min
                        </div>
                        <div style={{ fontSize: "13px", color: "#666" }}>
                            Passenger: {b.passengerName}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "bold", color: "#0c1d36", marginBottom: "8px" }}>${b.price}</div>
                        <button onClick={() => handleCancel(b.scheduleId, b.bookingId)}
                                disabled={cancellingId === b.bookingId}
                                style={{ color: "#c62828", backgroundColor: "transparent", border: "1px solid #c62828", padding: "6px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>
                            {cancellingId === b.bookingId ? "~Cancelling~" : "Cancel"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );


}