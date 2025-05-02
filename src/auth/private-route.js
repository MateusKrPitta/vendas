import { Navigate, Outlet, useLocation } from 'react-router-dom';
import CustomToast from '../components/toast';

const PrivateRoute = () => {
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;

    if (!token) {
        CustomToast({ type: 'warning', message: 'Faça login para acessar esta página!' });
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;