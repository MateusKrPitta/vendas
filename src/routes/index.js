import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/login/index.js';
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
import ListaCompra from '../pages/relatorio/lista-compra/index.js';
import ListaFornecedor from '../pages/relatorio/fornecedor/index.js';
import Cursos from '../pages/cursos/index.js';
import Facebook from '../pages/cursos/facebook/index.js';
import MercadoLivre from '../pages/cursos/mercado-livre/index.js';
import WhatsAppCurso from '../pages/cursos/whats-app/index.js';
import VendasDiaria from '../pages/vendas-diarias/index.js';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Rotas acessíveis por todos os usuários autenticados */}
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vendas" element={<Vendas />} />
                 <Route path="/vendas-diaria" element={<VendasDiaria />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/cursos" element={<Cursos />} />
                 <Route path="/cursos/facebook" element={<Facebook />} />
                  <Route path="/cursos/mercado-livre" element={<MercadoLivre />} />
                   <Route path="/cursos/whatsapp" element={<WhatsAppCurso />} />
                <Route path="/cadastro/categoria" element={<Categoria />} />
            </Route>

            {/* Rotas restritas - apenas tipo 1 (admin) */}
            <Route element={<PrivateRoute allowedAccessTypes={[1]} />}>
                <Route path="/cadastro/fornecedor" element={<Fornecedor />} />
                <Route path="/cadastro/usuario" element={<Usuario />} />
                <Route path="/cadastro/unidade" element={<Unidades />} />
            </Route>

            {/* Rotas restritas - apenas tipos 1 e 2 (admin e gerente) */}
            <Route element={<PrivateRoute allowedAccessTypes={[1, 2]} />}>
             <Route path="/saidas" element={<Saidas />} />
                <Route path="/relatorio" element={<Relatorio />} />
                <Route path="/relatorio/vendas" element={<RelatorioVendas />} />
                <Route path="/relatorio/lista-compra" element={<ListaCompra />} />
                <Route path="/relatorio/saidas" element={<RelatorioSaidas />} />
                <Route path="/relatorio/lista-fornecedor" element={<ListaFornecedor />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;