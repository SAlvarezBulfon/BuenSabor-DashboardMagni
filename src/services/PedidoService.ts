import { Pedido } from "../types/Pedido";
import BackendClient from "./BackendClient";

export default class PedidoService extends BackendClient<Pedido|any> {

  async findByEstado(url: string, estado: string): Promise<Pedido[]> {
    const path = `${url}/findByEstado?estado=${estado}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    return this.requestAll(path, options);
  }
}
