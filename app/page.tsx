"use client";

import { useState } from "react";
import SearchFlights from "./SearchFlights";
import BookFlight from "./BookFlight";
import MyBookings from "./MyBookings";

export default function Home() {
  const [activeTab, setActiveTab] = useState("search");
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  function handleSelectFlight(flight: any) {
    setSelectedFlight(flight);
    setActiveTab("book");
  }

  return (
    <div style={{ backgroundColor: "#f2f2e4", minHeight: "100vh" }}>
      {/*header*/}
      <header style={{ backgroundColor: "#0b264d", color: "white", padding: "16px"}}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Dairy Flat Airlines</h1>
        <p style={{ color: "#aaa", marginTop: "4px" }}>Light jet service based at Dairy Flat Airport</p>
    </header>
      {/*tabs*/}
      <nav style={{ backgroundColor: "#0b264d", display: "flex", gap: "0px"}}>
        {["search", "my bookings"].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{padding: "12px 24px",
                color: activeTab === tab ? "white" : "#888",
                backgroundColor: activeTab === tab ? "#1a3a5c" : "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: activeTab === tab ? "bold" : "normal",}}
            >
              {tab === "search" ? "Search Flights" : "My Bookings"}
            </button>))}
      </nav>

      {/* content */}
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        {activeTab === "search" && (
            <SearchFlights onSelectFlight={handleSelectFlight} />
        )}
        {activeTab === "book" && selectedFlight && (
            <BookFlight
                flight={selectedFlight}
                onBooked={() => { setActiveTab("search"); setSelectedFlight(null); }}
                onBack={() => setActiveTab("search")}
            />
        )}
        {activeTab === "my bookings" && (
            <MyBookings />
        )}
      </main>
    </div>
  );
}
