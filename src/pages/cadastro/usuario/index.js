import React, { useState, useEffect } from "react";
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import ButtonComponent from '../../../components/button';
import HeaderCadastro from '../../../components/navbars/cadastro';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from "../../../components/select";
import Checkbox from '@mui/material/Checkbox';
import MenuMobile from "../../../components/menu-mobile";
import ModalLateral from "../../../components/modal-lateral";
import { Close, Edit, } from '@mui/icons-material';
import TableLoading from "../../../components/loading/loading-table/loading";
import { Box, Chip, FormControlLabel, IconButton, InputAdornment, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotesIcon from '@mui/icons-material/Notes';
import { LocationOnOutlined, Password } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CustomToast from "../../../components/toast";
import TableComponent from "../../../components/table";
import { buscarUnidades } from "../../../service/get/unidade";
import { criarUsuario } from "../../../service/post/usuario";
import { UsuariosCadastrados } from "../../../entities/headers/usuarios";
import { buscarUsuarios } from "../../../service/get/usuarios";
import { atualizarUsuario } from "../../../service/put/usuario";
import { inativarUsuario } from "../../../service/delete/usuario";
import { reativaUsuario } from "../../../service/reativa/usuario";
import { motion } from 'framer-motion';

const Usuario = () => {

  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cadastroUsuario, setCadastroUsuario] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [permissao, setPermissao] = useState(null);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [unidadesSelecionadas, setUnidadesSelecionadas] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const FecharCadastroUsuario = () => {
    setCadastroUsuario(false);
    limparCampos();
  };


  const buscarUnidadesCadastradas = async () => {
    try {
      const response = await buscarUnidades();
      const unidadesFormatadas = response.map(u => ({
        value: u.id,
        label: u.nome,
        ativo: u.ativo
      }));
      setUnidades(unidadesFormatadas);
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      CustomToast('Erro ao buscar unidades!', 'error');
    }
  };

  const limparCampos = () => {
    setNomeCompleto('');
    setEmail('');
    setSenha('');
    setUnidadesSelecionadas([]);
    setPermissao(null);
    setUnidadeSelecionada(null);
    setEditUser(null);
  };

  const buscarUsuariosCadastrados = async () => {
    try {
      setLoading(true);
      const response = await buscarUsuarios();
      const usuariosFormatados = response.map(usuario => {
        const unidadePrincipal = usuario.unidadeId
          ? unidades.find(u => u.value === usuario.unidadeId)
          : null;

        const unidadesAdicionais = usuario.unidades || [];

        const todasUnidades = [
          ...(unidadePrincipal ? [unidadePrincipal.label] : []),
          ...unidadesAdicionais.map(u => u.nome)
        ];

        const unidadesTexto = todasUnidades.join(', ') || 'Sem unidade';

        return {
          id: usuario.id,
          nome: usuario.fullName || 'Nome não disponível',
          email: usuario.email || 'Email não disponível',
          unidade: unidadesTexto,
          ativo: usuario.ativo ? 'Ativo' : 'Inativo',
          tipo: usuario.tipo
        };
      });
      setUsers(usuariosFormatados);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      CustomToast('Erro ao buscar usuários!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const CadastrarUsuario = async () => {
    try {
      await criarUsuario(nomeCompleto, email, senha, unidadesSelecionadas, permissao);
      CustomToast('Usuário cadastrado com sucesso!', 'success');
      setCadastroUsuario(false);
      buscarUsuariosCadastrados();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      CustomToast('Erro ao cadastrar usuário!', 'error');
    }
  };

  const EditarUsuario = async () => {
    try {
      await atualizarUsuario(
        editUser.id,
        nomeCompleto,
        email,
        null,
        permissao,
        senha || undefined,
        unidadesSelecionadas 
      );
      CustomToast('Usuário editado com sucesso!', 'success');
      setEditando(false);
      buscarUsuariosCadastrados();
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      CustomToast(error.response?.data?.message || 'Erro ao editar usuário!', 'error');
    }
  };
  const handleCloseEdicao = () => {
    setEditando(false);
    limparCampos(); 
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setNomeCompleto(user.nome);
    setEmail(user.email);
    setSenha('');
  
    const unidadesArray = user.unidade.split(', ');
    const unidadesIds = unidadesArray
      .map(nome => unidades.find(u => u.label === nome)?.value)
      .filter(Boolean);
    
    setUnidadesSelecionadas(unidadesIds);
    setPermissao(user.tipo);
    setEditando(true);
  };

  const handleInactivateUser = async (user) => {
    try {
      if (user.ativo === "Ativo" || user.ativo === true) {
        await inativarUsuario(user.id);
      } else {
        await reativaUsuario(user.id);
      }
      buscarUsuariosCadastrados();
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
    }
  };

  const handleDeleteUnidade = (unidadeToDelete) => () => {
    setUnidadesSelecionadas(unidadesSelecionadas.filter(unidade => unidade !== unidadeToDelete));
  };

  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    buscarUnidadesCadastradas();
  }, []);

  useEffect(() => {
    if (unidades.length > 0) {
      buscarUsuariosCadastrados();
    }
  }, [unidades]);
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-0 lg:ml-2'>
        <MenuMobile />
        <motion.div
          style={{ width: '100%' }}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.9 }}
        >
          <HeaderPerfil />
          <h1 className='justify-center md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex gap-2 '>
            <AccountCircleIcon />Usuário
          </h1>
          <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
            <div className="hidden lg:w-[14%] lg:flex">
              <HeaderCadastro />
            </div>
            <div className="w-[100%] itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
              <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Buscar usuário"
                  autoComplete="off"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: { xs: '72%', sm: '50%', md: '40%', lg: '40%' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <ButtonComponent
                  startIcon={<AddCircleOutlineIcon fontSize='small' />}
                  title={'Cadastrar'}
                  subtitle={'Cadastrar'}
                  buttonSize="large"
                  onClick={() => setCadastroUsuario(true)}
                />
              </div>
              <div className='w-full'>
                {loading ? (
                  <TableLoading />
                ) : filteredUsers.length > 0 ? (
                  <TableComponent
                    headers={UsuariosCadastrados}
                    rows={filteredUsers}
                    actionsLabel={"Ações"}
                    actionCalls={{
                      edit: handleEditClick,
                      inactivate: handleInactivateUser,
                    }}
                  />
                ) : (
                  <div className="text-center flex items-center mt-28 justify-center gap-5 flex-col text-primary">
                    <TableLoading />
                    <label className="text-sm">Usuário não encontrado!</label></div>
                )}
              </div>


              <CentralModal
                tamanhoTitulo={'81%'}
                maxHeight={'90vh'}
                top={'20%'}
                left={'28%'}
                width={'620px'}
                icon={<AddCircleOutlineIcon fontSize="small" />}
                open={cadastroUsuario}
                onClose={FecharCadastroUsuario}
                title="Cadastrar Usuário"
              >
                <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                  <div className='mt-4 flex gap-3 flex-wrap'>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome Completo"
                      name="nome"
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      autoComplete="off"
                      sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '47%' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Email"
                      name="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      sx={{ width: { xs: '48%', sm: '43%', md: '45%', lg: '47%' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NotesIcon />
                          </InputAdornment>
                        ),

                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="password"
                      label="Senha"
                      name="senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      autoComplete="off"
                      sx={{ width: { xs: '48%', sm: '40%', md: '40%', lg: '47%' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Password />
                          </InputAdornment>
                        ),

                      }}
                    />

                    <SelectTextFields
                      width={'260px'}
                      icon={<LocationOnOutlined fontSize="small" />}
                      label={'Unidades'}
                      backgroundColor={"#D9D9D9"}
                      name={"unidades"}
                      fontWeight={500}
                      value={unidadesSelecionadas}
                      onChange={(e) => setUnidadesSelecionadas(e.target.value)}
                      options={unidades}
                      multiple
                    />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, ml: 1 }}>
                      {unidadesSelecionadas.map((unidadeId) => {
                        const unidade = unidades.find(u => u.value === unidadeId);
                        return (
                          <Chip
                            key={unidadeId}
                            label={unidade ? unidade.label : 'Unidade não encontrada'}
                            onDelete={handleDeleteUnidade(unidadeId)}
                            deleteIcon={<IconButton size="small"><Close fontSize="small" /></IconButton>}
                            variant="outlined"
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  </div>


                  <div className="w-full flex items-center mt-4 ml-2 font-bold mb-1">
                    <label className="w-[70%] text-xs">Permissão</label>
                  </div>
                  <div className="flex flex-col gap-1 w-[95%]  border-[1px] p-3 rounded-lg">
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={permissao === 1}
                          onChange={() => setPermissao(1)}
                        />
                      }
                      label="Administrador"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={permissao === 2}
                          onChange={() => setPermissao(2)}
                        />
                      }
                      label="Cliente"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={permissao === 3}
                          onChange={() => setPermissao(3)}
                        />
                      }
                      label="Funcionário"
                    />
                  </div>
                  <div className="flex w-[96%] items-end justify-end mt-2 ">
                    <ButtonComponent
                      startIcon={<AddCircleOutlineIcon fontSize='small' />}
                      title={'Cadastrar'}
                      subtitle={'Cadastrar'}
                      onClick={CadastrarUsuario}
                      buttonSize="large"
                    />
                  </div>
                </div>
              </CentralModal>

              <ModalLateral
                open={editando}
                handleClose={handleCloseEdicao}
                tituloModal="Editar Usuário"
                icon={<Edit />}
                tamanhoTitulo="75%"
                conteudo={
                  <div className="">
                    <div className='mt-4 flex gap-3 flex-wrap'>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Nome Completo"
                        name="nome"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        autoComplete="off"
                        sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '47%' } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                        sx={{ width: { xs: '48%', sm: '45%', md: '40%', lg: '47%' } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <NotesIcon />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Senha"
                        name="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        autoComplete="off"
                        sx={{ width: { xs: '47%', sm: '50%', md: '40%', lg: '47%' } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Password />
                            </InputAdornment>
                          ),
                        }}
                      />
                     <SelectTextFields
  width={'260px'}
  icon={<LocationOnOutlined fontSize="small" />}
  label={'Unidades'}
  backgroundColor={"#D9D9D9"}
  name={"unidades"}
  fontWeight={500}
  value={unidadesSelecionadas}
  onChange={(e) => setUnidadesSelecionadas(e.target.value)}
  options={unidades}
  multiple
/>
                    </div>
                    <div className="w-full flex items-center mt-4 ml-2 font-bold mb-1">
                      <label className="w-[70%] text-xs">Permissão</label>
                    </div>
                    <div className="flex flex-col gap-1 w-[95%]  border-[1px] p-3 rounded-lg">
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={permissao === 1}
                            onChange={() => setPermissao(1)}
                          />
                        }
                        label="Administrador"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={permissao === 2}
                            onChange={() => setPermissao(2)}
                          />
                        }
                        label="Cliente"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={permissao === 3}
                            onChange={() => setPermissao(3)}
                          />
                        }
                        label="Funcionário"
                      />
                    </div>


                    <div className="flex w-[96%] items-end justify-end mt-2 ">
                      <ButtonComponent
                        startIcon={<AddCircleOutlineIcon fontSize='small' />}
                        title={'Salvar'}
                        subtitle={'Salvar'}
                        buttonSize="large"
                        onClick={EditarUsuario}
                      />
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Usuario;