import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './components/auth/Auth0Provider.tsx';
import { PedidoProvider } from './hooks/usePedidoContext.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PedidoProvider>
        <Auth0ProviderWithNavigate>
          <App />
        </Auth0ProviderWithNavigate>
      </PedidoProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
