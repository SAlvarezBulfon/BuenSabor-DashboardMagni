import DataModel from "./DataModel";

export interface IDetallePedido  extends DataModel<IDetallePedido>{
    id: number;
    cantidad: number;
    subTotal: number;
    articuloNombre: string;
  }
  