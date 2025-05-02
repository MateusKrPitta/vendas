import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/header";
import HeaderPerfil from "../../../components/navbars/perfil";
import ButtonComponent from "../../../components/button";
import HeaderCadastro from "../../../components/navbars/cadastro";
import TableComponent from "../../../components/table";
import CentralModal from "../../../components/modal-central";
import ModalLateral from "../../../components/modal-lateral";
import MenuMobile from "../../../components/menu-mobile";
import CustomToast from "../../../components/toast";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { InputAdornment, TextField } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import { LocationOnOutlined, Save } from "@mui/icons-material";
import { unidadeLocal } from "../../../entities/headers/unidade";
import { criarUnidade } from "../../../service/post/unidade";
import { buscarUnidades } from "../../../service/get/unidade";
import { cadastrosUnidades } from "../../../entities/class/cadastro/unidades";
import { atualizarUnidade } from "../../../service/put/unidade";
import { inativarUnidade } from "../../../service/delete/unidade";
import { reativaUnidade } from "../../../service/reativa/unidade";
import TableLoading from "../../../components/loading/loading-table/loading";

const Unidades = () => {

  const navigate = useNavigate();
  const [filtroNome, setFiltroNome] = useState("");
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [mensagemErro, setMensagemErro] = useState('');

  const [unidades, setUnidades] = useState([]);
  const [cadastradasNovas, setCadastrarUnidadeNovas] = useState([]);

  const [editando, setEditando] = useState(false);
  const [cadastrarUnidade, setCadastrarUnidade] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState(null);
  const [unidadeEditada, setUnidadeEditada] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const handleCadastroUnidade = () => {
    setCadastrarUnidade(true);
    setUnidadeEditando(null);
    setNomeUnidade("");
  };

  const handleCloseCadastroUnidade = () => {
    setCadastrarUnidade(false);
  };


  const Editar = (unidade) => {
    setUnidadeEditando(unidade);
    setUnidadeEditada({ nome: unidade.nome });
    setEditando(true);
  };

  const Cadastrar = async () => {
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    try {
      setLoading(true);

      if (!nomeUnidade.trim()) {
        setMensagemErro("Por favor, preencha o nome da unidade");
        setIsVisible(true);
        return;
      }

      const userData = localStorage.getItem('user');
      const token = userData ? JSON.parse(userData).token : null;

      if (!token) {
        setMensagemErro("Sessão expirada. Por favor, faça login novamente.");
        setIsVisible(true);
        navigate('/');
        return;
      }

      const response = await criarUnidade(nomeUnidade);

      if (response) {
        setCadastrarUnidadeNovas(false);
        setUnidades([...unidades, response]);
        setNomeUnidade("");
        CustomToast({ type: 'success', message: 'Unidade cadastrada com sucesso!' });
      }
    } catch (error) {
      console.error("Erro ao cadastrar unidade:", error);
      if (error.message === "Autenticação necessária") {
        navigate('/');
      } else {
        setMensagemErro(error.message || "Erro ao cadastrar unidade");
        setIsVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };


  const buscarUnidadesCadastradas = async () => {
    try {
      setLoading(true);
      const response = await buscarUnidades();


      if (Array.isArray(response)) {

        const unidadesFormatadas = response.map(u => ({
          ...u,
          ativo: Boolean(u.ativo)
        }));
        setUnidades(unidadesFormatadas);
      }
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      setMensagemErro(error.message || "Erro ao buscar unidades");
      setIsVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const SalvarEdicao = async () => {
    if (!unidadeEditando) return;
    try {
      const updatedUnit = await atualizarUnidade(unidadeEditada.nome, unidadeEditando.id);
      setUnidades((prevUnidades) =>
        prevUnidades.map((unidade) =>
          unidade.id === updatedUnit.id ? updatedUnit : unidade
        )
      );
      CustomToast({ type: "success", message: 'Unidade atualizada com sucesso!' });
      setEditando(false);
    } catch (error) {
      console.error("Erro ao atualizar unidade:", error);
    }
  };

  const unidadesFiltradas = unidades.filter(unidade =>
    unidade.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  const handleInactivateUnidade = async (row) => {
    if (row.ativo === "Ativo" || row.ativo === true) {

      await inativarUnidade(row.id);
    } else {

      await reativaUnidade(row.id);
    }

    await buscarUnidadesCadastradas();
  };


  useEffect(() => {
    buscarUnidadesCadastradas();
  }, []);
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
          <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
            <LocationOnOutlined />
            Unidade
          </h1>
          <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
            <div className="hidden lg:w-[14%] lg:flex  ">
              <HeaderCadastro />
            </div>
            <div className="w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
              <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Buscar unidade"
                  autoComplete="off"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  sx={{ width: { xs: "72%", sm: "50%", md: "40%", lg: "40%" } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnOutlined />
                      </InputAdornment>
                    ),
                  }}
                />

                <ButtonComponent
                  startIcon={<AddCircleOutlineIcon fontSize="small" />}
                  title={"Cadastrar"}
                  subtitle={"Cadastrar"}
                  buttonSize="large"
                  onClick={handleCadastroUnidade}
                />
              </div>

              <div className='w-full'>
                {loading ? (
                  <TableLoading />
                ) : unidadesFiltradas.length > 0 ? (
                  <TableComponent
                    headers={unidadeLocal}
                    rows={cadastrosUnidades(unidades)}
                    actionsLabel={"Ações"}
                    actionCalls={{
                      edit: Editar,
                      inactivate: handleInactivateUnidade,
                    }}
                  />
                ) : (
                  <div className="text-center flex items-center mt-28 justify-center gap-5 flex-col text-primary">
                    <TableLoading />
                    <label className="text-sm">Unidade não encontrada!</label></div>
                )}
              </div>

              <CentralModal
                tamanhoTitulo={"81%"}
                maxHeight={"90vh"}
                top={"20%"}
                left={"28%"}
                width={"400px"}
                icon={<AddCircleOutlineIcon fontSize="small" />}
                open={cadastrarUnidade}
                onClose={handleCloseCadastroUnidade}
                title="Cadastrar Unidade"
              >
                <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <TextField
                      id="nomeUnidade"
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome da Unidade"
                      autoComplete="off"
                      value={nomeUnidade}
                      onChange={(e) => setNomeUnidade(e.target.value)}
                      sx={{ width: { xs: "95%", sm: "100%", md: "40%", lg: "95%" } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnOutlined />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <div className="flex w-[96%] items-end justify-end ">
                      <ButtonComponent
                        startIcon={<AddCircleOutlineIcon fontSize="small" />}
                        title={"Cadastrar"}
                        subtitle={"Cadastrar"}
                        onClick={Cadastrar}
                        disabled={loading}
                        buttonSize="large"
                      />
                    </div>
                  </div>
                </div>
              </CentralModal>


              <ModalLateral
                open={editando}
                handleClose={() => setEditando(false)}
                icon={<EditIcon fontSize={"small"} />}
                tituloModal={"Editar Unidade"}
                tamanhoTitulo={"73%"}
                conteudo={
                  <>
                    <div className="mt-4 flex gap-3 flex-wrap w-full">
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Nome da Unidade"
                        autoComplete="off"
                        value={unidadeEditada ? unidadeEditada.nome : ""}
                        onChange={(e) =>
                          setUnidadeEditada({ ...unidadeEditada, nome: e.target.value })
                        }
                        sx={{ width: "100%" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <div className="flex w-[100%] items-end justify-end ">
                        <ButtonComponent
                          startIcon={<Save fontSize="small" />}
                          title={"Salvar"}
                          subtitle={"Salvar"}
                          buttonSize="large"
                          onClick={SalvarEdicao}
                        />
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Unidades;