import React from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil';
import MenuMobile from '../../components/menu-mobile';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };
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

                            <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[90%] lg:w-[22%] flex-col gap-2 flex items-center justify-center'>
                                <label className='text-primary text-xs font-semibold'>Total de Produtos</label>
                                <div className='flex items-center justify-center gap-6'>

                                    <label className='text-primary font-semibold w-full'>63</label>
                                </div>
                            </div>
                            <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[43%] lg:w-[22%] flex-col gap-2 flex items-center justify-center'>
                                <label className='text-primary text-xs font-semibold'>Itens em Estoque</label>
                                <div className='flex items-center justify-center gap-6'>

                                    <label className='text-primary font-semibold w-full'>63</label>
                                </div>
                            </div>
                            <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[43%] lg:w-[22%] flex-col gap-2 flex items-center justify-center'>
                                <label className='text-primary text-xs font-semibold'>Valor Total</label>
                                <div className='flex items-center justify-center gap-6'>

                                    <label className='text-primary font-semibold w-full'>3</label>
                                </div>
                            </div>


                            <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[43%] lg:w-[22%] flex-col gap-2 flex items-center justify-center'>
                                <label className='text-primary text-xs font-semibold'>Itens para comprar</label>
                                <div className='flex items-center justify-center gap-6'>
                                    <label className='text-primary font-semibold w-full'>0</label>
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