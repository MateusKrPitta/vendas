import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/png/logo.png";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import CloseIcon from "@mui/icons-material/Close";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Button, Drawer, IconButton, List } from "@mui/material";
import AddchartIcon from "@mui/icons-material/Addchart";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import "./navbar.css"; // Arquivo CSS para as animações

const Navbar = ({ user }) => {
  const [activeRoute, setActiveRoute] = useState("");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCadastroSubMenu, setShowCadastroSubMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const tipoUsuario = localStorage.getItem("tipo");
  const isUsuarioTipo3 = tipoUsuario === "3";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigate = (route) => {
    navigate(route);
    localStorage.setItem("page", route);
    setActiveRoute(route);
    if (route === "/cadastro") {
      localStorage.setItem("page-cadastro", route);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsCollapsed(true);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem("page");
    if (savedPage && savedPage !== activeRoute) {
      setActiveRoute(savedPage);
    }
  }, []);

  return (
    <>
      {/* Navbar para desktop com animação */}
      <div className="hidden lg:block">
        <div
          className={`collapsible-navbar ${
            isCollapsed ? "collapsed" : "expanded"
          }`}
          style={{ backgroundColor: "#d2d7db" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex flex-col justify-center items-center mb-5 cursor-pointer"
            onClick={() => handleNavigate("/dashboard")}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ borderRadius: "10px" }}
              title={user ? "Clique para acessar a Dashboard" : ""}
              className="logo-transition"
            />
          </div>

          <div className="nav-content">
            {!isCollapsed && (
              <label className="section-label text-xs text-primary">Home</label>
            )}
            <button
              onClick={() => handleNavigate("/dashboard")}
              className={`nav-button ${
                activeRoute === "/dashboard" ? "active-route" : ""
              }`}
              title={"Dashboard"}
            >
              <DashboardIcon fontSize={"small"} />
              {!isCollapsed && <span>Dashboard</span>}
            </button>

            {!isCollapsed && <label className="section-label">Funções</label>}
            <button
              onClick={() => handleNavigate("/vendas")}
              className={`nav-button ${
                activeRoute === "/vendas" ? "active-route" : ""
              }`}
              title={"Vendas"}
            >
              <AddchartIcon fontSize={"small"} />
              {!isCollapsed && <span>Vendas</span>}
            </button>

            <button
              onClick={() => handleNavigate("/vendas-diaria")}
              className={`nav-button ${
                activeRoute === "/vendas-diaria" ? "active-route" : ""
              }`}
              title={"Vendas Diária"}
            >
              <AddBusinessIcon fontSize={"small"} />
              {!isCollapsed && <span>Vendas Diária</span>}
            </button>

            {!isUsuarioTipo3 && (
              <>
                {!isCollapsed}
                <button
                  onClick={() => handleNavigate("/saidas")}
                  className={`nav-button ${
                    activeRoute === "/saidas" ? "active-route" : ""
                  }`}
                  title={"Saídas"}
                >
                  <AddToQueueIcon fontSize={"small"} />
                  {!isCollapsed && <span>Saídas</span>}
                </button>

                <button
                  onClick={() => handleNavigate("/relatorio")}
                  className={`nav-button ${
                    activeRoute === "/relatorio" ? "active-route" : ""
                  }`}
                  title={"Relatório"}
                >
                  <DataThresholdingIcon fontSize={"small"} />
                  {!isCollapsed && <span>Relatório</span>}
                </button>
              </>
            )}

            {!isUsuarioTipo3 && (
              <button
                onClick={() => handleNavigate("/cursos")}
                className={`nav-button ${
                  activeRoute === "/cursos" ? "active-route" : ""
                }`}
                title={"Cursos"}
              >
                <VideoCameraFrontIcon fontSize={"small"} />
                {!isCollapsed && <span>Cursos</span>}
              </button>
            )}

            {!isCollapsed && (
              <label className="section-label">Configurações</label>
            )}
            <button
              onClick={() => handleNavigate("/cadastro")}
              className={`nav-button ${
                activeRoute === "/cadastro" ? "active-route" : ""
              }`}
              title={"Cadastro de Configurações"}
            >
              <MiscellaneousServicesIcon fontSize={"small"} />
              {!isCollapsed && <span>Cadastro</span>}
            </button>
          </div>
        </div>

        {/* Espaço para compensar a navbar fixa */}
        <div
          className={`nav-space ${isCollapsed ? "collapsed" : "expanded"}`}
        ></div>
      </div>

      {/* Navbar para mobile (permanece igual) */}
      <div className="lg:hidden flex w-full h-[50px] bg-primary fixed top-0 left-0 z-50">
        {user ? (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <IconButton onClick={toggleMenu} style={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
          </div>
        ) : (
          <></>
        )}
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

              {!isUsuarioTipo3 && (
                <>
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

                  <Button
                    fullWidth
                    onClick={() => handleNavigate("/cursos")}
                    startIcon={<VideoCameraFrontIcon fontSize="small" />}
                    className="text-left"
                    title="Ir para Cursos"
                    sx={{
                      justifyContent: "flex-start",
                      padding: "10px 16px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f4f4f4",
                      },
                    }}
                  >
                    Cursos
                  </Button>
                </>
              )}
            </List>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default Navbar;
