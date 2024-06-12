import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Paper, FormControl, Select, MenuItem, Button, IconButton, Tooltip } from '@mui/material';
import { Estado } from '../../../types/enums/Estados';
import PedidoService from '../../../services/PedidoService';
import { usePedidoContext } from '../../../hooks/usePedidoContext';
import Swal from 'sweetalert2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PedidoDetailModal from '../Modals/PedidoDetailModal';

const REFRESH_INTERVAL = 90000;

const estadosTransicion: { [key in Estado]?: Estado[] } = {
  [Estado.PENDIENTE]: [Estado.PREPARACION, Estado.RECHAZADO],
  [Estado.PREPARACION]: [Estado.TERMINADO],
  [Estado.TERMINADO]: [Estado.FACTURADO, Estado.DELIVERY],
  [Estado.DELIVERY]: [Estado.FACTURADO],
};

interface PedidosPorEstadoProps {
  estado: Estado;
}

const PedidosPorEstado: React.FC<PedidosPorEstadoProps> = ({ estado }) => {
  const { pedidos, actualizarPedidos, actualizarEstadoPedido } = usePedidoContext();
  const [loading, setLoading] = useState(true);
  const [estadosEditados, setEstadosEditados] = useState<{ [key: number]: Estado }>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPedidos = async () => {
    try {
      const pedidoService = new PedidoService();
      const url = import.meta.env.VITE_API_URL;
      const pedidos = await pedidoService.findByEstado(`${url}/pedido`, estado);
      actualizarPedidos(pedidos);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();

    const intervalId = setInterval(fetchPedidos, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [estado]);

  const handleEstadoChange = (pedidoId: number, nuevoEstado: Estado) => {
    setEstadosEditados(prevEstados => ({
      ...prevEstados,
      [pedidoId]: nuevoEstado
    }));
  };

  const handleGuardarCambio = async (pedidoId: number) => {
    const nuevoEstado = estadosEditados[pedidoId];
    if (nuevoEstado) {
      const pedido = pedidos.find(pedido => pedido.id === pedidoId);
      if (pedido && pedido.formaPago === 'EFECTIVO' && nuevoEstado === Estado.DELIVERY) {
        console.error('No se puede cambiar a estado de entrega (DELIVERY) si el método de pago es efectivo.');
        return;
      }

      if (nuevoEstado === Estado.FACTURADO) {

        Swal.fire({
          title: 'Cargando',
          text: 'Espere mientras se actualiza el estado...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        try {
          await actualizarEstadoPedido(pedidoId, nuevoEstado);
          setEstadosEditados(prevEstados => {
            const newEstados = { ...prevEstados };
            delete newEstados[pedidoId];
            return newEstados;
          });

          Swal.fire('Éxito', 'El estado se ha actualizado correctamente', 'success');
        } catch (error) {
          console.error('Error al actualizar el estado:', error);

          Swal.fire('Error', 'Se produjo un error al actualizar el estado', 'error');
        }
      } else {
        await actualizarEstadoPedido(pedidoId, nuevoEstado);
        setEstadosEditados(prevEstados => {
          const newEstados = { ...prevEstados };
          delete newEstados[pedidoId];
          return newEstados;
        });
      }
    }
  };

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (pedidoId: number) => {
    setSelectedPedidoId(pedidoId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPedidoId(null);
    setModalOpen(false);
  };

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }

  const pedidosFiltrados = pedidos.filter(pedido => pedido.estado === estado);
  const paginatedPedidos = pedidosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPedidos.map(pedido => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.cliente.email}</TableCell>
                <TableCell>${pedido.total.toFixed(2)}</TableCell>
                <TableCell>{pedido.formaPago}</TableCell>
                <TableCell>{pedido.estado}</TableCell>
                <TableCell>
                  {estadosTransicion[pedido.estado] && (
                    <FormControl variant="outlined" size="small">
                      <Select
                        value={estadosEditados[pedido.id] || pedido.estado}
                        onChange={(e) => handleEstadoChange(pedido.id, e.target.value as Estado)}
                      >
                        {estadosTransicion[pedido.estado]?.map(estado => (
                          <MenuItem key={estado} value={estado} disabled={pedido.formaPago === 'EFECTIVO' && estado === Estado.DELIVERY}>{estado}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {estadosEditados[pedido.id] && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleGuardarCambio(pedido.id)}
                      sx={{
                        bgcolor: "#fb6376",
                        "&:hover": {
                          bgcolor: "#d73754",
                        },
                        ml: 2
                      }}
                    >
                      Guardar
                    </Button>
                  )}
                  <Tooltip title="Ver detalles" arrow>
                    <IconButton onClick={() => handleOpenModal(pedido.id)} sx={{ ml: 2 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pedidosFiltrados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <PedidoDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        pedidoId={selectedPedidoId}
      />
    </Paper>
  );
};

export default PedidosPorEstado;
