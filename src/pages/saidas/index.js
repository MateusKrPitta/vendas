import React, { useState, useEffect } from 'react';
import AddchartIcon from '@mui/icons-material/Addchart';
import Navbar from '../../components/navbars/header';
import MenuMobile from '../../components/menu-mobile';
import HeaderPerfil from '../../components/navbars/perfil';
import { AddCircleOutline, Edit, Money, Save } from '@mui/icons-material';
import ButtonComponent from '../../components/button';
import { InputAdornment, TextField } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SelectTextFields from '../../components/select';
import TableComponent from '../../components/table';
import Pix from '../../assets/icones/pix.png';
import Dinheiro from '../../assets/icones/dinheiro.png';
import Debito from '../../assets/icones/debito.png';
import Credito from '../../assets/icones/credito.png';
import Total from '../../assets/icones/moedas.png';
import ModalLateral from '../../components/modal-lateral';
import ArticleIcon from '@mui/icons-material/Article';
import { criarSaidas } from '../../service/post/saidas';
import { NumericFormat } from 'react-number-format';
import { SaidasVen } from '../../entities/headers/saidas';
import { buscarSaidas } from '../../service/get/saidas';
import { useUnidade } from '../../contexts';
import { deletarSaidas } from '../../service/delete/saidas';
import { atualizarSaidas } from '../../service/put/saidas';
import { motion } from 'framer-motion';

const Saidas = () => {
    const { unidadeId } = useUnidade();
    const [saidaEditando, setSaidaEditando] = useState(null);
    const [editando, setEditando] = useState(false);
    const [saidas, setSaidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formularioPrincipal, setFormularioPrincipal] = useState({
        descricao: '',
        valor: '',
        forma_pagamento: '',
        unidade_id: unidadeId,
    });

    const [formularioEdicao, setFormularioEdicao] = useState({
        descricao: '',
        valor: '',
        forma_pagamento: '',
        unidade_id: unidadeId,
    });

    const mapearFormaPagamento = (codigo) => {
        const formas = {
            1: 'Dinheiro',
            2: 'Pix',
            3: 'Cartão de Crédito',
            4: 'Cartão de Débito'
        };
        return formas[codigo] || codigo;
    };


    const buscaSaidas = async () => {
        try {
            setLoading(true);
            const response = await buscarSaidas();

            if (!response || !response.length) {
                setSaidas([]);
                setLoading(false);
                return;
            }

            const todasSaidas = response.flatMap(item => item.saidas || []);
            const saidasDaUnidade = todasSaidas.filter(saida => saida.unidade_id == unidadeId);

            const transformedData = saidasDaUnidade.map(saida => ({
                id: saida.id,
                descricao: saida.descricao,
                valor: new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(saida.valor),
                formaPagamento: mapearFormaPagamento(saida.forma_pagamento),
                data: saida.data_registro ? new Date(saida.data_registro).toLocaleDateString('pt-BR') : '-',
                valorOriginal: saida.valor,
                formaPagamentoOriginal: saida.forma_pagamento,
                unidadeId: saida.unidade_id
            }));

            setSaidas(transformedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {


            const valorNumerico = Number(formularioPrincipal.valor) || 0;

            await criarSaidas({
                ...formularioPrincipal,
                valor: valorNumerico,
                unidade_id: unidadeId
            });


            setFormularioPrincipal({
                descricao: '',
                valor: '',
                forma_pagamento: '',
                unidade_id: unidadeId
            });

            await buscaSaidas();
        } catch (error) {
            console.error("Erro ao salvar saída:", error);
        }
    };

    const handleAtualizar = async () => {
        try {

            await atualizarSaidas(
                saidaEditando.id,
                formularioEdicao.descricao,
                Number(formularioEdicao.valor),
                Number(formularioEdicao.forma_pagamento),
                unidadeId 
            );

            await buscaSaidas();
            setEditando(false);
            setSaidaEditando(null);
        } catch (error) {
        }
    };

    const calcularTotais = () => {
        const totais = {
            dinheiro: 0,
            pix: 0,
            debito: 0,
            credito: 0,
            total: 0
        };

        saidas.forEach(saida => {
            const valorNumerico = saida.valorOriginal || 0;
            const formaPagamento = saida.formaPagamentoOriginal;

            switch (formaPagamento) {
                case 1:
                    totais.dinheiro += valorNumerico;
                    break;
                case 2:
                    totais.pix += valorNumerico;
                    break;
                case 3:
                    totais.credito += valorNumerico;
                    break;
                case 4:
                    totais.debito += valorNumerico;
                    break;
                default:
                    console.warn('Forma de pagamento desconhecida:', formaPagamento);
            }

            totais.total += valorNumerico;
        });

        return totais;
    };

    const handleDelete = async (id) => {
        try {
            await deletarSaidas(id);
            await buscaSaidas();
        } catch (error) {
            console.error("Erro ao deletar saída:", error);
        }
    };

    const totais = calcularTotais();

    useEffect(() => {
        if (unidadeId) {
            buscaSaidas();
        }
    }, [unidadeId]);

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    return (
        <div className="flex w-full ">
            <Navbar />
            <motion.div
                style={{ width: '100%' }}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.9 }}
            >
                <div className='flex ml-0 flex-col gap-3 w-full items-end sm:m-0 '>
                    <MenuMobile />
                    <HeaderPerfil />
                    <h1 className='justify-center md:justify-center lg:justify-start items-center md:text-2xl font-bold text-primary w-[99%] flex gap-2 '>
                        <AddchartIcon style={{ color: '#0d2d43' }} /> Saídas
                    </h1>

                    {/* Formulário principal */}
                    <div className="flex gap-2 flex-wrap items-center w-full mt-6 justify-center md:justify-start p-2">
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Nome"
                            value={formularioPrincipal.descricao}
                            onChange={(e) => setFormularioPrincipal({ ...formularioPrincipal, descricao: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ArticleIcon fontSize='small' />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '20%' } }}
                        />

                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Valor"
                            value={formularioPrincipal.valor}
                            onValueChange={(values) => {
                                setFormularioPrincipal({ ...formularioPrincipal, valor: values.floatValue || 0 });
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CurrencyExchangeIcon />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '15%' } }}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            allowNegative={false}
                        />

                        <SelectTextFields
                            width={'175px'}
                            icon={<Money fontSize="small" />}
                            label={'Forma de Pagamento'}
                            backgroundColor={"#D9D9D9"}
                            name={"forma_pagamento"}
                            value={formularioPrincipal.forma_pagamento}
                            onChange={(e) => setFormularioPrincipal({ ...formularioPrincipal, forma_pagamento: e.target.value })}
                            options={[
                                { value: '1', label: 'Dinheiro' },
                                { value: '2', label: 'Pix' },
                                { value: '3', label: 'Cartão de Crédito' },
                                { value: '4', label: 'Cartão de Débito' }
                            ]}
                            fontWeight={500}
                        />

                        <ButtonComponent
                            title={'Adicionar'}
                            subtitle={'Adicionar'}
                            startIcon={<AddCircleOutline />}
                            onClick={handleSave}
                        />

                        {/* Tabela de saídas */}
                        <div className='w-full'>
                            <TableComponent
                                headers={SaidasVen}
                                rows={saidas}
                                loading={loading}
                                actionsLabel={"Ações"}
                                actionCalls={{
                                    delete: (row) => handleDelete(row.id),
                                }}
                            />
                        </div>

                        {/* Cards de totais */}
                        <div className='flex w-full items-center justify-center gap-2 flex-wrap' >
                            {/* Card Dinheiro */}
                            <div className='w-[45%] md:w-[17%] justify-center gap-8 flex items-center' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Dinheiro} alt="Dinheiro" />
                                <div className='flex flex-col w-[70%] gap-2'>
                                    <label className='text-sm font-bold'>Dinheiro</label>
                                    <label className='text-sm font-bold'>
                                        {totais.dinheiro.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </label>
                                </div>
                            </div>

                            {/* Card Pix */}
                            <div className='w-[45%] md:w-[17%] justify-center gap-8 flex items-center' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Pix} alt="Pix" />
                                <div className='flex flex-col w-[70%] gap-2'>
                                    <label className='text-sm font-bold'>Pix</label>
                                    <label className='text-sm font-bold'>
                                        {totais.pix.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </label>
                                </div>
                            </div>

                            {/* Card Débito */}
                            <div className='w-[45%] md:w-[17%] justify-center gap-8 flex items-center' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Debito} alt="Débito" />
                                <div className='flex flex-col w-[70%] gap-2'>
                                    <label className='text-sm font-bold'>Débito</label>
                                    <label className='text-sm font-bold'>
                                        {totais.debito.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </label>
                                </div>
                            </div>

                            {/* Card Crédito */}
                            <div className='w-[45%] md:w-[17%] justify-center gap-8 flex items-center' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }}  src={Credito} alt="Crédito" />
                                <div className='flex flex-col w-[70%] gap-2'>
                                    <label className='text-sm font-bold'>Crédito</label>
                                    <label className='text-sm font-bold'>
                                        {totais.credito.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </label>
                                </div>
                            </div>

                            {/* Card Total */}
                            <div className='w-[60%] md:w-[17%] justify-center gap-8 flex items-center mr-5' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Total} alt="Total" />
                                <div className='flex flex-col w-[70%] gap-2'>
                                    <label className='text-sm font-bold'>Total</label>
                                    <label className='text-sm font-bold'>
                                        {totais.total.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modal de edição */}
            <ModalLateral
                open={editando}
                handleClose={() => {
                    setEditando(false);
                    setSaidaEditando(null);
                }}
                tituloModal={saidaEditando ? "Editar Saída" : "Nova Saída"}
                icon={<Edit />}
                tamanhoTitulo={'75%'}
                conteudo={
                    <div className='flex gap-2 flex-wrap items-end justify-end w-full mt-2'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Descrição"
                            value={formularioEdicao.descricao}
                            onChange={(e) => setFormularioEdicao({ ...formularioEdicao, descricao: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ArticleIcon fontSize='small' />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '72%', sm: '50%', md: '40%', lg: '53%' } }}
                        />

                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Valor"
                            value={formularioEdicao.valor}
                            onValueChange={(values) => {
                                setFormularioEdicao({ ...formularioEdicao, valor: values.floatValue });
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CurrencyExchangeIcon />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '72%', sm: '50%', md: '40%', lg: '44%' } }}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                        />
                        <SelectTextFields
                            width={'220px'}
                            icon={<Money fontSize="small" />}
                            label={'Forma de Pagamento'}
                            backgroundColor={"#D9D9D9"}
                            name={"forma_pagamento"}
                            value={formularioEdicao.forma_pagamento}
                            onChange={(e) => setFormularioEdicao({ ...formularioEdicao, forma_pagamento: e.target.value })}
                            options={[
                                { value: '1', label: 'Dinheiro' },
                                { value: '2', label: 'Pix' },
                                { value: '3', label: 'Cartão de Crédito' },
                                { value: '4', label: 'Cartão de Débito' }
                            ]}
                            fontWeight={500}
                        />

                        <ButtonComponent
                            title={saidaEditando ? 'Atualizar' : 'Salvar'}
                            subtitle={saidaEditando ? 'Atualizar' : 'Salvar'}
                            startIcon={<Save />}
                            onClick={saidaEditando ? handleAtualizar : handleSave}
                        />
                    </div>
                }
            />
        </div>
    );
}

export default Saidas;