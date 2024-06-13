import React from 'react';
import { Card, CardContent, Typography, Grid, Divider } from '@mui/material';

interface PedidoDetailCardProps {
  fechaPedido: string;
  horaEstimadaFinalizacion: string;
  estado: string;
  tipoEnvio: string;
  domicilio: string;
  total: number;
  formaPago: string;
}

const PedidoDetailCard: React.FC<PedidoDetailCardProps> = ({
  fechaPedido,
  horaEstimadaFinalizacion,
  estado,
  tipoEnvio,
  domicilio,
  total,
  formaPago,
}) => {
  // Formatear la hora estimada de finalización
  const formattedHoraEstimadaFinalizacion = horaEstimadaFinalizacion.slice(0, 5);

  // Determinar el texto adecuado para el tipo de envío
  const tipoEnvioText = tipoEnvio === 'TAKE_AWAY' ? 'Take Away' : 'Delivery';

  // Determinar el texto adecuado para la forma de pago
  const formaPagoText = formaPago === 'MERCADO_PAGO' ? 'Mercado Pago' : 'Efectivo';

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <strong>Detalles del Pedido</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Fecha Pedido:</strong> {fechaPedido}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Hora Estimada Finalización:</strong> {formattedHoraEstimadaFinalizacion}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Estado:</strong> {estado}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Tipo de Envío:</strong> {tipoEnvioText}
            </Typography>
          </Grid>
          {tipoEnvio !== 'TAKE_AWAY' && (
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Domicilio:</strong> {domicilio}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Total:</strong> ${total.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Método de Pago:</strong> {formaPagoText}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PedidoDetailCard;
