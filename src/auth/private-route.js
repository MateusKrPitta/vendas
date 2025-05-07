import { Navigate, Outlet, useLocation } from 'react-router-dom';
import CustomToast from '../components/toast';

const PrivateRoute = ({ allowedAccessTypes = [] }) => {
    const userData = localStorage.getItem('user');
    let user = null;
    
    try {
        user = userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
    }

    if (!user || !user.token) {
        CustomToast({ type: 'warning', message: 'Faça login para acessar esta página!' });
        return <Navigate to="/" replace />;
    }

 
    if (allowedAccessTypes.length > 0 && !allowedAccessTypes.includes(user.tipo)) {
        CustomToast({ type: 'error', message: 'Você não tem permissão para acessar esta página!' });
        return <Navigate to="/dashboard" replace />; 
    }

    return <Outlet />;
};

export default PrivateRoute;