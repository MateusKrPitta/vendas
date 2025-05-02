import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./components/toast";
import AppRoutes from "./routes";
import { UnidadeProvider } from "./contexts";

function App() {
  return (
    <BrowserRouter>
      <UnidadeProvider>
        <AppRoutes />
        <ToastProvider />
      </UnidadeProvider>

    </BrowserRouter>
  );
}

export default App;