import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ButtonComponent from '../../button';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import SubjectIcon from '@mui/icons-material/Subject';

const HeaderCadastro = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const userType = userData?.tipo;

    const handleNavigation = (section) => {
        switch (section) {
            case 'fornecedor':
                navigate('/cadastro/fornecedor');
                break;
            case 'usuario':
                navigate('/cadastro/usuario');
                break;
            case 'unidade':
                navigate('/cadastro/unidade');
                break;
            case 'categoria':
                navigate('/cadastro/categoria');
                break;
            default:
                console.warn(`Seção desconhecida: ${section}`);
                break;
        }
    };

    return (
        <div className="w-[100%] items-center justify-center flex flex-wrap lg:justify-start gap-2 md:gap-1">
            {/* Botão Usuário - apenas para tipo 1 (Admin) */}
            {userType === 1 && (
                <ButtonComponent
                    startIcon={<AccountCircleIcon fontSize="small" />}
                    title="Usuário"
                    buttonSize="large"
                    onClick={() => handleNavigation('usuario')}
                    className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
                />
            )}

            {/* Botão Unidade - apenas para tipo 1 (Admin) */}
            {userType === 1 && (
                <>
                    <ButtonComponent
                        startIcon={<LocationOnIcon fontSize="small" />}
                        title="Unidade"
                        buttonSize="large"
                        onClick={() => handleNavigation('unidade')}
                        className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
                    />
                    <ButtonComponent
                        startIcon={<CategoryIcon fontSize="small" />}
                        title="Fornecedor"
                        buttonSize="large"
                        onClick={() => handleNavigation('fornecedor')}
                        className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
                    />
                </>
            )}

            {/* Botão Fornecedor - para todos os tipos */}


            {/* Botão Categoria - para todos os tipos */}
            <ButtonComponent
                startIcon={<SubjectIcon fontSize="small" />}
                title="Categoria"
                buttonSize="large"
                onClick={() => handleNavigation('categoria')}
                className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
            />
        </div>
    );
};

export default HeaderCadastro;