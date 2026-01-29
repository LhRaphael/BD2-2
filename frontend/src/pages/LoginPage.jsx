import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Navigation, ArrowRight, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !senha) {
            return toast.warn("Preencha todos os campos.");
        }

        setLoading(true);
        try {
            const response = await api.post('/login', { email, senha });
            login(response.data); // Salva no contexto
            toast.success(`Bem-vindo, ${response.data.nome}!`);
            navigate('/');
        } catch (error) {
            const msg = error.response?.data?.message || "Email ou senha inválidos.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-fade-in">
                
                {/* Cabeçalho com Logo */}
                <div className="auth-header">
                    <div className="auth-brand">
                        <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                            <Navigation size={24} color="white" />
                        </div>
                        <span>Encontros<span style={{ color: 'var(--primary)' }}>Tech</span></span>
                    </div>
                    <p className="auth-subtitle">Entre para descobrir eventos incríveis.</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    
                    <div className="input-icon-wrapper">
                        <Mail size={20} className="input-icon" />
                        <input 
                            type="email" 
                            className="form-input with-icon" 
                            placeholder="Seu email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-icon-wrapper">
                        <Lock size={20} className="input-icon" />
                        <input 
                            type="password" 
                            className="form-input with-icon" 
                            placeholder="Sua senha" 
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Entrando...
                            </>
                        ) : (
                            <>
                                Entrar <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {/* Rodapé com Link para Cadastro */}
                <div className="auth-footer">
                    Ainda não tem uma conta? 
                    <Link to="/register" className="auth-link">
                        Crie agora
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;