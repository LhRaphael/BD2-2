import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '10px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>EvenTech</Link>
            </div>
            <div>
                {user ? (
                    <>
                        <span style={{ marginRight: '10px' }}>Olá, {user.nome}</span>
                        <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#fff', marginRight: '10px' }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff' }}>Cadastro</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;