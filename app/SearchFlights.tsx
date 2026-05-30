"use client";

import { useState } from "react";

const AIRPORTS = [
    { icao: "NZNE", label: "Dairy Flat (NZNE)" },
    { icao: "YSSY", label: "Sydney (YSSY)" },
    { icao: "NZRO", label: "Rotorua (NZRO)" },
    { icao: "NZGB", label: "Great Barrier Island (NZGB)" },
    { icao: "NZCI", label: "Chatham Islands (NZCI)" },
    { icao: "NZTL", label: "Lake Tekapo (NZTL)" },
];

interface Flight {
    _id: string;
    flightNumber: string;
    aircraft: any;
    origin: any;
    destination: any;
    departureTime: string;
    arrivalTime: string;
    durationMinutes: number;
    price: number;
    bookings: any[];
}

export default function SearchFlights({ onSelectFlight }: {onSelectFlight: (flight: Flight) => void})
{
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [dateMode, setDateMode] = useState<"single" | "range">("single");
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");
    const [results, setResults] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function handleSearch() {
        setLoading(true);
        setSearched(true);

        const params = new URLSearchParams();
        if (origin) params.set("orig", origin);
        if (destination) params.set("dest", destination);
        if (date1) params.set("date1", date1);
        if (date2) params.set("date2", date2);

        try {
            const res = await fetch(`/api/schedules?${params.toString()}`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            {/*search*/}
            <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", marginBottom: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "4px" }}>From</label>
                        <select value={origin} onChange={(e) => setOrigin(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
                            <option value="">Any origin</option>
                            {AIRPORTS.map((a) => <option key={a.icao} value={a.icao}>{a.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "4px" }}>To</label>
                        <select value={destination} onChange={(e) => setDestination(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
                            <option value="">Any destination</option>
                            {AIRPORTS.map((a) => <option key={a.icao} value={a.icao}>{a.label}</option>)}
                        </select>
                    </div>
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                        <label style={{ fontSize: "14px", color: "#666" }}>Date search:</label>
                        <button onClick={() => setDateMode("single")}
                                style={{ padding: "4px 12px", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer",
                                    backgroundColor: dateMode === "single" ? "#0c1d36" : "white",
                                    color: dateMode === "single" ? "white" : "#333" }}>
                            Single date
                        </button>
                        <button onClick={() => setDateMode("range")}
                                style={{ padding: "4px 12px", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer",
                                    backgroundColor: dateMode === "range" ? "#0c1d36" : "white",
                                    color: dateMode === "range" ? "white" : "#333" }}>
                            Date range
                        </button>
                    </div>

                    {dateMode === "single" ? (
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "4px" }}>Date</label>
                            <input type="date" value={date1} onChange={(e) => { setDate1(e.target.value); setDate2(e.target.value); }}
                                   style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "4px" }}>From date</label>
                                <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)}
                                       style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "4px" }}>To date</label>
                                <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)}
                                       style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                            </div>
                        </>
                    )}
                </div>
                <button onClick={handleSearch} disabled={loading}
                        style={{ backgroundColor: "#0c1d36", color: "white", padding: "10px 24px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                    {loading ? "Searching..." : "Search Flights"}
                </button>
            </div>
            {/*search results*/}
            {searched && !loading && results.length === 0 && (
                <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>No flights found.</p>
            )}

            {results.map((f) => {
                const seatsLeft = f.aircraft.model.passengerCapacity - (f.bookings?.length || 0);
                return (
                    <div key={f._id} style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                                {f.flightNumber} · {f.origin.name} → {f.destination.name}
                            </div>
                            <div style={{ fontSize: "13px", color: "#666" }}>
                                {new Date(f.departureTime).toLocaleString("en-NZ", {
                                    timeZone: f.origin.timezone,
                                    weekday: "long",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                    timeZoneName: "short",
                                })} · {f.durationMinutes} min · {f.aircraft.model.aircraftModel}
                            </div>

                            <div style={{ fontSize: "13px", color: "#666" }}>
                                Arrives: {new Date(f.arrivalTime).toLocaleString("en-NZ", {
                                timeZone: f.destination.timezone,
                                weekday: "long",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                                timeZoneName: "short",
                            })}
                            </div>

                            <div style={{ fontSize: "13px", color: seatsLeft <= 2 ? "red" : "#666", marginTop: "2px" }}>
                                {seatsLeft} seat(s) available
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#0c1d36" }}>${f.price}</div>
                            {seatsLeft > 0 ? (
                                <button onClick={() => onSelectFlight(f)}
                                        style={{ marginTop: "8px", backgroundColor: "#d4a843", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                                    Book
                                </button>
                            ) : (
                                <span style={{ color: "#999" }}>Bookings Full</span>
                            )}
                        </div>
                    </div>
                );
            })}

        </div>
    )

}