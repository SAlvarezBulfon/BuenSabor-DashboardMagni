import React, { useEffect, useState } from 'react';
import PedidosPorEstado from '../../ui/ListaPedidos/ListaPedidos';
import { Estado } from '../../../types/enums/Estados';
import { Box, Typography } from '@mui/material';
import AllPedidos from './AllPedidos';


const Pedidos: React.FC = () => {
  const [rol, setRol] = useState<string>('');

  useEffect(() => {
    const userDataString = localStorage.getItem('usuario');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const rol = userData["https://my-app.example.com/roles"];
      setRol(rol[0]);
    }
  }, []);

  return (
    <Box sx={{ padding: 3, mt: 10 }}>
      {["CAJERO"].includes(rol) && (
        <Box sx={{mb:3}}>
          <Typography variant="h4" gutterBottom>
            Pedidos Pendientes
          </Typography>
          <PedidosPorEstado estado={Estado.PENDIENTE} />
        </Box>
      )}
      {["COCINERO"].includes(rol) && (
        <>
          <Typography variant="h4" gutterBottom>
            Pedidos en Preparación
          </Typography>
          <PedidosPorEstado estado={Estado.PREPARACION} />
        </>
      )}
      {["CAJERO"].includes(rol) && (
        <>
          <Typography variant="h4" gutterBottom>
            Pedidos Terminados
          </Typography>
          <PedidosPorEstado estado={Estado.TERMINADO} />
        </>
      )}
      {["EMPLEADO"].includes(rol) && (
        <>
          <Typography variant="h4" gutterBottom>
            Pedidos en Delivery
          </Typography>
          <PedidosPorEstado estado={Estado.DELIVERY} />
        </>
      )}
      {["ADMIN"].includes(rol) && (
        <>
          <AllPedidos />
        </>
      )}
    </Box>
  );
};

export default Pedidos;
