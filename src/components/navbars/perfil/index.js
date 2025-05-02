import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearIcon from '@mui/icons-material/Clear';
import { Modal, Box, Menu, MenuItem, Typography } from "@mui/material";
import Title from "../../title";
import ButtonComponent from "../../button";
import SelectTextFields from "../../select";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import CustomToast from "../../toast";
import { buscarUnidades } from "../../../service/get/unidade";
import { useUnidade } from "../../../contexts";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const HeaderPerfil = () => {
  
  const { unidadeId, atualizarUnidade } = useUnidade();
  const navigate = useNavigate();
  const [mensagemErro, setMensagemErro] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unidades, setUnidades] = useState([]);


  const userData = JSON.parse(localStorage.getItem('user'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLogoutConfirm = () => setOpenLogoutConfirm(true);
  const handleCloseLogoutConfirm = () => setOpenLogoutConfirm(false);

  const confirmLogout = async () => {
    handleCloseLogoutConfirm();
    localStorage.clear();
    navigate("/");
    CustomToast({ type: "success", message: "Logout realizado com sucesso!" });
  };

  const buscarUnidadesCadastradas = async () => {
    try {
      setLoading(true);
      const response = await buscarUnidades();
      console.log('Dados brutos da API:', response);

      if (Array.isArray(response)) {

        const unidadesFormatadas = response
          .filter(u => u.id === userData?.unidadeId) 
          .map(u => ({
            value: u.id,
            label: u.nome,
            ativo: u.ativo
          }));

        console.log('Unidades formatadas para select:', unidadesFormatadas);
        setUnidades(unidadesFormatadas);
        

        if (unidadesFormatadas.length > 0 && !unidadeId) {
          atualizarUnidade(unidadesFormatadas[0].value);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      setMensagemErro(error.message || "Erro ao buscar unidades");
      setIsVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarUnidadesCadastradas();
  }, []);

  const handleUnidadeChange = (event) => {
    const novaUnidadeId = event.target.value;
    atualizarUnidade(novaUnidadeId); 
  };

  return (
    <>
      <div className="hidden lg:flex justify-end w-full h-8">
        <div
          className="flex items-center justify-between pl-3 pr-4 w-[40%] h-20 bg-cover bg-no-repeat rounded-bl-lg"
          style={{ backgroundColor: '#0d2d43' }}
        >
          <div className="w-[100%] items-star flex flex-wrap gap-4 p-2">
            <div className="w-[53%] p-2 bg-white rounded-md flex justify-center">
              <SelectTextFields
                width={'150px'}
                icon={<LocationOnIcon fontSize="small" />}
                label={'Unidades'}
                backgroundColor={"#D9D9D9"}
                borderRadius={'5px'}
                name={"unidade"}
                fontWeight={500}
                value={unidadeId || ''} 
                onChange={handleUnidadeChange} 
                options={unidades}
                disabled={unidades.length === 1}
              />
            </div>

            <div className="w-[30%] flex items-center mt-3 justify-start text-white gap-2">
              <a className="cursor-pointer p-1">
                <AccountCircleIcon />
              </a>
              <span className="text-xs text-white font-bold">
                {userData?.fullName || "Usuário"}
              </span>
            </div>
          </div>
          <div className="w-[10%] flex justify-center items-center" style={{ backgroundColor: 'white', borderRadius: '50px', padding: '8px', marginLeft: '16px' }}>
            <a onClick={handleMenuOpen} className="cursor-pointer p-1">
              <LogoutIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Menu e Modal permanecem iguais */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="p-4"
      >
        <MenuItem onClick={handleOpenLogoutConfirm} title="Sair do sistema" className="flex items-center gap-2">
          <LogoutIcon fontSize="small" className="text-red" /> Sair
        </MenuItem>
      </Menu>

      <Modal
        open={openLogoutConfirm}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box sx={style}>
          <div className='flex justify-between'>
            <Typography id="logout-modal-title" variant="h6" component="h2">
              <Title
                conteudo={"Confirmação de Logout"}
                fontSize={"18px"}
                fontWeight={"700"}
                color={"black"}
              />
            </Typography>
            <button className='text-red' title="Fechar" onClick={handleCloseLogoutConfirm}><ClearIcon /></button>
          </div>
          <Typography id="logout-modal-description" sx={{ mt: 2 }}>
            <Title
              conteudo={"Tem certeza de que deseja sair?"}
              fontSize={"15px"}
              fontWeight={"500"}
            />
          </Typography>
          <div className="flex gap-2 justify-end mt-4">
            <ButtonComponent
              subtitle={"Confirmar Logout"}
              title={"SIM"}
              onClick={confirmLogout}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default HeaderPerfil;