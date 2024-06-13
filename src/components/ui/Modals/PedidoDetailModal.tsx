import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Divider, Button, CircularProgress, Grid } from '@mui/material';
import { Pedido } from '../../../types/Pedido';
import PedidoService from '../../../services/PedidoService';
import ClientCard from '../Cards/ClientCard/ClientCard';
import PedidoDetailCard from '../Cards/PedidoDetailCard/PedidoDetail';


interface PedidoDetailModalProps {
  open: boolean;
  onClose: () => void;
  pedidoId: number | null;
}

const PedidoDetailModal: React.FC<PedidoDetailModalProps> = ({ open, onClose, pedidoId }) => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPedido = async () => {
      if (pedidoId !== null) {
        setLoading(true);
        try {
          const pedidoService = new PedidoService();
          const pedido = await pedidoService.get(`${url}/pedido`, pedidoId);
          setPedido(pedido);
          setError(null);
        } catch (error) {
          setError('Error fetching pedido details');
          console.error('Error fetching pedido:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (open) {
      fetchPedido();
    } else {
      setPedido(null);
    }
  }, [open, pedidoId]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '80%',
          maxWidth: '800px',
          margin: 'auto',
          mt: 5,
          bgcolor: 'background.paper',
          padding: 4,
          borderRadius: 1,
          boxShadow: 3,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="h6" color="error" textAlign="center">
            {error}
          </Typography>
        ) : pedido ? (
          <>
            <Typography variant="h4" gutterBottom>
            Pedido
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PedidoDetailCard
                  fechaPedido={pedido.fechaPedido}
                  horaEstimadaFinalizacion={pedido.horaEstimadaFinalizacion}
                  estado={pedido.estado}
                  tipoEnvio={pedido.tipoEnvio}
                  domicilio={`${pedido.domicilio.calle} ${pedido.domicilio.numero}, ${pedido.domicilio.cp}, ${pedido.domicilio.localidad.nombre}`}
                  total={pedido.total}
                  formaPago={pedido.formaPago}
                />
              </Grid>
              <Grid item xs={12}>
                <ClientCard
                  email={pedido.cliente.email}
                  nombre={pedido.cliente.nombre}
                  apellido={pedido.cliente.apellido}
                  telefono={pedido.cliente.telefono}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <strong>Detalles de los Artículos</strong>
            </Typography>
            <Grid container spacing={2}>
              {pedido.detallePedidos.map((detalle) => (
                <React.Fragment key={detalle.id}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1">Artículo: {detalle.articuloNombre}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1">Cantidad: {detalle.cantidad}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1">SubTotal: ${detalle.subTotal}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="error" onClick={onClose}>
                Cerrar
              </Button>
            </Box>
          </>
        ) : null}
      </Box>
    </Modal>
  );
};

export default PedidoDetailModal;
