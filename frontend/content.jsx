import React, { useState } from 'react';
import { MapPin, Calendar, User, Plus, X, Navigation, CheckCircle, Search } from 'lucide-react';

const EncontrosTechPrototype = () => {
  // Estado para armazenar os eventos (Simulando o Banco de Dados)
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Workshop de React Avançado",
      description: "Vamos discutir hooks personalizados e performance.",
      creator: "Ana Souza",
      date: "2026-02-10",
      x: 30, // Posição X simulada no mapa (%)
      y: 40  // Posição Y simulada no mapa (%)
    },
    {
      id: 2,
      title: "Meetup NoSQL vs SQL",
      description: "Debate aberto sobre Neo4J e MongoDB.",
      creator: "Carlos Dev",
      date: "2026-02-12",
      x: 60,
      y: 65
    }
  ]);

  // Estados de Interface
  const [selectedLocation, setSelectedLocation] = useState(null); // Onde o usuário clicou
  const [selectedEvent, setSelectedEvent] = useState(null);       // Evento clicado para ver detalhes
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', creator: '', date: '' });

  // Manipula o clique no "Mapa" (Container Cinza)
  const handleMapClick = (e) => {
    // Se clicou em um pin existente, não faz nada (tratado no onClick do pin)
    if (e.target.closest('.event-pin')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setSelectedLocation({ x, y });
    setSelectedEvent(null);
    setFormData({ title: '', description: '', creator: '', date: '' });
    setIsSidebarOpen(true);
  };

  // Salvar novo evento
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...formData,
      x: selectedLocation.x,
      y: selectedLocation.y
    };
    setEvents([...events, newEvent]);
    setIsSidebarOpen(false);
    setSelectedLocation(null);
  };

  // Clicar em um evento existente
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedLocation(null);
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-800 font-sans overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Navigation className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Encontros<span className="text-indigo-600">Tech</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-gray-200">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input type="text" placeholder="Buscar eventos..." className="bg-transparent text-sm outline-none text-slate-600" />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              JS
            </div>
            <span className="hidden sm:inline">João Silva</span>
          </div>
        </div>
      </header>

      {/* --- BODY --- */}
      <main className="flex-1 flex relative overflow-hidden">
        
        {/* --- MAPA SIMULADO --- */}
        {/* Na implementação real, isso seria o <MapContainer> do Leaflet */}
        <div 
          className="flex-1 bg-slate-200 relative cursor-crosshair group overflow-hidden"
          onClick={handleMapClick}
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Instrução Flutuante */}
          {!isSidebarOpen && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 animate-bounce-slow pointer-events-none">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-600">Clique no mapa para adicionar um evento</span>
            </div>
          )}

          {/* Renderização dos Eventos (Pins) */}
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="event-pin absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform duration-200 group-hover:opacity-90 hover:!opacity-100 z-10"
              style={{ left: `${event.x}%`, top: `${event.y}%` }}
            >
              <div className="relative">
                <MapPin className="w-10 h-10 text-indigo-600 drop-shadow-lg fill-white" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-sm rounded-full"></div>
              </div>
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow text-xs font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {event.title}
              </div>
            </button>
          ))}

          {/* Pin Temporário (Novo Local Selecionado) */}
          {selectedLocation && !selectedEvent && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full z-20 animate-bounce"
              style={{ left: `${selectedLocation.x}%`, top: `${selectedLocation.y}%` }}
            >
              <MapPin className="w-10 h-10 text-rose-500 drop-shadow-xl fill-white" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-sm rounded-full"></div>
            </div>
          )}
        </div>

        {/* --- SIDEBAR (Formulário / Detalhes) --- */}
        <div className={`absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 z-30 flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Header da Sidebar */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-slate-800">
              {selectedEvent ? 'Detalhes do Evento' : 'Novo Encontro Tech'}
            </h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo da Sidebar */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {selectedEvent ? (
              // MODO VISUALIZAÇÃO (READ)
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700 mb-2">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                     <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">TECH</span>
                     <span>•</span>
                     <span>Presencial</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{selectedEvent.description}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-slate-700">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">Organizado por</p>
                      <p className="font-medium">{selectedEvent.creator}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">Data</p>
                      <p className="font-medium">{selectedEvent.date}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-3">Participantes (Neo4J Rel.)</h4>
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-bold">+12</div>
                    </div>
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow transition-all active:scale-95 flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Confirmar Presença
                </button>
              </div>

            ) : (
              // MODO CRIAÇÃO (CREATE)
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="bg-blue-50 border border-blue-100 p-3 rounded text-sm text-blue-700 mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Local selecionado no mapa.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Evento</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Ex: Workshop de Node.js"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição</label>
                  <textarea 
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-32 resize-none"
                    placeholder="O que vai rolar no evento?"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Organizador</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input 
                            required
                            type="text" 
                            className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            placeholder="Seu nome"
                            value={formData.creator}
                            onChange={(e) => setFormData({...formData, creator: e.target.value})}
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Data</label>
                    <input 
                        required
                        type="date" 
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-600"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button 
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-slate-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Criar Evento
                    </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EncontrosTechPrototype;
