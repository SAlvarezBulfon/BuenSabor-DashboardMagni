import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { usePedidoContext } from '../../../hooks/usePedidoContext';
import Column from '../../../types/Column';
import TableComponent from '../../ui/Tables/Table/Table';
import PedidoService from '../../../services/PedidoService';
import { Link } from 'react-router-dom';
import PedidoDetailModal from '../../ui/Modals/PedidoDetailModal';

const AllPedidos: React.FC = () => {
  const { pedidos, actualizarPedidos } = usePedidoContext();
  const [loading, setLoading] = useState(true);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const url = import.meta.env.VITE_API_URL;

  const fetchPedidos = async () => {
    try {
      const pedidoService = new PedidoService();
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
    const interval = setInterval(fetchPedidos, 10000); // Recargar cada 60 segundos
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  const handleOpenModal = (id: number) => {
    setSelectedPedidoId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPedidoId(null);
    setModalOpen(false);
  };

  const columns: Column[] = [
    { id: 'id', label: 'ID', renderCell: (rowData) => <>{rowData.id}</> },
    { id: 'fechaPedido', label: 'Fecha Pedido', renderCell: (rowData) => <>{rowData.fechaPedido}</> },
    { id: 'estado', label: 'Estado', renderCell: (rowData) => <>{rowData.estado}</> },
    { id: 'cliente', label: 'Cliente', renderCell: (rowData) => <>{rowData.cliente.email}</> },
    {
      id: 'accion',
      label: 'Acción',
      renderCell: (rowData) => (
        <>
          <Button
            component={Link}
            to={`${url}/facturas/factura/${rowData.id}`}
            variant="contained"
            color="error"
            disabled={rowData.estado !== 'FACTURADO'}
          >
            Factura
          </Button>
          <Button
            onClick={() => handleOpenModal(rowData.id)}
            variant="contained"
            color="error"
            style={{ marginLeft: '10px' }}
          >
            Ver Detalles
          </Button>
        </>
      ),
    },
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
      <PedidoDetailModal open={modalOpen} onClose={handleCloseModal} pedidoId={selectedPedidoId} />
    </Box>
  );
};

export default AllPedidos;
