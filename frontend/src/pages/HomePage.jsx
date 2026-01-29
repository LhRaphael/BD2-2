import React, { useEffect, useState, useContext, useCallback } from 'react';
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
    
    const [events, setEvents] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    
    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('view'); // 'view', 'create', 'edit', 'profile'
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tempLocation, setTempLocation] = useState(null);
    
    const [formData, setFormData] = useState({ titulo: '', descricao: '' });
    const [loading, setLoading] = useState(false);

    const searchEvents = async (query) => {
        if (!query.trim()) {
            // Se a busca estiver vazia, volta a mostrar os eventos próximos (padrão)
            if (userLocation) fetchEvents(userLocation[0], userLocation[1]);
            return;
        }

        try {
            // Monta a URL com lat/lng para que o backend possa ordenar por distância
            let url = `/eventos/busca?titulo=${query}`;
            if (userLocation) {
                url += `&lat=${userLocation[0]}&lng=${userLocation[1]}`;
            }

            const res = await api.get(url);
            setEvents(res.data);
        } catch (error) {
            console.error("Erro na busca", error);
        }
    };

    // Implementação de DEBOUNCE manual para não sobrecarregar a API
    const handleSearch = (query) => {
        // Limpa o timeout anterior
        if (window.searchTimeout) clearTimeout(window.searchTimeout);
        
        // Define um novo timeout de 500ms
        window.searchTimeout = setTimeout(() => {
            searchEvents(query);
        }, 500);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                fetchEvents(latitude, longitude);
            },
            () => {
                const fallback = [-6.75, -38.23];
                setUserLocation(fallback);
                fetchEvents(fallback[0], fallback[1]);
            }
        );
    }, []);

    const fetchEvents = async (lat, lng) => {
        try {
            const res = await api.get(`/eventos?lat=${lat}&lng=${lng}&raioKm=50`);
            setEvents(res.data);
        } catch (error) { console.error("Erro ao buscar eventos"); }
    };

    // --- HANDLERS DA SIDEBAR ---

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/eventos', {
                ...formData,
                criadorId: user.id,
                latitude: tempLocation.lat,
                longitude: tempLocation.lng
            });
            toast.success("Evento criado!");
            setIsSidebarOpen(false);
            setTempLocation(null);
            fetchEvents(userLocation[0], userLocation[1]);
        } catch (error) { toast.error("Erro ao criar evento."); } 
        finally { setLoading(false); }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
        try {
            await api.delete(`/evento/${id}`);
            toast.success("Evento excluído.");
            setIsSidebarOpen(false);
            fetchEvents(userLocation[0], userLocation[1]); // Atualiza lista
        } catch (error) { toast.error("Erro ao excluir evento."); }
    };

    // --- NOVA LÓGICA DE EDIÇÃO ---

    // 1. Iniciar Edição: Preenche o form e muda o modo
    const handleEditStart = (isStarting = true) => {
        if (isStarting) {
            setFormData({
                titulo: selectedEvent.titulo,
                descricao: selectedEvent.descricao || ''
            });
            setSidebarMode('edit');
        } else {
            // Cancelar edição: volta para visualização
            setSidebarMode('view');
        }
    };

    // 2. Salvar Edição: Chama o backend
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                id: selectedEvent.id,
                titulo: formData.titulo,
                descricao: formData.descricao
            };
            
            // Chama endpoint @PatchMapping("/evento/atualizar")
            const response = await api.patch('/evento/atualizar', payload);
            
            toast.success("Evento atualizado!");
            
            // Atualiza os dados locais para refletir na UI imediatamente
            setSelectedEvent(response.data);
            setSidebarMode('view'); // Volta para visualização com dados novos
            fetchEvents(userLocation[0], userLocation[1]); // Atualiza mapa
            
        } catch (error) {
            toast.error("Erro ao atualizar evento.");
        } finally {
            setLoading(false);
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
        } catch (error) { toast.error("Erro ao atualizar senha."); } 
        finally { setLoading(false); }
    };

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
                    
                    // Ações
                    onSubmitEvent={handleCreateEvent}
                    onUpdateEvent={handleUpdateEvent} // <--- Passando a nova função
                    onDeleteEvent={handleDeleteEvent}
                    onEditStart={handleEditStart}     // <--- Passando a nova função
                    onUpdatePassword={handleUpdatePassword}
                    
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default HomePage;