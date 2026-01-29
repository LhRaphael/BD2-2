import React, { useContext } from 'react';
import { Navigation, Search, LogOut, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Adicionamos a prop 'onSearch'
const Header = ({ onOpenProfile, onSearch }) => { 
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="header">
            <div className="brand">
                <div className="brand-icon">
                    <Navigation size={20} />
                </div>
                <span>Encontros<span style={{ color: 'var(--primary)' }}>Tech</span></span>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div className="search-bar">
                    <Search size={16} color="#94a3b8" />
                    {/* Input conectado à função de busca */}
                    <input 
                        type="text" 
                        placeholder="Buscar eventos..." 
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <div className="user-profile">
                    <div 
                        onClick={onOpenProfile} 
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                        title="Configurações de Conta"
                    >
                        <div className="avatar">
                            {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>{user?.nome}</span>
                            <small style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Settings size={10} /> Configurações
                            </small>
                        </div>
                    </div>

                    <button 
                        onClick={logout} 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', marginLeft: '10px' }}
                        title="Sair"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;