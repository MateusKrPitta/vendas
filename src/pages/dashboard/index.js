import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil';
import MenuMobile from '../../components/menu-mobile';
import { motion } from 'framer-motion';
import { buscarDashboard } from '../../service/get/dashboard';
import { useUnidade } from '../../contexts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import Imagem01 from '../../assets/png/caixa.png'
import Imagem02 from '../../assets/png/dinheiro.png'
import Imagem03 from '../../assets/png/despesas.png'
import Imagem04 from '../../assets/png/categorias.png'
const Dashboard = () => {
    const { unidadeId } = useUnidade();
    const [dashboardFiltradas, setDashboardFiltradas] = useState([]);
    const [loading, setLoading] = useState(false);
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const listaDashboard = async () => {
        setLoading(true);
        try {
            const response = await buscarDashboard(unidadeId);
            setDashboardFiltradas(response.data || []);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            setDashboardFiltradas([]);
        } finally {
            setLoading(false);
        }
    };

    const formatarParaReal = (valor) => {
        if (typeof valor !== 'number') valor = Number(valor);
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };


    useEffect(() => {
        if (unidadeId) {
            listaDashboard();
        }
    }, [unidadeId]);
    return (

        <div className="lg:flex w-[100%] h-[100%]">
            <MenuMobile />

            <Navbar />
            <motion.div
                style={{ width: '100%' }}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.9 }}
            >
                <div className='flex flex-col gap-2 w-full items-end'>
                    <HeaderPerfil />
                    <h1 className='flex items-center md:justify-center md:mt-16  lg:mt-0  justify-center mt-6  lg:justify-start ml-3 text-2xl font-bold text-primary w-[95%] lg:w-[98%]'>
                        Dashboard
                    </h1>

                    <div className={`w-full mt-8 flex-wrap p-3 transition-opacity duration-500 `}>
                        <div className='w-full flex gap-6 flex-wrap items-center justify-center'>


                            <div className="w-[100%] lg:w-[22%] bg-white rounded-2xl shadow-md p-5 flex flex-col items-center gap-3" style={{ border: '1px solid #0d2d43' }}>
                                <img src={Imagem01}></img>
                                <span className="text-xs font-semibold text-gray-500">Total de Produtos</span>
                                <strong className="text-sm font-bold text-primary">{dashboardFiltradas.total_quantidade_produtos}</strong>
                            </div>

                            <div className="w-[100%] lg:w-[22%] bg-white rounded-2xl shadow-md p-5 flex flex-col items-center gap-3" style={{ border: '1px solid #0d2d43' }}>
                                <img src={Imagem02}></img>
                                <span className="text-xs font-semibold text-gray-500">Total de Vendas</span>
                                <strong className="text-sm font-bold text-primary">{formatarParaReal(dashboardFiltradas.valor_total_vendas)}</strong>
                            </div>

                            <div className="w-[100%] lg:w-[22%] bg-white rounded-2xl shadow-md p-5 flex flex-col items-center gap-3" style={{ border: '1px solid #0d2d43' }}>
                                <img src={Imagem04}></img>
                                <span className="text-xs font-semibold text-gray-500">Total de Categorias</span>
                                <strong className="text-sm font-bold text-primary">{dashboardFiltradas.quantidade_categorias}</strong>
                            </div>
                            <div className="w-[100%] lg:w-[22%] bg-white rounded-2xl shadow-md p-5 flex flex-col items-center gap-3" style={{ border: '1px solid #0d2d43' }}>
                                <img src={Imagem03}></img>
                                <span className="text-xs font-semibold text-gray-500">Total de Saídas</span>
                                <strong className="text-sm font-bold text-primary">{formatarParaReal(dashboardFiltradas.valor_total_saidas)}</strong>
                            </div>


                            <div className="w-full mt-5 px-4">
                                <h4 className="text-lg font-bold text-primary mb-4">Categorias Mais Vendidas</h4>
                                <div className="w-full h-72 bg-white rounded-2xl shadow-md p-4 border border-primary">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dashboardFiltradas.categorias_mais_vendidas}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="nome" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="quantidade" fill="#0d2d43" name="Quantidade Vendida" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Dashboard;