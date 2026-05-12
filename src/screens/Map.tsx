import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import 'leaflet/dist/leaflet.css';

function Recenter({ lat, lng, zoom }: { lat: number, lng: number, zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], zoom);
    }, [lat, lng, zoom, map]);
    return null;
}

function Map() {
    const { loc } = useParams()
    const parts = loc ? loc.split(',') : []

    const lat = parts.length > 0 ? parseFloat(parts[0]) : 14.6111512
    const lng = parts.length > 1 ? parseFloat(parts[1]) : 120.9749947
    const zoom = parts.length > 2 ? parseInt(parts[2]) : 13
    const position: [number, number] = [lat, lng]
    const mapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`

    return (
        <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                    <Box>
                        <Chip icon={<LocationOnIcon />} label="Memory map" color="primary" sx={{ mb: 1.5 }} />
                        <Typography variant="h4">Diary Location</Typography>
                        <Typography color="text.secondary">
                            View saved coordinates from diary entries and inspect the surrounding area.
                        </Typography>
                    </Box>
                    <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Typography variant="body2" color="text.secondary">Coordinates</Typography>
                        <Typography fontWeight={800}>{lat.toFixed(6)}, {lng.toFixed(6)}</Typography>
                        <Button
                            component="a"
                            href={mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            variant="outlined"
                            endIcon={<OpenInNewIcon />}
                        >
                            Open map
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: { xs: '62vh', md: '68vh' },
                    minHeight: 420,
                }}
            >
                <MapContainer
                    center={position}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    style={{ width: '100%', height: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            Location: {lat.toFixed(6)}, {lng.toFixed(6)}
                        </Popup>
                    </Marker>
                    <Recenter lat={lat} lng={lng} zoom={zoom} />
                </MapContainer>
            </Paper>
        </Stack>
    )
}

export default Map
