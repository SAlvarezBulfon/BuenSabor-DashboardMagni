import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { usePedidoContext } from '../../../hooks/usePedidoContext';
import Column from '../../../types/Column';
import TableComponent from '../../ui/Tables/Table/Table';
import PedidoService from '../../../services/PedidoService';

const AllPedidos: React.FC = () => {
  const { pedidos, actualizarPedidos } = usePedidoContext();
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    try {
      const pedidoService = new PedidoService();
      const url = import.meta.env.VITE_API_URL;
      const pedidos = await pedidoService.getAll(`${url}/pedido`);
      actualizarPedidos(pedidos);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 60000); // Recargar cada 60 segundos
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  const columns: Column[] = [
    { id: 'id', label: 'ID', renderCell: (rowData) => <>{rowData.id}</> },
    { id: 'fechaPedido', label: 'Fecha Pedido', renderCell: (rowData) => <>{rowData.fechaPedido}</> },
    { id: 'estado', label: 'Estado', renderCell: (rowData) => <>{rowData.estado}</> },
    { id: 'cliente', label: 'Cliente', renderCell: (rowData) => <>{rowData.cliente.email}</> },
    { id: 'total', label: 'Total', renderCell: (rowData) => <>{rowData.total}</> },
  ];

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Todos los Pedidos
      </Typography>
      <TableComponent data={pedidos} columns={columns} />
    </Box>
  );
};

export default AllPedidos;
