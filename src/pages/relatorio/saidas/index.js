import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
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
import { buscarRelatorioSaidas } from '../../../service/get/relatorio_saidas';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip
} from '@mui/material';

const RelatorioSaidas = () => {
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
      const dados = await buscarRelatorioSaidas();
      const dadosOrdenados = dados.data.sort((a, b) => {
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
    carregarRelatorios();
  }, []);

  // Agrupar relatórios por ano com totais calculados
  const relatoriosPorAno = relatorios.reduce((acc, relatorio) => {
    const ano = relatorio.ano;
    if (!acc[ano]) {
      acc[ano] = {
        meses: [],
        totalSaidas: 0,
        totalValor: 0
      };
    }
    acc[ano].meses.push(relatorio);
    acc[ano].totalSaidas += relatorio.totalSaidas;
    acc[ano].totalValor += relatorio.totalValor;
    
    return acc;
  }, {});

  const colunasSaidas = [
    { 
      key: 'descricao', 
      label: 'Descrição', 
      width: 200 
    },
    {
      key: 'valor',
      label: 'Valor',
      width: 120,
      renderCell: (params) => (
        <span style={{ fontWeight: 'bold' }}>
          {formatarMoeda(params.row.valor)}
        </span>
      )
    },
    {
      key: 'formaPagamento',
      label: 'Forma de Pagamento',
      width: 150,
      valueGetter: (params) => {
        const formas = {
          1: 'Dinheiro',
          2: 'PIX',
          3: 'Débito',
          4: 'Crédito'
        };
        return formas[params.row.formaPagamento] || 'Desconhecido';
      }
    },
    {
      key: 'data',
      label: 'Data',
      width: 120,
      valueGetter: (params) => formatarData(params.row.data)
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
            <CurrencyExchangeIcon />Relatório de Saídas
          </h1>

          <div className="items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
            <div className="hidden lg:w-[14%] lg:flex">
              <HeaderRelatorio />
            </div>

            <div className="w-[100%] mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
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
                          Saídas: {dadosAno.totalSaidas}
                        </label>
                      </label>
                    </div>

                    {dadosAno.meses.map((relatorio) => (
                      <Acordion
                        key={`${relatorio.ano}-${relatorio.mes}`}
                        titulo={
                          <div className="flex items-center gap-2">
                            <DateRange />
                            <label className="font-semibold text-xs">
                              {relatorio.nomeMes} <label className='ml-5'> 
                              {formatarMoeda(relatorio.totalValor)} | {relatorio.totalSaidas} Saídas
                              </label>
                            </label>
                          </div>
                        }
                        informacoes={
                          <div className="p-4 bg-white">
                            <div style={{ height: 400, width: '100%' }}>
                              {relatorio.saidas && relatorio.saidas.length > 0 ? (
                               <TableComponent
                               headers={colunasSaidas}
                               rows={relatorio.saidas.map(saida => ({
                                 ...saida,
                                 // Garante que o valor é um número
                                 valor: Number(saida.valor),
                                 // Mantém os outros campos
                                 descricao: saida.descricao,
                                 formaPagamento: saida.formaPagamento,
                                 data: saida.data
                               }))}
                               pageSize={5}
                               checkboxSelection={false}
                             />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  Nenhuma saída encontrada para este período
                                </div>
                              )}
                            </div>
                          </div>
                        }
                      />
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RelatorioSaidas;