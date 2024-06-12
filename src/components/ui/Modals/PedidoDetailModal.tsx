import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, ListItem, ListItemText, Divider, Button, CircularProgress, Grid } from '@mui/material';
import { Pedido } from '../../../types/Pedido';
import PedidoService from '../../../services/PedidoService';

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
              Detalles del Pedido
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Fecha Pedido" secondary={pedido.fechaPedido} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Estado" secondary={pedido.estado} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Cliente Email" secondary={pedido.cliente.email} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Cliente Nombre" secondary={`${pedido.cliente.nombre} ${pedido.cliente.apellido}`} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Cliente Teléfono" secondary={pedido.cliente.telefono} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Hora Estimada Finalización" secondary={pedido.horaEstimadaFinalizacion} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Total" secondary={`$${pedido.total}`} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Tipo Envío" secondary={pedido.tipoEnvio} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText primary="Forma de Pago" secondary={pedido.formaPago} />
                </ListItem>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Detalles de los Artículos
            </Typography>
            <Grid container spacing={2}>
              {pedido.detallePedidos.map((detalle) => (
                <React.Fragment key={detalle.id}>
                  <Grid item xs={12} sm={4}>
                    <ListItem>
                      <ListItemText primary="Artículo" secondary={detalle.articuloNombre} />
                    </ListItem>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ListItem>
                      <ListItemText primary="Cantidad" secondary={detalle.cantidad} />
                    </ListItem>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ListItem>
                      <ListItemText primary="SubTotal" secondary={`$${detalle.subTotal}`} />
                    </ListItem>
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
