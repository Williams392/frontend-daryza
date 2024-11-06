import { Cliente } from "./Cliente";
import { Sucursal } from "./Sucursal";

export interface DetalleComprobante {
    id_detalleComprobante?: number; // opcional
    id_producto: string;  
    cantidad: number;
}
  
export interface FormaPago {
    id_formaPago?: number; 
    tipo: string;
}

export interface Comprobante {
    id_comprobante?: number; 
    tipo_operacion: string;
    numero_serie: string;
    tipo_doc: string;
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
  
    cliente: number;  
    sucursal: number; 

    detalle: DetalleComprobante[];
    forma_pago: FormaPago;

}