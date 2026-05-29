"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function RouteMap({ origin, destination }: { origin: any; destination: any }) {
    const centerLat = (origin.lat + destination.lat) / 2;
    let centerLng;
    if (Math.abs(origin.lng - destination.lng) > 180) {
        centerLng = 180;
    } else {
        centerLng = (origin.lng + destination.lng) / 2;
    }

    // Fix polyline for antimeridian crossing
    let polyDestLng = destination.lng;
    if (Math.abs(origin.lng - destination.lng) > 180) {
        polyDestLng = destination.lng + 360;
    }

    return (
        <MapContainer
            key={`${origin.icao}-${destination.icao}`}
            center={[centerLat, centerLng]}
            zoom={5}
            style={{ height: "350px", width: "100%", borderRadius: "4px" }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[origin.lat, origin.lng]} icon={icon}>
                <Popup>{origin.name} ({origin.icao})</Popup>
            </Marker>
            <Marker position={[destination.lat, destination.lng]} icon={icon}>
                <Popup>{destination.name} ({destination.icao})</Popup>
            </Marker>
            <Polyline
                positions={[[origin.lat, origin.lng], [destination.lat, polyDestLng]]}
                color="#0c1d36"
                weight={2}
                dashArray="8 4"
            />
        </MapContainer>
    );
}