
import IDomicilio from './IDomicilio';
import { ImagenCliente } from './ImagenCliente';

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string; 
  domicilios: IDomicilio[];
  imagenCliente: ImagenCliente;
}
