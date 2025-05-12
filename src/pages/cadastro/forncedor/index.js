import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/header";
import HeaderPerfil from "../../../components/navbars/perfil";
import ButtonComponent from "../../../components/button";
import HeaderCadastro from "../../../components/navbars/cadastro";
import TableComponent from "../../../components/table";
import CentralModal from "../../../components/modal-central";
import ModalLateral from "../../../components/modal-lateral";
import MenuMobile from "../../../components/menu-mobile";
import CategoryIcon from '@mui/icons-material/Category';
import { InputAdornment, TextField } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import { LocationOnOutlined, Phone, Save } from "@mui/icons-material";
import { fornecedores } from "../../../entities/headers/fornecedores";
import { criarFornecedor } from "../../../service/post/fornecedor";
import { motion } from 'framer-motion';
import { buscarFornecedor } from "../../../service/get/fornecedor";
import { atualizarFornecedor } from "../../../service/put/forncedor";
import { TelefoneInput } from "../../../utils/mascaras/telefone";

import { reativaFornecedor } from "../../../service/reativa/fornecedor";
import TableLoading from "../../../components/loading/loading-table/loading";

const Fornecedor = () => {
  const [editando, setEditando] = useState(false);
  const [cadastrarUnidade, setCadastrarUnidade] = useState(false);
  const [filtroNome, setFiltroNome] = useState("");
  const [fornecedorCadastradas, setFornecedorCadastradas] = useState([]);
  const [nomeFornecedor, setNomeFornecedor] = useState("");
  const [telefoneFornecedor, setTelefoneFornecedor] = useState("");
  const [unidadeEditando, setUnidadeEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const buscaFornecedores = async () => {
    try {
      const response = await buscarFornecedor();
      setFornecedorCadastradas(response.data);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    }
  };

  useEffect(() => {
    buscaFornecedores();
  }, []);

  const handleCadastroUnidade = () => {
    setCadastrarUnidade(true);
    setNomeFornecedor("");
    setTelefoneFornecedor("");
  };

  const handleCloseCadastroUnidade = () => {
    setCadastrarUnidade(false);
  };

  const Editar = (fornecedor) => {
    setEditando(true);
    setNomeFornecedor(fornecedor.nome);
    setTelefoneFornecedor(fornecedor.telefone);
    setUnidadeEditando(fornecedor.id);
  };

  const CadastrarFornecedor = async () => {
    try {
      setLoading(true);
      await criarFornecedor(nomeFornecedor, telefoneFornecedor);
      setCadastrarUnidade(false);
      buscaFornecedores();
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
      setMensagemErro(error.message || "Erro ao cadastrar fornecedor");
    } finally {
      setLoading(false);
    }
  };

  const SalvarFornecedorEditado = async () => {
    try {
      setLoading(true);

      await atualizarFornecedor(nomeFornecedor, telefoneFornecedor, unidadeEditando);
      setEditando(false);
      buscaFornecedores();
    } catch (error) {
      console.error("Erro ao editar fornecedor:", error);
      setMensagemErro(error.message || "Erro ao editar fornecedor");
    } finally {
      setLoading(false);
    }
  };



  const inativarFornecedor = async (row) => {
    try {
      setLoading(true);
      if (row.status === "ativo") {
        await inativarFornecedor(row.id);
      } else {

        await reativaFornecedor(row.id);
      }
      buscaFornecedores();
    } catch (error) {
      console.error("Erro ao alterar status do fornecedor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const fornecedoresFiltrados = fornecedorCadastradas.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

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
          <h1 className='justify-center md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex gap-2'>
            <CategoryIcon />
            Fornecedor
          </h1>
          <div className="items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
            <div className="hidden lg:w-[14%] lg:flex">
              <HeaderCadastro />
            </div>
            <div className="w-[100%] itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
              <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Buscar Fornecedor"
                  autoComplete="off"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  sx={{ width: { xs: "72%", sm: "50%", md: "40%", lg: "40%" } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon />
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
                ) : fornecedoresFiltrados.length > 0 ? (
                  <TableComponent
                    headers={fornecedores}
                    rows={fornecedoresFiltrados}
                    actionsLabel={"Ações"}
                    actionCalls={{
                      edit: Editar,
                      delete: inativarFornecedor,
                    }}
                  />
                ) : (
                  <div className="text-center flex items-center mt-28 justify-center gap-5 flex-col text-primary">
                    <TableLoading />
                    <label className="text-sm">Fornecedor não encontrado!</label></div>
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
                title="Cadastrar Fornecedor"
              >
                <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <TextField
                      id="nomeFornecedor"
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome do Fornecedor"
                      autoComplete="off"
                      value={nomeFornecedor}
                      onChange={(e) => setNomeFornecedor(e.target.value)}
                      sx={{ width: { xs: "95%", sm: "100%", md: "40%", lg: "95%" } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnOutlined />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TelefoneInput
                      value={telefoneFornecedor}
                      onChange={(e) => setTelefoneFornecedor(e.target.value)}
                    />


                    <div className="flex w-[96%] items-end justify-end ">
                      <ButtonComponent
                        startIcon={<AddCircleOutlineIcon fontSize="small" />}
                        title={"Cadastrar"}
                        subtitle={"Cadastrar"}
                        onClick={CadastrarFornecedor}
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
                tituloModal={"Editar Fornecedor"}
                tamanhoTitulo={"73%"}
                conteudo={
                  <>
                    <div className="mt-4 flex gap-3 flex-wrap w-full">

                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Nome do Fornecedor"
                        autoComplete="off"
                        value={nomeFornecedor}
                        onChange={(e) => setNomeFornecedor(e.target.value)}
                        sx={{ width: "100%" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TelefoneInput
                      value={telefoneFornecedor}
                      onChange={(e) => setTelefoneFornecedor(e.target.value)}
                    />

                     
                      <div className="flex w-[100%] items-end justify-end ">
                        <ButtonComponent
                          startIcon={<Save fontSize="small" />}
                          title={"Salvar"}
                          subtitle={"Salvar"}
                          buttonSize="large"
                          onClick={SalvarFornecedorEditado}
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

export default Fornecedor;