import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cilBarChart, cilCart, cilFastfood, cilPeople, cilSpeedometer, cilClipboard, cilHome } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarNav } from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css';
import SucursalService from '../../../../services/SucursalService';
import ISucursal from '../../../../types/ISucursal';

const BasicSidebar: React.FC = () => {
    const { sucursalId } = useParams<{ sucursalId: string }>();
    const [sucursalNombre, setSucursalNombre] = useState<string>('');
    const [empresaNombre, setEmpresaNombre] = useState<string>('');
    const [rol, setRole] = useState<string>('');
    const url = import.meta.env.VITE_API_URL;
    const sucursalService = new SucursalService();

    useEffect(() => {
        const fetchSucursalYEmpresaNombre = async () => {
            try {
                if (sucursalId) {
                    const sucursal = await sucursalService.get(`${url}/sucursal`, parseInt(sucursalId));
                    setSucursalNombre(sucursal.nombre);

                    if ('empresa' in sucursal) {
                        setEmpresaNombre((sucursal as ISucursal).empresa.nombre);
                    }
                }
            } catch (error) {
                console.error("Error al obtener el nombre de la sucursal o empresa:", error);
            }
        };

        fetchSucursalYEmpresaNombre();
    }, [sucursalId]);

    useEffect(() => {
        const userDataString = localStorage.getItem('usuario');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            const rol = userData["https://my-app.example.com/roles"];
            console.log("rol", rol[0]);
            setRole(rol[0]);
        }
    }, []);

    return (
        <div>
            <CSidebar className="border-end d-flex flex-column" style={{ height: '100vh' }}>
                <CSidebarNav>
                    <CNavTitle>
                        {empresaNombre} - {sucursalNombre}
                    </CNavTitle>
                    {["ADMIN", "COCINERO", "EMPLEADO", "CAJERO"].includes(rol) && (
                        <CNavItem>
                            <Link to={`/dashboard/${sucursalId}`} className="nav-link">
                                <CIcon customClassName="nav-icon" icon={cilHome} />
                                Inicio
                            </Link>
                        </CNavItem>
                    )}
                    {["ADMIN"].includes(rol) && (
                        <CNavItem>
                            <Link to={`/estadisticas/${sucursalId}`} className="nav-link">
                                <CIcon customClassName="nav-icon" icon={cilBarChart} />
                                Estadísticas
                            </Link>
                        </CNavItem>
                    )}
                    {["ADMIN", "COCINERO", "EMPLEADO"].includes(rol) && (
                        <CNavGroup
                            toggler={
                                <>
                                    <CIcon customClassName="nav-icon" icon={cilFastfood} />
                                    Productos
                                </>
                            }
                        >
                            <CNavItem>
                                <Link to={`/productos/${sucursalId}`} className="nav-link">
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Lista de Productos
                                </Link>
                            </CNavItem>
                            {["ADMIN", "EMPLEADO"].includes(rol) && (
                                <CNavItem>
                                    <Link to={`/categorias/${sucursalId}`} className="nav-link">
                                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                        Categorías
                                    </Link>
                                </CNavItem>
                            )}
                        </CNavGroup>
                    )}
                    {["ADMIN"].includes(rol) && (
                        <CNavGroup
                            toggler={
                                <>
                                    <CIcon customClassName="nav-icon" icon={cilPeople} />
                                    Empleados
                                </>
                            }
                        >
                            <CNavItem>
                                <Link to={`/empleados/${sucursalId}`} className="nav-link">
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Lista de Empleados
                                </Link>
                            </CNavItem>
                        </CNavGroup>
                    )}
                    {["ADMIN", "EMPLEADO"].includes(rol) && (
                        <CNavItem>
                            <Link to={`/insumos/${sucursalId}`} className="nav-link">
                                <CIcon customClassName="nav-icon" icon={cilCart} />
                                Insumos
                            </Link>
                        </CNavItem>
                    )}
                    {["ADMIN", "EMPLEADO"].includes(rol) && (
                        <CNavItem>
                            <Link to={`/unidadMedida/${sucursalId}`} className="nav-link">
                                <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                                Unidad de Medida
                            </Link>
                        </CNavItem>
                    )}
                    {["CAJERO", "EMPLEADO", "ADMIN", "COCINERO"].includes(rol) && (
                        <CNavItem>
                            <Link to={`/pedidos/${sucursalId}`} className="nav-link">
                                <CIcon customClassName="nav-icon" icon={cilClipboard} />
                                Pedidos
                            </Link>
                        </CNavItem>
                    )}
                </CSidebarNav>
            </CSidebar>
        </div>
    );
}

export default BasicSidebar;
