import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/login/index.js'
import Dashboard from '../pages/dashboard/index.js';
import Vendas from '../pages/vendas/index.js';
import Saidas from '../pages/saidas/index.js';
import Cadastro from '../pages/cadastro/index.js';
import Usuario from '../pages/cadastro/usuario/index.js';
import Unidades from '../pages/cadastro/unidades/index.js';
import Fornecedor from '../pages/cadastro/forncedor/index.js';
import PrivateRoute from '../auth/private-route.js';
import Categoria from '../pages/cadastro/categoria/index.js';
import Relatorio from '../pages/relatorio/index.js';
import RelatorioVendas from '../pages/relatorio/vendas/index.js';
import RelatorioCategoria from '../pages/relatorio/categoria/index.js';
import RelatorioSaidas from '../pages/relatorio/saidas/index.js';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vendas" element={<Vendas />} />
                <Route path="/saidas" element={<Saidas />} />
                <Route path="/relatorio" element={<Relatorio />} />
                <Route path="/relatorio/vendas" element={<RelatorioVendas />} />
                <Route path="/relatorio/categoria" element={<RelatorioCategoria />} />
                <Route path="/relatorio/saidas" element={<RelatorioSaidas />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/cadastro/usuario" element={<Usuario />} />
                <Route path="/cadastro/unidade" element={<Unidades />} />
                <Route path="/cadastro/fornecedor" element={<Fornecedor />} />
                <Route path="/cadastro/categoria" element={<Categoria />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
