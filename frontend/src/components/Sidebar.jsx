import React, { useState, useEffect, useContext } from 'react';
import { X, MapPin, User, Calendar, CheckCircle, Trash2, Lock, ShieldCheck, Edit, Users } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Sidebar = ({ 
    isOpen, onClose, mode, 
    eventData, formData, setFormData, 
    onSubmitEvent, onUpdateEvent, 
    onDeleteEvent, onEditStart, 
    onUpdatePassword, loading 
}) => {
    const { user } = useContext(AuthContext);
    
    // Estados locais
    const [participantes, setParticipantes] = useState([]);
    const [jaConfirmou, setJaConfirmou] = useState(false);
    const [loadingParticipantes, setLoadingParticipantes] = useState(false);

    // Estados senha
    const [captchaValido, setCaptchaValido] = useState(false);
    const [passData, setPassData] = useState({ novaSenha: '', confirmacao: '' });

    const isCreator = (mode === 'view' || mode === 'edit') && eventData && user?.id === eventData.criadorId;

    useEffect(() => {
        if (mode === 'view' && eventData && isOpen) {
            fetchParticipantes();
            checkStatusParticipacao();
        }
    }, [mode, eventData, isOpen]);

    // Endpoint: GET /api/evento/{id}/participantes
    const fetchParticipantes = async () => {
        try {
            const res = await api.get(`/evento/${eventData.id}/participantes`);
            setParticipantes(res.data);
        } catch (error) {
            console.error("Erro ao buscar participantes");
        }
    };

    // Endpoint: GET /api/evento/{id}/verificar?usuarioId=...
    const checkStatusParticipacao = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/evento/${eventData.id}/verificar`, {
                params: { usuarioId: user.id }
            });
            setJaConfirmou(res.data);
        } catch (error) {
            console.error("Erro ao verificar status");
        }
    };

    // Toggle Presença (Confirmar/Remover)
    const handleTogglePresenca = async () => {
        setLoadingParticipantes(true);
        try {
            if (jaConfirmou) {
                // Endpoint: DELETE /api/evento/{id}/participar?usuarioId=...
                await api.delete(`/evento/${eventData.id}/participar`, {
                    params: { usuarioId: user.id }
                });
                toast.info("Presença cancelada.");
                setJaConfirmou(false);
            } else {
                // Endpoint: POST /api/evento/{id}/participar?usuarioId=...
                // Nota: POST espera (url, body, config). Body é null aqui.
                await api.post(`/evento/${eventData.id}/participar`, null, {
                    params: { usuarioId: user.id }
                });
                toast.success("Presença confirmada! Nos vemos lá.");
                setJaConfirmou(true);
            }
            // Recarrega a lista
            fetchParticipantes();
        } catch (error) {
            toast.error("Erro ao atualizar presença.");
        } finally {
            setLoadingParticipantes(false);
        }
    };

    const handleFormSubmit = (e) => {
        if (mode === 'edit') {
            onUpdateEvent(e);
        } else {
            onSubmitEvent(e);
        }
    };

    const handleCaptchaChange = (value) => setCaptchaValido(!!value);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if(passData.novaSenha !== passData.confirmacao) return alert("As senhas não conferem!");
        onUpdatePassword(passData.novaSenha);
        setPassData({ novaSenha: '', confirmacao: '' });
        setCaptchaValido(false);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {mode === 'create' && 'Novo Evento'}
                    {mode === 'edit' && 'Editar Evento'}
                    {mode === 'view' && 'Detalhes do Evento'}
                    {mode === 'profile' && <><User size={24}/> Meu Perfil</>}
                </h2>
                <button onClick={onClose} className="close-btn"><X size={20} /></button>
            </div>

            <div className="sidebar-content">
                
                {/* --- MODO VISUALIZAÇÃO --- */}
                {mode === 'view' && eventData && (
                    <div className="animate-fade-in">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--primary)' }}>
                            {eventData.titulo}
                        </h3>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                            <span className="event-tag">TECH</span>
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>• Presencial</span>
                        </div>

                        <p style={{ lineHeight: '1.6', color: '#475569', minHeight: '60px' }}>
                            {eventData.descricao || "Sem descrição."}
                        </p>

                        <div className="info-card">
                            <div className="info-item">
                                <User size={20} color="#94a3b8" />
                                <div className="info-text">
                                    <small>ORGANIZADO POR</small>
                                    <span>{eventData.criadorNome}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <Calendar size={20} color="#94a3b8" />
                                <div className="info-text">
                                    <small>CRIADO EM</small>
                                    <span>{new Date(eventData.dataCriacao).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO DE PARTICIPANTES */}
                        <div style={{ marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                            <h4 style={{ fontSize: '0.9rem', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={16} /> Quem vai ({participantes.length})
                            </h4>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {participantes.length === 0 ? (
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Seja o primeiro a confirmar!</span>
                                ) : (
                                    participantes.map((p, index) => (
                                        <div key={index} title={p.nome} style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: `hsl(${Math.random() * 360}, 70%, 80%)`,
                                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.8rem', fontWeight: 'bold', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {p.nome.charAt(0).toUpperCase()}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="action-buttons" style={{ flexDirection: 'column', marginTop: '24px' }}>
                            <button 
                                onClick={handleTogglePresenca}
                                disabled={loadingParticipantes}
                                className={jaConfirmou ? "btn-secondary" : "btn-primary"} 
                                style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
                            >
                                {loadingParticipantes ? 'Processando...' : (
                                    jaConfirmou ? (
                                        <> <X size={20} /> Cancelar Presença </>
                                    ) : (
                                        <> <CheckCircle size={20} /> Confirmar Presença </>
                                    )
                                )}
                            </button>

                            {isCreator && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={onEditStart} className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                                        <Edit size={20} /> Editar
                                    </button>
                                    <button onClick={() => onDeleteEvent(eventData.id)} className="btn-secondary" style={{ flex: 1, color: '#ef4444', borderColor: '#ef4444', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                        <Trash2 size={20} /> Excluir
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- MODO CRIAÇÃO / EDIÇÃO --- */}
                {(mode === 'create' || mode === 'edit') && (
                    <form onSubmit={handleFormSubmit}>
                        <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '12px', borderRadius: '8px', color: '#1d4ed8', marginBottom: '20px', fontSize: '0.875rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <MapPin size={16} /> 
                            {mode === 'edit' ? 'Localização fixa' : 'Local selecionado no mapa.'}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nome do Evento</label>
                            <input 
                                className="form-input" 
                                placeholder="Ex: Workshop de Node.js"
                                value={formData.titulo}
                                onChange={e => setFormData({...formData, titulo: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Descrição</label>
                            <textarea 
                                className="form-textarea" 
                                rows="4" 
                                placeholder="Detalhes do evento..."
                                value={formData.descricao}
                                onChange={e => setFormData({...formData, descricao: e.target.value})}
                            />
                        </div>
                        
                        <div className="action-buttons">
                            {mode === 'edit' && (
                                <button type="button" onClick={() => onEditStart(false)} className="btn-secondary" style={{ flex: 1 }}>
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                                {loading ? 'Salvando...' : (mode === 'edit' ? 'Salvar Alterações' : 'Criar Evento')}
                            </button>
                        </div>
                    </form>
                )}

                {/* --- MODO PERFIL --- */}
                {mode === 'profile' && (
                    <div className="animate-fade-in">
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                            <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={18} color="var(--primary)"/> Segurança
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                Para atualizar sua senha, confirme que você não é um robô.
                            </p>
                        </div>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label className="form-label">Nova Senha</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }}/>
                                    <input 
                                        type="password"
                                        className="form-input" 
                                        style={{ paddingLeft: '35px' }}
                                        placeholder="No mínimo 8 caracteres"
                                        value={passData.novaSenha}
                                        onChange={e => setPassData({...passData, novaSenha: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirmar Senha</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }}/>
                                    <input 
                                        type="password"
                                        className="form-input" 
                                        style={{ paddingLeft: '35px' }}
                                        placeholder="Repita a senha"
                                        value={passData.confirmacao}
                                        onChange={e => setPassData({...passData, confirmacao: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                                <ReCAPTCHA
                                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                    onChange={handleCaptchaChange}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn-primary" 
                                disabled={!captchaValido || loading}
                                style={{ opacity: captchaValido ? 1 : 0.6 }}
                            >
                                {loading ? 'Atualizando...' : 'Atualizar Senha'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;