import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

// ESTILOS
import 'react-toastify/dist/ReactToastify.css'; // Estilo das notificações
import './App.css'; // <--- ADICIONA ESTA LINHA AQUI (O nosso CSS personalizado)

// Componentes e Páginas
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } 
          />
        </Routes>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;