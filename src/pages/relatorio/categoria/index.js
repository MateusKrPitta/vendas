import React from 'react'
import Navbar from '../../../components/navbars/header'
import MenuMobile from '../../../components/menu-mobile'
import HeaderPerfil from '../../../components/navbars/perfil'
import { motion } from 'framer-motion';
import HeaderRelatorio from '../../../components/navbars/relatorio'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const RelatorioCategoria = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
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
          <h1 className='justify-center md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex gap-2 '>
            <AttachMoneyIcon />Relatório por Categoria
          </h1>
          <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
            <div className="hidden lg:w-[14%] lg:flex">
              <HeaderRelatorio />
            </div>
            <div className="w-[100%] itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
              <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RelatorioCategoria