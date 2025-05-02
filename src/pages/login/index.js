import React, { useState } from 'react';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import Financeiro from '../../assets/icones/logo.png';
import LoadingLogin from '../../components/loading/loading-login';
import { useNavigate } from 'react-router-dom';
import packageJson from '../../../package.json';
import CustomToast from '../../components/toast';
import { login } from '../../service/post/login';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSenhaChange = (e) => {
        setSenha(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        if (!email || !senha) {
            CustomToast.error('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            const response = await login(email, senha);

            if (response.status) {
                const { token, user } = response.data;

                localStorage.setItem('user', JSON.stringify({
                    token: token.token,
                    fullName: user.fullName,
                    tipo: user.tipo,
                    unidadeId: user.unidadeId
                }));
                CustomToast({ type: 'success', message: 'Seja bem vindo !' });
                navigate('/dashboard');

            } else {
                CustomToast.error(response.message);
            }

        } catch (error) {
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container flex h-screen items-center justify-center ">
            <div className="relative p-8 rounded-lg shadow-lg max-w-md w-full z-10" style={{ backgroundColor: '#0d2d43' }}>
                <div className="flex justify-center mb-10" >
                    <img src={Financeiro} alt="Logo Pax Verde" className="w-22" style={{ borderRadius: "10px" }} />
                </div>
                <input
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Email"
                    autoComplete='off'
                    className="cpf-input w-full p-3 mb-4 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="relative w-full mb-4">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={senha}
                        onChange={handleSenhaChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Senha"
                        className="password-input w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer opacity-25"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <VisibilityOffOutlined size={24} /> : <VisibilityOutlined size={24} />}
                    </div>
                </div>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{ backgroundColor: '#588152', color: 'white', fontWeight: '600' }}
                    className="login-button w-full text-white p-2 rounded-md bg-custom-green"
                >
                    {loading ? <LoadingLogin /> : 'Entrar'}
                </button>
                <div className="versao-app text-center text-white mt-10">
                    <p> Versão {packageJson.version}</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;