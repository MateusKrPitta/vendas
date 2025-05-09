import React, { useState, useEffect } from 'react';
import AddchartIcon from '@mui/icons-material/Addchart';
import Navbar from '../../components/navbars/header';
import MenuMobile from '../../components/menu-mobile';
import HeaderPerfil from '../../components/navbars/perfil';
import { AddCircleOutline, Category, DataArray, Edit, Money, Numbers, ProductionQuantityLimits, Save } from '@mui/icons-material';
import ButtonComponent from '../../components/button';
import { Autocomplete, Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SelectTextFields from '../../components/select';
import TableComponent from '../../components/table';
import { VendasProdutos } from '../../entities/headers/vendas';
import Pix from '../../assets/icones/pix.png'
import Dinheiro from '../../assets/icones/dinheiro.png'
import Debito from '../../assets/icones/debito.png'
import Credito from '../../assets/icones/credito.png'
import Total from '../../assets/icones/moedas.png'
import ModalLateral from '../../components/modal-lateral';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { criarVendas } from '../../service/post/vendas';
import NumberFormat, { NumericFormat } from 'react-number-format';
import { useUnidade } from '../../contexts';
import CustomToast from '../../components/toast';
import { buscarVendas } from '../../service/get/vendas';
import { atualizarVendas } from '../../service/put/vendas';
import { deletarVendas } from '../../service/delete/vendas';
import { buscarCategoria } from '../../service/get/categoria';
import { motion } from 'framer-motion';

const Vendas = () => {
    const { unidadeId } = useUnidade();
    const [produto, setProduto] = useState('');
    const [vendaEditando, setVendaEditando] = useState(null);
    const [erros, setErros] = useState({});
    const [quantidade, setQuantidade] = useState(0);
    const [valor, setValor] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState('');
    const [data, setData] = useState('');
    const [carregandoCategorias, setCarregandoCategorias] = useState(false);
    const [editando, setEditando] = useState(false);
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

    const camposValidos = () => {
        return (
            produto.trim() !== '' &&
            quantidade > 0 &&
            valor > 0 &&
            formaPagamento !== '' &&
            categoriaSelecionada !== '' &&
            data !== ''
        );
    };

    const mapearFormaPagamento = (codigo) => {
        const formas = {
            1: 'Dinheiro',
            2: 'Pix',
            3: 'Cartão de Crédito',
            4: 'Cartão de Débito'
        };
        return formas[codigo] || codigo;
    };


    useEffect(() => {
        const hoje = new Date().toISOString().split('T')[0];
        setData(hoje);
        buscarVendasDoDia(hoje);
    }, []);

    const validarCampos = () => {
        const novosErros = {};

        if (!produto.trim()) novosErros.produto = 'Produto é obrigatório';
        if (quantidade <= 0) novosErros.quantidade = 'Quantidade deve ser maior que zero';
        if (valor <= 0) novosErros.valor = 'Valor deve ser maior que zero';
        if (!formaPagamento) novosErros.formaPagamento = 'Forma de pagamento é obrigatória';
        if (!data) novosErros.data = 'Data é obrigatória';

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

const handleEdit = (row) => {
    let venda = vendas.find(v => v.id === row.id);

    if (!venda) {
        venda = vendas.find(v =>
            (v.produto === row.produto || v.nome === row.produto) &&
            v.quantidade === row.quantidade
        );
    }

    if (venda) {
        // Encontra o objeto completo da categoria
        const categoriaCompleta = categoriasFiltradas.find(
            cat => cat.id.toString() === venda.categoria_id?.toString()
        );

        setVendaEditando({
            ...venda,
            id: venda.id || venda._id,
            categoriaObject: categoriaCompleta || null // Adiciona o objeto completo da categoria
        });
        setEditando(true);
    } else {
        CustomToast({ type: "error", message: "Venda não encontrada para edição" });
    }
};
    const limparCampos = () => {
        setProduto('');
        setQuantidade(0);
        setValor(0);
        setFormaPagamento('');

        setErros({});
    };

    const adicionarVenda = async () => {
        if (!validarCampos()) {
            CustomToast({ type: "error", message: "Preencha todos os campos corretamente" });
            return;
        }

        const vendaData = {
            nome: produto,
            quantidade: quantidade,
            valor: valor,
            forma_pagamento: Number(formaPagamento),
            unidade_id: Number(unidadeId),
            categoria_id: Number(categoriaSelecionada),
            data_venda: new Date(data).toISOString()
        };

        try {
            await criarVendas(vendaData);
            limparCampos();
            buscarVendasDoDia(data);
        } catch (error) {
            console.error("Erro ao adicionar venda:", error);
        }
    };

    const salvarEdicao = async () => {
        try {

            let dataISO;
            if (vendaEditando.data_venda) {

                if (vendaEditando.data_venda.includes('T')) {
                    dataISO = vendaEditando.data_venda;
                } else {

                    dataISO = new Date(vendaEditando.data_venda).toISOString();
                }
            } else {

                dataISO = new Date().toISOString();
            }

            await atualizarVendas(
                vendaEditando.id,
                vendaEditando.nome,
                Number(vendaEditando.quantidade),
                Number(vendaEditando.valor),
                Number(vendaEditando.forma_pagamento),
                Number(unidadeId),
                Number(vendaEditando.categoria_id),
                dataISO
            );

            CustomToast({ type: "success", message: "Venda atualizada com sucesso!" });
            setEditando(false);
            setVendaEditando(null);
            buscarVendasDoDia(data);
        } catch (error) {
            console.error("Erro ao atualizar venda:", error);
            CustomToast({ type: "error", message: error.response?.data?.message || "Erro ao atualizar venda" });
        }
    };


    const buscarVendasDoDia = async (data) => {
        setCarregando(true);
        try {
            const response = await buscarVendas(data, unidadeId);
            setVendas(response.data?.vendas || []);
        } catch (error) {
            console.error("Erro ao buscar vendas:", error);
            CustomToast({ type: "error", message: "Erro ao carregar vendas" });
        } finally {
            setCarregando(false);
        }
    };


    const calcularTotais = () => {
        const totais = {
            pix: 0,
            dinheiro: 0,
            debito: 0,
            credito: 0,
            geral: 0
        };

        vendas.forEach(venda => {
            if (!venda) return;

            const quantidade = parseFloat(venda.quantidade) || 0;
            const valor = parseFloat(venda.valor) || 0;
            const totalVenda = quantidade * valor;

            totais.geral += totalVenda;


            switch (venda.forma_pagamento) {
                case 1:
                    totais.dinheiro += totalVenda;
                    break;
                case 2:
                    totais.pix += totalVenda;
                    break;
                case 3:
                    totais.credito += totalVenda;
                    break;
                case 4:
                    totais.debito += totalVenda;
                    break;
                default:
                    console.warn('Forma de pagamento desconhecida:', venda.forma_pagamento);
            }
        });

        return totais;
    };
    const totais = calcularTotais();

    const dadosTabela = (vendas || []).map(venda => ({
        id: venda.id,
        produto: venda.nome || '',
        quantidade: venda.quantidade || 0,
        valor: venda.valor ? `R$ ${parseFloat(venda.valor).toFixed(2).replace('.', ',')}` : 'R$ 0,00',
        formaPagamento: mapearFormaPagamento(venda.forma_pagamento) || '',
        total: venda.quantidade && venda.valor ?
            `R$ ${(venda.quantidade * venda.valor).toFixed(2).replace('.', ',')}` : 'R$ 0,00',
        categoria: venda.categoria?.nome || 'Sem categoria'
    }));


    const handleDelete = async (row) => {
        try {
            await deletarVendas(row.id);
            buscarVendasDoDia(data);
        } catch (error) {
            console.error("Erro ao deletar venda:", error);
            CustomToast({ type: "error", message: error.message || "Erro ao deletar venda" });
        }
    };



    useEffect(() => {
        if (unidadeId) {
            const hoje = new Date().toISOString().split('T')[0];
            setData(hoje);
            buscarVendasDoDia(hoje);
        }
    }, [unidadeId]);

    const carregarCategorias = async () => {
        setCarregandoCategorias(true);
        try {
            const response = await buscarCategoria(unidadeId);
            setCategorias(response.data || []);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            setCategorias([]);
        } finally {
            setCarregandoCategorias(false);
        }
    };


    useEffect(() => {
        if (unidadeId) {
            carregarCategorias();
        }
    }, [unidadeId]);

    useEffect(() => {
        if (unidadeId && categorias.length > 0) {
            const filtradas = categorias.filter(cat =>
                cat.unidadeId === Number(unidadeId) ||
                cat.unidade_id === Number(unidadeId)
            );
            setCategoriasFiltradas(filtradas);
        } else {
            setCategoriasFiltradas([]);
        }
    }, [unidadeId, categorias]);

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };
    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end sm:m-0 lg:ml-2'>
                <MenuMobile />
                <motion.div
                    style={{ width: '100%' }}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.9 }}
                >
                    <HeaderPerfil />
                    <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-primary w-[99%] flex  gap-2 '>
                        <AddchartIcon style={{ color: '#0d2d43' }} /> Vendas
                    </h1>
                    <div className="flex gap-2 flex-wrap items-center w-full mt-6 justify-center md:justify-start p-2 " >
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Produto"
                            value={produto}
                            onChange={(e) => setProduto(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ProductionQuantityLimits fontSize='small' />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '57%', sm: '50%', md: '40%', lg: '20%' }, }}
                        />

                        <TextField
                            fullWidth
                            type='number'
                            variant="outlined"
                            size="small"
                            label="Quantidade"
                            value={quantidade}
                            onChange={(e) => setQuantidade(Number(e.target.value))}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Numbers />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '25%', sm: '50%', md: '40%', lg: '10%' }, }}
                        />

                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Valor"
                            value={valor}
                            onValueChange={(values) => {
                                const { formattedValue, value } = values;
                                setValor(value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CurrencyExchangeIcon />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '15%' }, }}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                        />

                        <SelectTextFields
                            width={'175px'}
                            icon={<Money fontSize="small" />}
                            label={'Forma de Pagamento'}
                            backgroundColor={"#D9D9D9"}
                            name={"forma de pagamento"}
                            fontWeight={500}
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value)}
                            options={[
                                { value: '1', label: 'Dinheiro' },
                                { value: '2', label: 'Pix' },
                                { value: '3', label: 'Cartão de Crédito' },
                                { value: '4', label: 'Cartão de Débito' }
                            ]}
                        />

                        <Autocomplete
                            options={categoriasFiltradas}
                            getOptionLabel={(option) => option.nome}
                            value={categoriasFiltradas.find(cat => cat.id.toString() === categoriaSelecionada) || null}
                            onChange={(event, newValue) => {
                                setCategoriaSelecionada(newValue ? newValue.id.toString() : '');
                            }}
                            sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '18%' }, }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Categoria"
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <Category fontSize="small" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}

                                />
                            )}
                            noOptionsText={
                                unidadeId
                                    ? "Nenhuma categoria encontrada"
                                    : "Selecione uma unidade primeiro"
                            }
                            disabled={carregandoCategorias}
                        />

                        <TextField
                            fullWidth
                            variant="outlined"
                            type='date'
                            size="small"
                            label="Data"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DateRangeIcon fontSize='small' />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '15%' }, }}
                        />

                        <div className='w-full flex items-end justify-center md:justify-end '>
                            <ButtonComponent
                                startIcon={<AddCircleOutline fontSize='small' />}
                                title={'Adicionar'}
                                subtitle={'Adicionar'}
                                onClick={adicionarVenda}
                                disabled={!camposValidos()}
                                buttonSize="large"
                            />
                        </div>
                        <div className='w-full'>
                            <TableComponent
                                headers={VendasProdutos}
                                rows={carregando ? [] : dadosTabela}
                                loading={carregando}
                                actionsLabel={"Ações"}
                                actionCalls={{
                                    edit: (row) => handleEdit(row),
                                    delete: (row) => handleDelete(row),
                                }}
                            />
                        </div>
                        <div className='flex w-full items-center justify-center gap-2 flex-wrap'>
                            {/* Card Pix */}
                            <div className='w-[45%] md:w-[19%] justify-center gap-8 flex items-center' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Pix} alt="Pix" />
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold'>Pix</label>
                                    <label className='text-sm font-bold'>
                                        {totais.pix.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </label>
                                </div>
                            </div>

                            {/* Card Dinheiro */}
                            <div className='w-[45%] md:w-[19%] justify-center gap-8 flex items-center' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Dinheiro} alt="Dinheiro" />
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold'>Dinheiro</label>
                                    <label className='text-sm font-bold'>
                                        {totais.dinheiro.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </label>
                                </div>
                            </div>

                            {/* Card Débito */}
                            <div className='w-[45%] md:w-[19%] justify-center gap-8 flex items-center' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Debito} alt="Débito" />
                                <div className='flex flex-col gap-2'>
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
                            <div className='w-[45%] md:w-[19%] justify-center gap-8 flex items-center' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Credito} alt="Crédito" />
                                <div className='flex flex-col gap-2'>
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
                            <div className='w-[60%] md:w-[19%] justify-center gap-8 flex items-center mr-5' style={{ border: '1px solid #0D2E43', borderRadius: '10px', padding: "10px" }}>
                                <img style={{ width: '30%' }} src={Total} alt="Total" />
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold'>Total</label>
                                    <label className='text-sm font-bold'>
                                        {totais.geral.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>



            <ModalLateral
                open={editando}
                handleClose={() => {
                    setEditando(false);
                    setVendaEditando(null);
                }}
                tituloModal="Editar Venda"
                icon={<Edit />}
                tamanhoTitulo={'75%'}
                conteudo={
                    <div className='flex gap-2 flex-wrap items-end justify-end w-full mt-2'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Produto"
                            value={vendaEditando?.produto || vendaEditando?.nome || ''}
                            onChange={(e) => setVendaEditando({ ...vendaEditando, produto: e.target.value, nome: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ProductionQuantityLimits fontSize='small' />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '65%', sm: '50%', md: '40%', lg: '50%' }, }}
                        />

                        <TextField
                            fullWidth
                            type='number'
                            variant="outlined"
                            size="small"
                            label="Quantidade"
                            value={vendaEditando?.quantidade || 0}
                            onChange={(e) => setVendaEditando({ ...vendaEditando, quantidade: Number(e.target.value) })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Numbers />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '30%', sm: '50%', md: '40%', lg: '47%' }, }}
                        />

                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Valor"
                            value={vendaEditando?.valor || 0}
                            onValueChange={(values) => {
                                setVendaEditando({ ...vendaEditando, valor: values.floatValue || 0 });
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CurrencyExchangeIcon />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '45%', sm: '50%', md: '40%', lg: '44%' }, }}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                        />

                        <SelectTextFields
                            width={'175px'}
                            icon={<Money fontSize="small" />}
                            label={'Forma de Pagamento'}
                            backgroundColor={"#D9D9D9"}
                            name={"forma de pagamento"}
                            fontWeight={500}
                            value={vendaEditando?.formaPagamento || vendaEditando?.forma_pagamento || ''}
                            onChange={(e) => setVendaEditando({
                                ...vendaEditando,
                                formaPagamento: Number(e.target.value),
                                forma_pagamento: Number(e.target.value)
                            })}
                            options={[
                                { value: '1', label: 'Dinheiro' },
                                { value: '2', label: 'Pix' },
                                { value: '3', label: 'Cartão de Crédito' },
                                { value: '4', label: 'Cartão de Débito' }
                            ]}
                        />
                       <Autocomplete
    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' } }}
    options={categoriasFiltradas}
    getOptionLabel={(option) => option.nome}
    value={vendaEditando?.categoriaObject || null} // Usa o objeto completo da categoria
    onChange={(event, newValue) => {
        setVendaEditando({
            ...vendaEditando,
            categoria_id: newValue ? Number(newValue.id) : null,
            categoriaObject: newValue // Mantém o objeto completo atualizado
        });
    }}
    renderInput={(params) => (
        <TextField
            {...params}
            label="Categoria"
            variant="outlined"
            size="small"
            InputProps={{
                ...params.InputProps,
                startAdornment: (
                    <>
                        <InputAdornment position="start">
                            <Category fontSize="small" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                    </>
                ),
            }}
        />
    )}
    noOptionsText="Nenhuma categoria encontrada"
    disabled={carregandoCategorias}
    isOptionEqualToValue={(option, value) => option.id === value.id} // Adicione esta linha
/>
                        <TextField
                            fullWidth
                            type='date'
                            variant="outlined"
                            size="small"
                            label="Data"
                            value={vendaEditando?.data_venda ?
                                new Date(vendaEditando.data_venda).toISOString().split('T')[0] :
                                data
                            }
                            onChange={(e) => {
                                const dateValue = e.target.value;
                                setVendaEditando({
                                    ...vendaEditando,
                                    data_venda: dateValue ? new Date(dateValue).toISOString() : new Date().toISOString()
                                });
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DateRangeIcon fontSize='small' />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '47%', sm: '50%', md: '40%', lg: '46%' }, }}
                        />

                        <ButtonComponent
                            title={'Salvar'}
                            subtitle={'Salvar'}
                            startIcon={<Save />}
                            onClick={salvarEdicao}
                        />
                    </div>
                }
            />


        </div>
    );
}

export default Vendas;