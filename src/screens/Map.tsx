import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import 'leaflet/dist/leaflet.css';
import { useParams } from "react-router";
import { useEffect } from "react";

// Helper component to move the camera when coordinates change
function Recenter({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

function Map() {
    const { loc } = useParams()
    const parts = loc ? loc.split(',') : []

    const lat = parts.length > 0 ? parseFloat(parts[0]) : 14.6111512
    const lng = parts.length > 1 ? parseFloat(parts[1]) : 120.9749947
    const zoom = parts.length > 2 ? parseInt(parts[2]) : 13 // Default zoom changed to 13 for better view

    const position: [number, number] = [lat, lng];

    return (
        <MapContainer 
            center={position} 
            zoom={zoom} 
            scrollWheelZoom={true}
            style={{ width: '100%', height: 'calc(100vh - 80px)'}}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    Location: {lat}, {lng}
                </Popup>
            </Marker>
            {/* This tag forces the map to move when you click a new link */}
            <Recenter lat={lat} lng={lng} />
        </MapContainer>
    )
}

export default Map