import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pedido } from '../types/Pedido';
import PedidoService from '../services/PedidoService';
import { Estado } from '../types/enums/Estados';

interface PedidoContextType {
  pedidos: Pedido[];
  actualizarPedidos: (nuevosPedidos: Pedido[]) => void;
  actualizarEstadoPedido: (pedidoId: number, nuevoEstado: Estado) => void;
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const usePedidoContext = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidoContext debe estar dentro de un PedidoProvider');
  }
  return context;
};

interface PedidoProviderProps {
  children: ReactNode;
}

export const PedidoProvider: React.FC<PedidoProviderProps> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const pedidoService = new PedidoService();
  const url = import.meta.env.VITE_API_URL;

  const actualizarPedidos = (nuevosPedidos: Pedido[]) => {
    setPedidos(nuevosPedidos);
  };

  const actualizarEstadoPedido = async (pedidoId: number, nuevoEstado: Estado) => {
    try {
      await pedidoService.put(`${url}/pedido/cambiaEstado`, pedidoId, nuevoEstado);
      setPedidos(prevPedidos =>
        prevPedidos.map(pedido =>
          pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );
    } catch (error) {
      console.error('Error updating estado:', error);
    }
  };

  return (
    <PedidoContext.Provider value={{ pedidos, actualizarPedidos, actualizarEstadoPedido }}>
      {children}
    </PedidoContext.Provider>
  );
};
