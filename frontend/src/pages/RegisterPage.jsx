import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Eye, EyeOff, Navigation, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import { validateEmail, validatePassword } from '../utils/validators';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
    const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidade
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validações (Mantendo a lógica original)
        if (!formData.nome.trim()) {
            return toast.warn("Por favor, informe seu nome.");
        }
        if (!validateEmail(formData.email)) {
            return toast.error("Email inválido!");
        }
        if (!validatePassword(formData.senha)) {
            return toast.error("A senha deve ter min 8 caracteres, maiúscula, minúscula, número e símbolo.");
        }

        setLoading(true);
        try {
            await api.post('/cadastro', formData);
            toast.success("Cadastro realizado com sucesso!");
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.message || "Erro ao realizar cadastro.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-fade-in">
                
                {/* Cabeçalho */}
                <div className="auth-header">
                    <div className="auth-brand">
                        <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                            <Navigation size={24} color="white" />
                        </div>
                        <span>Encontros<span style={{ color: 'var(--primary)' }}>Tech</span></span>
                    </div>
                    <p className="auth-subtitle">Crie sua conta e participe da comunidade.</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    
                    {/* Input Nome */}
                    <div className="input-icon-wrapper">
                        <User size={20} className="input-icon" />
                        <input 
                            type="text" 
                            className="form-input with-icon" 
                            placeholder="Seu nome completo" 
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            required
                        />
                    </div>

                    {/* Input Email */}
                    <div className="input-icon-wrapper">
                        <Mail size={20} className="input-icon" />
                        <input 
                            type="email" 
                            className="form-input with-icon" 
                            placeholder="Seu melhor email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    {/* Input Senha com Toggle */}
                    <div className="input-icon-wrapper">
                        <Lock size={20} className="input-icon" />
                        <input 
                            type={showPassword ? "text" : "password"} // Alterna o tipo
                            className="form-input with-icon with-icon-right" 
                            placeholder="Crie uma senha forte" 
                            value={formData.senha}
                            onChange={(e) => setFormData({...formData, senha: e.target.value})}
                            required
                        />
                        <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1" // Evita foco ao navegar com Tab
                            title={showPassword ? "Ocultar senha" : "Ver senha"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Regras de Senha (Visual mais limpo) */}
                    <div style={{ textAlign: 'left', marginBottom: '20px', background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                            <CheckCircle2 size={12} color="var(--primary)" /> 
                            Mínimo de 8 caracteres
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 0 0' }}>
                            <CheckCircle2 size={12} color="var(--primary)" /> 
                            Maiúscula, minúscula, número e símbolo
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Cadastrando...
                            </>
                        ) : (
                            <>
                                Criar Conta <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {/* Rodapé */}
                <div className="auth-footer">
                    Já possui cadastro? 
                    <Link to="/login" className="auth-link">
                        Fazer Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;