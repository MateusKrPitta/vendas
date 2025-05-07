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
  KeyboardArrowDown
} from '@mui/icons-material';
import { buscarRelatorioVendas } from '../../../service/get/relatorios_vendas';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip
} from '@mui/material';
import { useUnidade } from '../../../contexts';
import CustomToast from '../../../components/toast';

const RelatorioVendas = () => {
  const { unidadeId } = useUnidade();
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState('todos');

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const formatarData = (dataString) => {
    return moment(dataString).format('DD/MM/YYYY');
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
        CustomToast({
            type: "error",
            message: `Erro ao carregar relatórios: ${err.message}`
        });
    }
};

  useEffect(() => {
    if (unidadeId) { 
      carregarRelatorios();
    }
  }, [unidadeId]);

  
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
                            <div className="p-4 bg-white">
                              <div style={{ height: 400, width: '100%' }}>
                                {relatorio.vendas && relatorio.vendas.length > 0 ? (
                                  <TableComponent
                                  headers={colunasVendas}
                                  rows={relatorio.vendas.map(venda => {
                                    const valor = Number(venda.valor);
                                    const quantidade = Number(venda.quantidade);
                                    const valorTotal = valor * quantidade;
                                    
                                    return {
                                      ...venda,
                                      produto: venda.produto || venda.nome,
                                      quantidade: quantidade,
                                      valor: formatarMoeda(valor),
                                      valorTotal: formatarMoeda(valorTotal), 
                                      data: formatarData(venda.data || venda.data_venda),
                                      categoria: venda.categoria?.nome || venda.categoria || 'Sem categoria'
                                    };
                                  })}
                                  pageSize={5}
                                  checkboxSelection={false}
                                />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    Nenhuma venda encontrada para este período
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