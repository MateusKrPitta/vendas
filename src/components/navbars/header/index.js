import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/png/LogoFinanceiro.png';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from '@mui/icons-material/Person';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CloseIcon from "@mui/icons-material/Close";
import BarChartIcon from '@mui/icons-material/BarChart';
import { Button, Drawer, IconButton, List } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';

const Navbar = ({ user }) => {
    const [activeRoute, setActiveRoute] = useState("");
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showCadastroSubMenu, setShowCadastroSubMenu] = useState(false);


    const tipoUsuario = localStorage.getItem('tipo');


    const isUsuarioTipo3 = tipoUsuario === "3";

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleNavigate = (route) => {
        navigate(route);
        localStorage.setItem("page", route);
        setActiveRoute(route);
        if (route === '/cadastro') {
            localStorage.setItem("page-cadastro", route);
        }
    };

    useEffect(() => {
        const savedPage = localStorage.getItem("page");
        if (savedPage && savedPage !== activeRoute) {
            setActiveRoute(savedPage);
        }
    }, []);

    return (
        <div className='hidden sm:hidden md:hidden lg:block' style={{ backgroundColor: '#d2d7db' }}>
            <div className="lg:block hidden h-[100%]">
                <div className={`transition-all w-64 h-screen bg-cover bg-no-repeat bg-center flex flex-col p-5`} style={{ backgroundColor: '#d2d7db' }}>
                    <div className="flex flex-col justify-center items-center mb-5 cursor-pointer" onClick={() => handleNavigate("/dashboard")}>
                        <img src={logo} alt="Logo" style={{ borderRadius: "10px", width: '50%' }} title={user ? "Clique para acessar a Dashboard" : ''} className="w-24" />

                    </div>

                    <div className="flex flex-col gap-2 text-white overflow-hidden transition-all">

                        <>
                            <label className="text-sm mt-1 text-primary font-bold">Home</label>
                            <button
                                onClick={() => handleNavigate("/dashboard")}
                                className={`flex items-center bg-white text-primary font-bold rounded p-3 px-2 py-2 gap-2 text-sm ${activeRoute === "/dashboard" ? "border-b-2 border-secundary" : ""}`}
                                title={'Dashboard'}
                            >
                                <DashboardIcon fontSize={"small"} />
                                <span>Dashboard</span>
                            </button>
                        </>

                        <label className="text-sm mt-1 text-primary font-bold">Funções</label>
                        <button
                            onClick={() => handleNavigate("/vendas")}
                            className={`flex items-center bg-white text-primary font-bold rounded p-3 px-2 py-2 gap-2 text-sm ${activeRoute === "/vendas" ? "border-b-2 border-secundary" : ""}`}
                            title={'Vendas'}
                        >
                            <AddchartIcon fontSize={"small"} />
                            <span>Vendas</span>
                        </button>



                        <button
                            onClick={() => handleNavigate("/saidas")}
                            className={`flex items-center bg-white text-primary font-bold rounded p-3 px-2 py-2 gap-2 text-sm ${activeRoute === "/saidas" ? "border-b-2 border-secundary" : ""}`}
                            title={'Saídas'}
                        >
                            <AddToQueueIcon fontSize={"small"} />
                            <span>Saídas</span>
                        </button>

                        {!isUsuarioTipo3 && (
                            <button
                                onClick={() => handleNavigate("/relatorio")}
                                className={`flex items-center bg-white text-primary font-bold rounded p-3 px-2 py-2 gap-2 text-sm ${activeRoute === "/relatorios" ? "border-b-2 border-secundary" : ""}`}
                                title={'Relatório'}
                            >
                                <DataThresholdingIcon fontSize={"small"} />
                                <span>Relatório</span>
                            </button>
                        )}
                        <button
                            onClick={() => handleNavigate("/cursos")}
                            className={`flex items-center bg-white text-primary font-bold rounded p-3 px-2 py-2 gap-2 text-sm ${activeRoute === "/saidas" ? "border-b-2 border-secundary" : ""}`}
                            title={'Saídas'}
                        >
                            <VideoCameraFrontIcon fontSize={"small"} />
                            <span>Cursos</span>
                        </button>
                        <label className="text-sm mt-1 text-primary font-bold">Configurações</label>
                        <button
                            onClick={() => handleNavigate("/cadastro")}
                            className={`flex items-center bg-white text-primary font-bold rounded p-3 px-2 py-2 gap-2 text-sm  ${activeRoute === "/cadastro" ? "border-b-2 border-secundary" : ""}`}
                            title={'Cadastro de Configurações'}
                        >
                            <MiscellaneousServicesIcon fontSize={"small"} />
                            <span>Cadastro</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:hidden flex w-full h-[50px] bg-primary fixed top-0 left-0 z-10">
                {user ?
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <IconButton onClick={toggleMenu} style={{ color: "white" }}>
                            <MenuIcon />
                        </IconButton>
                    </div>
                    : <></>
                }
                <div className="flex justify-center items-center w-full h-full">
                    <img
                        src={logo}
                        alt="Logo"
                        title="Clique para acessar a Dashboard"
                        className="w-20"
                    />
                </div>
                <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
                    <div className="w-64">
                        <div className="flex justify-between items-center px-4 py-2 border-b">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <IconButton onClick={toggleMenu}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <List>
                            {/* Exibir "Dashboard" apenas se não for usuário tipo 3 */}
                            {!isUsuarioTipo3 && (
                                <Button
                                    fullWidth
                                    onClick={() => handleNavigate("/dashboard")}
                                    startIcon={<DashboardIcon fontSize="small" />}
                                    className="text-left"
                                    title="Ir para Pagamentos"
                                    sx={{
                                        justifyContent: "flex-start",
                                        padding: "10px 16px",
                                        textTransform: "none",
                                        "&:hover": {
                                            backgroundColor: "#f4f4f4",
                                        },
                                    }}
                                >
                                    Pagamentos
                                </Button>
                            )}

                            {/* Exibir "Cadastro" e submenu apenas se não for usuário tipo 3 */}
                            {!isUsuarioTipo3 && (
                                <div>
                                    <Button
                                        fullWidth
                                        onClick={() => setShowCadastroSubMenu(!showCadastroSubMenu)}
                                        startIcon={<MiscellaneousServicesIcon fontSize="small" />}
                                        className="text-left"
                                        title="Ir para Cadastro"
                                        sx={{
                                            justifyContent: "flex-start",
                                            padding: "10px 16px",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: "#f4f4f4",
                                            },
                                        }}
                                    >
                                        Cadastro
                                    </Button>
                                    {showCadastroSubMenu && (
                                        <div>
                                            <Button
                                                fullWidth
                                                onClick={() => handleNavigate("/cadastro")}
                                                startIcon={<PersonIcon fontSize="small" />}
                                                className="text-left"
                                                title="Ir para Usuário"
                                                sx={{
                                                    justifyContent: "flex-start",
                                                    padding: "10px 50px",
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        backgroundColor: "#f4f4f4",
                                                    },
                                                }}
                                            >
                                                Usuário
                                            </Button>
                                            <Button
                                                fullWidth
                                                onClick={() => handleNavigate("/cadastro-unidade")}
                                                startIcon={<LocationCityIcon fontSize="small" />}
                                                className="text-left"
                                                title="Ir para Unidade"
                                                sx={{
                                                    justifyContent: "flex-start",
                                                    padding: "10px 50px",
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        backgroundColor: "#f4f4f4",
                                                    },
                                                }}
                                            >
                                                Unidade
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Exibir "Relatório" para todos os usuários */}
                            <Button
                                fullWidth
                                onClick={() => handleNavigate("/relatorio")}
                                startIcon={<BarChartIcon fontSize="small" />}
                                className="text-left"
                                title="Ir para Relatorio"
                                sx={{
                                    justifyContent: "flex-start",
                                    padding: "10px 16px",
                                    textTransform: "none",
                                    "&:hover": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                }}
                            >
                                Relatório
                            </Button>
                        </List>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};

export default Navbar;