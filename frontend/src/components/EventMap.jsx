import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícones customizados
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = createIcon('blue');
const redIcon = createIcon('red');

const ClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const EventMap = ({ events = [], center, onMapClick, onEventClick, tempLocation }) => {
    
    // Função auxiliar SEGURA para extrair coordenadas
    // Protege contra eventos que possam ter ficado com localizacao null no banco
    const getPosition = (localizacao) => {
        if (!localizacao) return null;

        // Padrão GeoJSON: coordinates: [longitude, latitude] -> Leaflet: [latitude, longitude]
        if (localizacao.coordinates && Array.isArray(localizacao.coordinates)) {
            return [localizacao.coordinates[1], localizacao.coordinates[0]];
        }
        
        // Fallback x/y (caso antigo)
        if (localizacao.y !== undefined && localizacao.x !== undefined) {
            return [localizacao.y, localizacao.x];
        }
        
        return null;
    };

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Renderização segura dos eventos */}
            {events.map((evt) => {
                const position = getPosition(evt.localizacao);
                
                // se a posição for inválida, simplesmente não renderiza este marcador
                // em vez de quebrar a página toda.
                if (!position) return null;

                return (
                    <Marker
                        key={evt.id}
                        position={position}
                        icon={blueIcon}
                        eventHandlers={{
                            click: () => onEventClick(evt),
                        }}
                    />
                );
            })}

            {/* Local temporário selecionado (Pin Vermelho) */}
            {tempLocation && (
                <Marker position={tempLocation} icon={redIcon} />
            )}

            <ClickHandler onMapClick={onMapClick} />
        </MapContainer>
    );
};

export default EventMap;