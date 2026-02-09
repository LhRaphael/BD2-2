import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapPin } from 'lucide-react';
import { validatePassword } from '../utils/validators';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EventMap from '../components/EventMap';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    
    // Estados de Dados
    const [events, setEvents] = useState([]);
    const [userLocation, setUserLocation] = useState(null); // [lat, lng]
    
    // Estados de UI
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('view'); // 'view', 'create', 'edit', 'profile'
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tempLocation, setTempLocation] = useState(null);
    
    // Formulário
    const [formData, setFormData] = useState({ titulo: '', descricao: '' });
    const [loading, setLoading] = useState(false);

    // --- 1. BUSCA E LISTAGEM (READ) ---

    // Carrega localização inicial e eventos
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                fetchEvents(latitude, longitude);
            },
            () => {
                // Fallback: Centro de Sousa-PB
                const fallback = [-6.75, -38.23];
                setUserLocation(fallback);
                fetchEvents(fallback[0], fallback[1]);
                toast.warning("Localização não obtida. Usando padrão.");
            }
        );
    }, []);

    // Endpoint: GET /api/eventos?lat=...&lng=...&raioKm=...
    const fetchEvents = async (lat, lng) => {
        try {
            const res = await api.get('/eventos', {
                params: {
                    lat: lat,
                    lng: lng,
                    raioKm: 50
                }
            });
            setEvents(res.data);
        } catch (error) {
            console.error("Erro ao buscar eventos", error);
        }
    };

    // Endpoint: GET /api/eventos/busca?titulo=...
    const searchEvents = async (query) => {
        if (!query.trim()) {
            if (userLocation) fetchEvents(userLocation[0], userLocation[1]);
            return;
        }

        try {
            const params = { titulo: query };
            // Se tivermos localização, enviamos para ordenar por distância
            if (userLocation) {
                params.lat = userLocation[0];
                params.lng = userLocation[1];
            }

            const res = await api.get('/eventos/busca', { params });
            setEvents(res.data);
        } catch (error) {
            console.error("Erro na busca", error);
        }
    };

    // Debounce para a busca (evita muitas requisições)
    const handleSearch = (query) => {
        if (window.searchTimeout) clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            searchEvents(query);
        }, 500);
    };

    // --- 2. CRIAÇÃO (CREATE) ---

    // Endpoint: POST /api/eventos (Body: NovoEventoDTO)
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        
        if (!tempLocation) return toast.warning("Selecione um local no mapa.");

        setLoading(true);
        try {
            const payload = {
                titulo: formData.titulo,
                descricao: formData.descricao,
                criadorId: user.id,
                // Backend espera 'latitude' e 'longitude', Leaflet dá 'lat' e 'lng'
                latitude: tempLocation.lat,
                longitude: tempLocation.lng
            };

            await api.post('/eventos', payload);
            
            toast.success("Evento criado com sucesso!");
            setIsSidebarOpen(false);
            setTempLocation(null);
            // Atualiza o mapa
            if (userLocation) fetchEvents(userLocation[0], userLocation[1]);
        } catch (error) {
            toast.error(error.response?.data || "Erro ao criar evento.");
        } finally {
            setLoading(false);
        }
    };

    // --- 3. ATUALIZAÇÃO (UPDATE) ---

    const handleEditStart = (isStarting = true) => {
        if (isStarting) {
            setFormData({
                titulo: selectedEvent.titulo,
                descricao: selectedEvent.descricao || ''
            });
            setSidebarMode('edit');
        } else {
            setSidebarMode('view');
        }
    };

    // Endpoint: PATCH /api/evento/atualizar (Body: AtlzEventoDTO)
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                id: selectedEvent.id, // ID Obrigatório no DTO
                titulo: formData.titulo,
                descricao: formData.descricao
            };
            
            const response = await api.patch('/evento/atualizar', payload);
            
            toast.success("Evento atualizado!");
            setSelectedEvent(response.data); // Atualiza UI com dados novos
            setSidebarMode('view');
            if (userLocation) fetchEvents(userLocation[0], userLocation[1]);
            
        } catch (error) {
            toast.error("Erro ao atualizar evento.");
        } finally {
            setLoading(false);
        }
    };

    // --- 4. EXCLUSÃO (DELETE) ---

    // Endpoint: DELETE /api/evento/{id}
    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
        
        try {
            await api.delete(`/evento/${id}`);
            toast.success("Evento excluído.");
            setIsSidebarOpen(false);
            // Remove da lista localmente para não precisar recarregar tudo
            setEvents(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            toast.error("Erro ao excluir evento.");
        }
    };

    // --- OUTROS HANDLERS ---

    const handleOpenProfile = () => {
        setSidebarMode('profile');
        setIsSidebarOpen(true);
    };

    const handleUpdatePassword = async (novaSenha) => {
        if (!validatePassword(novaSenha)) return toast.error("Senha fraca.");
        setLoading(true);
        try {
            await api.patch('/usuario/atualizar', { id: user.id, senha: novaSenha });
            toast.success("Senha atualizada!");
            setIsSidebarOpen(false);
        } catch (error) {
            toast.error("Erro ao atualizar senha.");
        } finally {
            setLoading(false);
        }
    };

    // Interações com o Mapa
    const handleMapClick = (latlng) => {
        setTempLocation(latlng);
        setSidebarMode('create');
        setFormData({ titulo: '', descricao: '' });
        setIsSidebarOpen(true);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setSidebarMode('view');
        setIsSidebarOpen(true);
    };

    return (
        <div className="app-container">
            <Header 
                onOpenProfile={handleOpenProfile} 
                onSearch={handleSearch} 
            />

            <div className="main-content">
                {!isSidebarOpen && (
                    <div className="map-instruction animate-bounce">
                        <MapPin size={16} className="text-indigo-600" />
                        <span>Clique no mapa para criar um evento</span>
                    </div>
                )}

                <div className="map-wrapper">
                    {userLocation ? (
                        <EventMap 
                            center={userLocation}
                            events={events}
                            onMapClick={handleMapClick}
                            onEventClick={handleEventClick}
                            tempLocation={tempLocation}
                        />
                    ) : <p style={{textAlign: 'center', marginTop: '50px'}}>Carregando mapa...</p>}
                </div>

                <Sidebar 
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    mode={sidebarMode}
                    eventData={selectedEvent}
                    formData={formData}
                    setFormData={setFormData}
                    
                    // Ações passadas como props
                    onSubmitEvent={handleCreateEvent}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onEditStart={handleEditStart}
                    onUpdatePassword={handleUpdatePassword}
                    
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default HomePage;