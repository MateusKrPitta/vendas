import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import SubjectIcon from '@mui/icons-material/Subject';
import { InputAdornment, TextField } from '@mui/material';
import HeaderCadastro from '../../../components/navbars/cadastro';
import ButtonComponent from '../../../components/button';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TableComponent from '../../../components/table';
import { categorias } from '../../../entities/headers/categoria';
import { buscarCategoria } from '../../../service/get/categoria';
import CentralModal from '../../../components/modal-central';
import { criarCategoria } from '../../../service/post/categoria';
import CustomToast from '../../../components/toast';
import { useUnidade } from '../../../contexts';
import ModalLateral from '../../../components/modal-lateral';
import { atualizarCategoria } from '../../../service/put/categoria';
import { Edit, SaveAlt } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { inativaCategoria } from '../../../service/patch/categoria-inativa';
import { ativaCategoria } from '../../../service/patch/categoria-ativa';
import TableLoading from '../../../components/loading/loading-table/loading';

const Categoria = () => {
    const { unidadeId } = useUnidade();
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [loading, setLoading] = useState(false);
    const [todasCategorias, setTodasCategorias] = useState([]);
    const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
    const [cadastrarCategoria, setCadastrarCategoria] = useState(false);
    const [editando, setEditando] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState("");
    const [busca, setBusca] = useState("");

    const Editar = (categoria) => {
        setCategoriaEditando(categoria);
        setEditando(true);
        setNomeCategoria(categoria.nome);
    };

    const handleCadastroCategoria = () => {
        setCadastrarCategoria(true);
        setNomeCategoria("");
    };

    const handleCloseCadastroCategoria = () => {
        setCadastrarCategoria(false);
    };

    const listaCategorias = async () => {
        setLoading(true);
        try {
            const response = await buscarCategoria(unidadeId);
            setCategoriasFiltradas(response.data || []); 
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            setCategoriasFiltradas([]); 
        } finally {
            setLoading(false);
        }
    };

    const CadastrarNovasCategoria = async () => {
        try {
            if (!unidadeId) {
                CustomToast({ type: "error", message: "Unidade não selecionada!" });
                return;
            }

            setLoading(true);
          
            await criarCategoria(nomeCategoria, unidadeId);
            CustomToast({ type: "success", message: "Categoria cadastrada com sucesso!" });
            setCadastrarCategoria(false);
            listaCategorias();
        } catch (error) {
            console.error("Erro detalhado:", error);
            CustomToast({
                type: "error",
                message: error.response?.data?.message || "Erro ao cadastrar categoria!"
            });
        } finally {
            setLoading(false);
        }
    };

    const SalvarCategoriaEditado = async () => {
        try {
            if (!unidadeId || !categoriaEditando?.id) {
                CustomToast({ type: "error", message: "Dados incompletos para edição!" });
                return;
            }

            setLoading(true);
            await atualizarCategoria(
                nomeCategoria,
                unidadeId,
                categoriaEditando.id 
            );
            CustomToast({ type: "success", message: "Categoria editada com sucesso!" });
            setEditando(false);
            listaCategorias(); 
        } catch (error) {
            console.error("Erro ao editar categoria:", error);
            CustomToast({
                type: "error",
                message: error.response?.data?.message || "Erro ao editar categoria!"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (categoria) => {
        try {
            if (categoria.ativo) {
                await inativaCategoria(categoria.id);
                CustomToast({ type: "success", message: "Categoria inativada com sucesso!" });
            } else {
                await ativaCategoria(categoria.id);
                CustomToast({ type: "success", message: "Categoria ativada com sucesso!" });
            }
            listaCategorias();
        } catch (error) {
            console.error("Erro ao alterar status da categoria:", error);
            CustomToast({
                type: "error",
                message: error.response?.data?.message || "Erro ao alterar status da categoria!"
            });
        }
    };

    const filtrarCategorias = (textoBusca) => {
        if (!textoBusca) {
            setCategoriasFiltradas(todasCategorias);
            return;
        }
    
        const filtradas = todasCategorias.filter(categoria =>
            categoria.nome.toLowerCase().includes(textoBusca.toLowerCase())
        );
    
        setCategoriasFiltradas(filtradas);
    };

    const handleBuscaChange = (e) => {
        const texto = e.target.value;
        setBusca(texto);
        filtrarCategorias(texto);
    };


    useEffect(() => {
        if (unidadeId) {
            listaCategorias();
        }
    }, [unidadeId]);
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    useEffect(() => {
        if (unidadeId) {
            const fetchCategorias = async () => {
                setLoading(true);
                try {
                    const response = await buscarCategoria(unidadeId);
                    setTodasCategorias(response.data || []);
                    setCategoriasFiltradas(response.data || []);
                } catch (error) {
                    console.error("Erro ao buscar categorias:", error);
                    setTodasCategorias([]);
                    setCategoriasFiltradas([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchCategorias();
        }
    }, [unidadeId]);
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
                        <SubjectIcon />
                        Categoria
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
                                    value={busca} 
    onChange={handleBuscaChange}
                                    label="Buscar Categoria"
                                    autoComplete="off"
                                    sx={{ width: { xs: "72%", sm: "50%", md: "40%", lg: "40%" } }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SubjectIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <ButtonComponent
                                    startIcon={<AddCircleOutlineIcon fontSize="small" />}
                                    title={"Cadastrar"}
                                    subtitle={"Cadastrar"}
                                    onClick={handleCadastroCategoria}
                                    buttonSize="large"
                                />
                            </div>

                            <div className='w-full'>
                                {loading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <>
                                        {categoriasFiltradas.length === 0 ? (
                                            <div className="text-center flex items-center mt-28 justify-center gap-5 flex-col text-primary">
                                            <TableLoading />
                                            <label className="text-sm">Categoria não encontrada!</label></div>
                                        ) : (
                                            <TableComponent
                                                headers={categorias}
                                                rows={categoriasFiltradas}
                                                actionsLabel={"Ações"}
                                                actionCalls={{
                                                    edit: Editar,
                                                    //inactivate: handleToggleStatus
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </div>

                            <CentralModal
                                tamanhoTitulo={"81%"}
                                maxHeight={"90vh"}
                                top={"20%"}
                                left={"28%"}
                                width={"400px"}
                                icon={<AddCircleOutlineIcon fontSize="small" />}
                                open={cadastrarCategoria}
                                onClose={handleCloseCadastroCategoria}
                                title="Cadastrar Categoria"
                            >
                                <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                                    <div className="mt-4 flex gap-3 flex-wrap">
                                        <TextField
                                            id="nomeFornecedor"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Nome da Categoria"
                                            autoComplete="off"
                                            value={nomeCategoria}
                                            onChange={(e) => setNomeCategoria(e.target.value)}
                                            sx={{ width: { xs: "95%", sm: "100%", md: "40%", lg: "95%" } }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SubjectIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />


                                        <div className="flex w-[96%] items-end justify-end ">
                                            <ButtonComponent
                                                startIcon={<AddCircleOutlineIcon fontSize="small" />}
                                                title={"Cadastrar"}
                                                subtitle={"Cadastrar"}
                                                onClick={CadastrarNovasCategoria}
                                                buttonSize="large"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CentralModal>

                            <ModalLateral
                                open={editando}
                                handleClose={() => setEditando(false)}
                                icon={<Edit fontSize={"small"} />}
                                tituloModal={"Editar Fornecedor"}
                                tamanhoTitulo={"73%"}
                                conteudo={
                                    <>
                                        <div className="mt-4 flex gap-3 flex-wrap w-full">
                                            <TextField
                                                id="nomeFornecedor"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                label="Nome da Categoria"
                                                autoComplete="off"
                                                value={nomeCategoria}
                                                onChange={(e) => setNomeCategoria(e.target.value)}
                                                sx={{ width: { xs: "95%", sm: "100%", md: "40%", lg: "95%" } }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SubjectIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />


                                            <div className="flex w-[100%] items-end justify-end ">
                                                <ButtonComponent
                                                    startIcon={<SaveAlt fontSize="small" />}
                                                    title={"Salvar"}
                                                    subtitle={"Salvar"}
                                                    buttonSize="large"
                                                    onClick={SalvarCategoriaEditado}
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
}

export default Categoria;