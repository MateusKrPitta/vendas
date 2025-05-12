import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import SubjectIcon from '@mui/icons-material/Subject';
import { InputAdornment, TextField } from '@mui/material';
import ButtonComponent from '../../../components/button';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TableComponent from '../../../components/table';
import CentralModal from '../../../components/modal-central';
import CustomToast from '../../../components/toast';
import { useUnidade } from '../../../contexts';
import { Article, Edit, Numbers, Print, } from '@mui/icons-material';
import { motion } from 'framer-motion';
import TableLoading from '../../../components/loading/loading-table/loading';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { buscarListaCompra } from '../../../service/get/lista-compra';
import { criarListaCompra } from '../../../service/post/lista-compra';
import { deletarItemListaCompra } from '../../../service/delete/lista-compra';
import { listaCompra } from '../../../entities/headers/lista-compra';
import HeaderRelatorio from '../../../components/navbars/relatorio';

const ListaCompra = () => {
    const { unidadeId } = useUnidade();
    const [loading, setLoading] = useState(false);
    const [itensLista, setItensLista] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [produto, setProduto] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [busca, setBusca] = useState("");

    const handleCloseCadastroCategoria = () => {
        setModalAberto(false);
    };

    const Cadastrar = () => {
        setModalAberto(true);
        setQuantidade(""); 
        setProduto("");
    };
    const handleBuscaChange = (e) => {
        const texto = e.target.value;
        setBusca(texto);
    };

    const buscarItensLista = async () => {
        setLoading(true);
        try {
            const response = await buscarListaCompra(unidadeId);
            setItensLista(response);
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
            setItensLista([]);
        } finally {
            setLoading(false);
        }
    };

    const adicionarItem = async () => {
        try {
            setLoading(true);
            await criarListaCompra(produto, quantidade, unidadeId);
            setModalAberto(false);
            setProduto("");
            setQuantidade("");
            buscarItensLista();
        } catch (error) {
            console.error("Erro ao adicionar item:", error);
        } finally {
            setLoading(false);
        }
    };

    const removerItem = async (id) => {
        try {
            setLoading(true);
            await deletarItemListaCompra(id);
            CustomToast({ type: "success", message: "Item removido com sucesso!" });
            buscarItensLista();
        } catch (error) {
            console.error("Erro ao remover item:", error);
            CustomToast({
                type: "error",
                message: error.response?.data?.message || "Erro ao remover item!"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (unidadeId) {
            buscarItensLista();
        }
    }, [unidadeId]);
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const itensFiltrados = itensLista.filter(item =>
        item.produto.toLowerCase().includes(busca.toLowerCase())
    );

    const tabelaRef = useRef();

    const handlePrint = () => {
       
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Lista de Compras</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    .no-print { display: none; }
                </style>
            </head>
            <body>
                <h1>Lista de Compras</h1>
                <table>
                    <thead>
                        <tr>
                            ${listaCompra.map(header => `<th>${header.label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${itensFiltrados.map(item => `
                            <tr>
                                <td>${item.produto || ''}</td>
                                <td>${item.quantidade || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <script>
                    // Imprime automaticamente quando a janela carrega
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            // Fecha a janela após impressão (opcional)
                            // window.close();
                        }, 200);
                    };
                </script>
            </body>
            </html>
        `;

       
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
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
                    <h1 className='justify-center md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex gap-2'>
                        <FormatListBulletedIcon />
                        Lista Compra
                    </h1>
                    <div className="items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                        <div className="hidden lg:w-[14%] lg:flex">
                            <HeaderRelatorio />
                        </div>
                        <div className="w-[100%] itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
                            <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={busca} 
                                    onChange={handleBuscaChange}
                                    label="Buscar Produto"
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
                                    onClick={Cadastrar}
                                    buttonSize="large"
                                />

                                <ButtonComponent
                                    startIcon={<Print fontSize="small" />} 
                                    title={"Imprimir"}
                                    subtitle={"Imprimir"}
                                    onClick={handlePrint}
                                    buttonSize="large"
                                />
                            </div>

                            {loading ? (
                                <TableLoading />
                            ) : itensFiltrados.length === 0 ? (
                                <div className="text-center flex items-center mt-28 justify-center gap-5 flex-col text-primary">
                                    <TableLoading />
                                    <label className="text-sm">Produto não encontrado!</label></div>
                            ) : (
                                <TableComponent
                                    headers={listaCompra}
                                    rows={itensFiltrados}
                                    actionsLabel={"Ações"}
                                    actionCalls={{
                                        delete: (row) => removerItem(row.id),
                                    }}
                                />
                            )}

                            <CentralModal
                                tamanhoTitulo={"81%"}
                                maxHeight={"90vh"}
                                top={"20%"}
                                left={"28%"}
                                width={"400px"}
                                icon={<AddCircleOutlineIcon fontSize="small" />}
                                open={modalAberto}
                                onClose={handleCloseCadastroCategoria}
                                title="Cadastrar Produto"
                            >
                                <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                                    <div className="mt-4 flex gap-3 flex-wrap">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Nome do Produto"
                                            value={produto}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Article />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            onChange={(e) => setProduto(e.target.value)}
                                            sx={{ width: "60%" }}
                                        />
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Quantidade"
                                            type="number"
                                            value={quantidade}
                                            onChange={(e) => setQuantidade(e.target.value)}
                                            sx={{ width: "30%" }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Numbers />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <div className="flex w-[96%] items-end justify-end ">
                                            <ButtonComponent
                                                startIcon={<AddCircleOutlineIcon fontSize="small" />}
                                                title={"Cadastrar"}
                                                subtitle={"Cadastrar"}
                                                onClick={adicionarItem}
                                                buttonSize="large"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CentralModal>


                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ListaCompra;