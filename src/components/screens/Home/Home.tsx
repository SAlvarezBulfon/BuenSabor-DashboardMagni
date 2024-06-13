import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardContent } from '@mui/material';
import SucursalService from '../../../services/SucursalService';
import IEmpresa from '../../../types/IEmpresa';
import BootstrapCarousel from '../../ui/common/BootstrapCarousel/BootstrapCarousel';
import ISucursal from '../../../types/ISucursal';

const Home = () => {
    const { sucursalId } = useParams<{ sucursalId: string }>();
    const [sucursal, setSucursal] = useState<ISucursal | null>(null);
    const [empresa, setEmpresa] = useState<IEmpresa | null>(null);
    const url = import.meta.env.VITE_API_URL;
    const sucursalService = new SucursalService();

    useEffect(() => {
        const fetchSucursalYEmpresaNombre = async () => {
            try {
                if (sucursalId) {
                    const sucursal = await sucursalService.get(`${url}/sucursal`, parseInt(sucursalId)) as ISucursal;
                    setSucursal(sucursal);

                    if ('empresa' in sucursal) {
                        setEmpresa(sucursal.empresa);
                    }
                }
            } catch (error) {
                console.error("Error al obtener el nombre de la sucursal o empresa:", error);
            }
        };

        fetchSucursalYEmpresaNombre();
    }, [sucursalId]);

    return (
        <Container sx={{ marginTop: 10 }}>
            {empresa && (
                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h4" gutterBottom>
                                    Bienvenido a {empresa.nombre}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Información de la Empresa:
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Razón Social:</strong> {empresa.razonSocial}<br />
                                    <strong>CUIL:</strong> {empresa.cuil}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Información de la Sucursal:
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Nombre:</strong> {sucursal?.nombre}<br />
                                    <strong>Horario de Apertura:</strong> {sucursal?.horarioApertura}<br />
                                    <strong>Horario de Cierre:</strong> {sucursal?.horarioCierre}<br />
                                    <strong>Dirección:</strong> {sucursal?.domicilio.calle} {sucursal?.domicilio.numero}, {sucursal?.domicilio.localidad.nombre}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <BootstrapCarousel imagenes={empresa.imagenes}  />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}

export default Home;
