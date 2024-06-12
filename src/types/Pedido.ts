import { Estado } from "./enums/Estados";
import { FormaPago } from "./enums/FormaPago";
import { Cliente } from "./ICliente";
import { IDetallePedido } from "./IDetallePedido";
import IDomicilio from "./IDomicilio";
import { Factura } from "./IFactura";


export interface Pedido {
  id: number;
  horaEstimadaFinalizacion: string; 
  total: number;
  totalCosto: number;
  estado: Estado;
  tipoEnvio: string;
  formaPago: FormaPago;
  fechaPedido: string; 
  detallePedidos: IDetallePedido[];
  domicilio: IDomicilio;
  factura: Factura;
  cliente: Cliente;
}
