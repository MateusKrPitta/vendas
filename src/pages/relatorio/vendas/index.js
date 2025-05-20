import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HeaderRelatorio from '../../../components/navbars/relatorio';
import TableComponent from '../../../components/table';
import moment from 'moment';
import 'moment/locale/pt-br';
import Acordion from '../../../components/accordion';
import { motion } from 'framer-motion';
import {
  DateRange,
  CalendarToday,
  KeyboardArrowDown,
  Search,
  DateRange as DateRangeIcon,
  Clear
} from '@mui/icons-material';
import { buscarRelatorioVendas } from '../../../service/get/relatorios_vendas';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useUnidade } from '../../../contexts';

const RelatorioVendas = () => {
  const { unidadeId } = useUnidade();
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState('todos');
  // Estados para os filtros
  const [filtros, setFiltros] = useState({
    produto: '',
    categoria: '',
    dataInicio: null,
    dataFim: null
  });

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Data inválida';
    const data = moment(dataString);
    return data.isValid() ? data.format('DD/MM/YYYY') : 'Data inválida';
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const carregarRelatorios = async () => {
    try {
      setLoading(true);
      const response = await buscarRelatorioVendas(unidadeId);

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Dados de relatório inválidos");
      }

      const dadosOrdenados = response.data.sort((a, b) => {
        if (a.ano !== b.ano) return b.ano - a.ano;
        return b.mes - a.mes;
      });

      setRelatorios(dadosOrdenados);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unidadeId) {
      carregarRelatorios();
    }
  }, [unidadeId]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleDateChange = (name, date) => {
    setFiltros(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const relatoriosPorAno = relatorios.reduce((acc, relatorio) => {
    const ano = relatorio.ano;
    if (!acc[ano]) {
      acc[ano] = {
        meses: [],
        totalVendas: 0,
        totalQuantidade: 0,
        totalValor: 0
      };
    }

    acc[ano].meses.push(relatorio);
    acc[ano].totalVendas += relatorio.totalVendas;
    acc[ano].totalQuantidade += relatorio.totalQuantidade;

    const totalValorMes = relatorio.vendas?.reduce((total, venda) => {
      return total + (venda.quantidade * venda.valor);
    }, 0) || relatorio.totalValor || 0;

    acc[ano].totalValor += totalValorMes;

    return acc;
  }, {});

  const colunasVendas = [
    {
      key: 'produto',
      label: 'Produto',
      width: 150
    },
    {
      key: 'quantidade',
      label: 'Quantidade',
      width: 120,
      align: 'center'
    },
    {
      key: 'valor',
      label: 'Valor Unitário',
      width: 120,
      align: 'right',
      format: (value) => formatarMoeda(value)
    },
    {
      key: 'valorTotal',
      label: 'Valor Total',
      width: 120,
      align: 'right',
      format: (value) => formatarMoeda(value)
    },
    {
      key: 'data',
      label: 'Data',
      width: 120,
      valueGetter: (params) => formatarData(params.row.data)
    },
    {
      key: 'categoria',
      label: 'Categoria',
      width: 150
    }
  ];

  const filtrarVendas = (vendas) => {
    if (!vendas) return [];

    return vendas.filter(venda => {
      // Filtro por produto
      const produtoNome = venda.produto || venda.nome || '';
      const produtoMatch = produtoNome.toString().toLowerCase().includes(filtros.produto.toLowerCase());

      // Filtro por categoria
      let categoriaNome = '';
      if (typeof venda.categoria === 'string') {
        categoriaNome = venda.categoria;
      } else if (venda.categoria && typeof venda.categoria.nome === 'string') {
        categoriaNome = venda.categoria.nome;
      }

      const categoriaMatch =
        filtros.categoria === '' ||
        categoriaNome.toString().toLowerCase().includes(filtros.categoria.toLowerCase());

      // Filtro por data (usando inputs nativos)
      let dataMatch = true;
      if (filtros.dataInicio || filtros.dataFim) {
        const dataVenda = moment(venda.data || venda.data_venda);
        if (!dataVenda.isValid()) return false;

        if (filtros.dataInicio) {
          const dataInicio = moment(filtros.dataInicio).startOf('day');
          dataMatch = dataMatch && dataVenda.isSameOrAfter(dataInicio);
        }
        if (filtros.dataFim) {
          const dataFim = moment(filtros.dataFim).endOf('day');
          dataMatch = dataMatch && dataVenda.isSameOrBefore(dataFim);
        }
      }

      return produtoMatch && categoriaMatch && dataMatch;
    });
  };

  const limparFiltrosData = () => {
    setFiltros(prev => ({
      ...prev,
      dataInicio: null,
      dataFim: null
    }));
  };

  return (
    <div className="flex w-full">
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
            <PointOfSaleIcon />Relatório de Vendas
          </h1>

          <div className="items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
            <div className="hidden lg:w-[14%] lg:flex">
              <HeaderRelatorio />
            </div>

            <div className="w-[100%] mt-2 ml-2 sm:mt-0  md:flex  md:justify-start flex-col lg:w-[80%]">
              <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
                <InputLabel id="ano-select-label" sx={{ display: 'flex', alignItems: 'center' }}>
                  Selecione o ano
                </InputLabel>
                <Select
                  size='small'
                  labelId="ano-select-label"
                  id="ano-select"
                  value={anoSelecionado}
                  onChange={(e) => setAnoSelecionado(e.target.value)}
                  input={<OutlinedInput label="Selecione o ano" />}
                  IconComponent={KeyboardArrowDown}
                  sx={{
                    '& .MuiSelect-icon': {
                      color: 'primary.main',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.dark',
                    },
                  }}
                >
                  <MenuItem value="todos">
                    <Box display="flex" alignItems="center">
                      <CalendarToday fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} />
                      <span>Todos os anos</span>
                    </Box>
                  </MenuItem>
                  {Object.keys(relatoriosPorAno)
                    .sort((a, b) => b - a)
                    .map((ano) => (
                      <MenuItem key={ano} value={ano}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <Box display="flex" alignItems="center">
                            <DateRange fontSize='small' sx={{ mr: 1, color: 'primary.main' }} />
                            <span>{ano}</span>
                          </Box>
                          <Chip
                            label={formatarMoeda(relatoriosPorAno[ano].totalValor)}
                            size="small"
                            sx={{ ml: 1, bgcolor: 'primary.light', color: 'white' }}
                          />
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {Object.entries(relatoriosPorAno)
                .filter(([ano]) => anoSelecionado === 'todos' ? true : ano === anoSelecionado)
                .map(([ano, dadosAno]) => (
                  <div key={ano} className="w-full mb-6">
                    <div className="bg-gray-100 p-3 rounded-lg mb-2">
                      <label className="text-primary text-sm font-bold flex justify-between items-center">
                        {ano}
                        <label className="text-sm font-semibold">
                          Total: {formatarMoeda(dadosAno.totalValor)} |
                          Vendas: {dadosAno.totalVendas} |
                          Produtos: {dadosAno.totalQuantidade}
                        </label>
                      </label>
                    </div>

                    {dadosAno.meses.map((relatorio) => {
                      const vendasFiltradas = filtrarVendas(relatorio.vendas);

                      return (
                        <Acordion
                          key={`${relatorio.ano}-${relatorio.mes}`}
                          titulo={
                            <div className="flex items-center gap-2">
                              <DateRange />
                              <label className="font-semibold text-xs">
                                {relatorio.nomeMes}
                                <label className='ml-5'>
                                  {formatarMoeda(relatorio.totalValor)} |
                                  {relatorio.totalVendas} Vendas |
                                  {relatorio.totalQuantidade} Produtos
                                </label>
                              </label>
                            </div>
                          }
                          informacoes={
                            <div className="p-4 w-full bg-white">
                              {/* Filtros */}
                              <div className="flex w-full flex-col md:flex-row md:flex-wrap gap-4 mb-4">
                                {/* Filtro por produto */}
                                <div className='flex gap-2 items-center w-full'>
                                <TextField
                                  label="Filtrar por produto"
                                  variant="outlined"
                                  size="small"
                                  name="produto"
                                  value={filtros.produto}
                                  onChange={handleFiltroChange}
                                  sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' } }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Search />
                                      </InputAdornment>
                                    ),
                                  }}
                                />

                                {/* Filtro por categoria */}
                                <TextField
                                  label="Filtrar por categoria"
                                  variant="outlined"
                                  size="small"
                                  name="categoria"
                                  value={filtros.categoria}
                                  onChange={handleFiltroChange}
                                  sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '40%' } }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Search />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
</div>
                                <div className="flex flex-col sm:flex-row gap-4 w-full">
                                  <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="pt-br">
                                    <DatePicker
                                      label="Data Início"
                                      value={filtros.dataInicio}
                                      onChange={(date) => handleDateChange('dataInicio', date)}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          className="w-full sm:w-[50%]"
                                          InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <DateRangeIcon />
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      )}
                                    />

                                    <DatePicker
                                      label="Data Fim"
                                      value={filtros.dataFim}
                                      onChange={(date) => handleDateChange('dataFim', date)}
                                      minDate={filtros.dataInicio}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          className="w-full sm:w-[50%]"
                                          InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <DateRangeIcon />
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider></div>

                                {(filtros.dataInicio || filtros.dataFim) && (
                                  <IconButton
                                    size="small"
                                    style={{ color: '#0d2d43' }}
                                    onClick={limparFiltrosData}
                                    title="Limpar Filtro"
                                  >
                                    <Clear />
                                  </IconButton>
                                )}
                              </div>

                              <div style={{ height: 400, width: '100%' }}>
                                {vendasFiltradas && vendasFiltradas.length > 0 ? (
                                  <TableComponent
                                    headers={colunasVendas}
                                    rows={vendasFiltradas.map(venda => {
                                      const valor = Number(venda.valor);
                                      const quantidade = Number(venda.quantidade);
                                      const valorTotal = valor * quantidade;

                                      return {
                                        ...venda,
                                        produto: venda.produto || venda.nome,
                                        quantidade: quantidade,
                                        valor: valor,
                                        valorTotal: valorTotal,
                                        data: formatarData(venda.data || venda.data_venda),
                                        categoria: venda.categoria?.nome || venda.categoria || 'Sem categoria'
                                      };
                                    })}
                                    pageSize={5}
                                    checkboxSelection={false}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full ">
                                    <label className='font-sm '>Nenhuma venda encontrada para este período</label>
                                  </div>
                                )}
                              </div>
                            </div>
                          }
                        />
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RelatorioVendas;