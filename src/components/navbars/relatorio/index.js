import React from 'react';
import ButtonComponent from '../../button';
import { useNavigate } from 'react-router-dom';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const HeaderRelatorio = () => {
    const navigate = useNavigate();

    const handleNavigation = (section) => {
        switch (section) {
            case 'vendas':
                navigate('/relatorio/vendas');
                break;
            case 'categoria':
                navigate('/relatorio/categoria');
                break;
            case 'saidas':
                navigate('/relatorio/saidas');
                break;
            
            default:
                console.warn(`Seção desconhecida: ${section}`);
                break;
        }
    };

    return (
        <div className="w-[100%] items-center justify-center flex flex-wrap lg:justify-start md:gap-1">
            <ButtonComponent
                startIcon={<PointOfSaleIcon fontSize="small" />}
                title="Vendas"
                buttonSize="large"
                onClick={() => handleNavigation('vendas')}
                className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
            />

            <ButtonComponent
                startIcon={<AttachMoneyIcon fontSize="small" />}
                title="Categoria"
                buttonSize="large"
                onClick={() => handleNavigation('categoria')}
                className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
            />

            <ButtonComponent
                startIcon={<CurrencyExchangeIcon fontSize="small" />}
                title="Saídas"
                buttonSize="large"
                onClick={() => handleNavigation('saidas')}
                className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
            />
            
        </div>
    );
};

export default HeaderRelatorio;