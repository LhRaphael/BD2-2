import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícones customizados para parecer com o do protótipo
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = createIcon('blue');
const redIcon = createIcon('red'); // Para seleção temporária

// Componente para capturar cliques no mapa
const ClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const EventMap = ({ events, center, onMapClick, onEventClick, tempLocation }) => {
    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Eventos vindos do Mongo (Pins Azuis) */}
            {events.map((evt) => (
                <Marker
                    key={evt.id}
                    position={[evt.localizacao.y, evt.localizacao.x]} // Mongo: [Lng, Lat] -> Leaflet: [Lat, Lng]
                    icon={blueIcon}
                    eventHandlers={{
                        click: () => onEventClick(evt),
                    }}
                />
            ))}

            {/* Local temporário selecionado (Pin Vermelho) */}
            {tempLocation && (
                <Marker position={tempLocation} icon={redIcon} />
            )}

            <ClickHandler onMapClick={onMapClick} />
        </MapContainer>
    );
};

export default EventMap;