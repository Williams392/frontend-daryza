import { Cliente } from "./Cliente";
import { Sucursal } from "./Sucursal";

export interface Detalle {
    id_producto: string;
    cantidad: number;
  }
  

export interface FormaPago {
    tipo: string;
}

export interface Comprobante {
    id_comprobante?: number; // opcional
    tipo_operacion: string;
    tipo_doc: string;
    numero_serie: string;
    correlativo: string;
    tipo_moneda: string;
    fecha_emision: string;
    hora_emision: string;
    empresa_ruc: string;
    razon_social: string;
    nombre_comercial: string;
    urbanizacion: string;
    distrito: string;
    departamento: string;
    email_empresa: string;
    telefono_emp: string;
    cliente_tipo_doc: string;
  
    cliente: Cliente;
    sucursal: Sucursal;
  
    monto_Oper_Gravadas: string;
    monto_Igv: string;
    valor_venta: string;
    sub_Total: string;
    monto_Imp_Venta: string;
    manual: boolean;
    detalle: Detalle[];
    forma_pago: FormaPago;
}