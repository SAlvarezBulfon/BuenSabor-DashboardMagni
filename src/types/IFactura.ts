import { FormaPago } from "./enums/FormaPago";

export interface Factura {
    id: number;
    fechaFcturacion: string; 
    mpPaymentId: number;
    mpMerchantOrderId: number;
    mpPreferenceId: string;
    mpPaymentType: string;
    formaPago: FormaPago;
    totalVenta: number;
  }
  