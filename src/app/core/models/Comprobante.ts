import { Cliente } from "./Cliente";

export interface Detalle {
    id_detalleComprobante: number;
    id_producto: string;
    unidad: string;
    descripcion: string;
    cantidad: number;
    monto_valorUnitario: number;
    igv_detalle: number;
    monto_Precio_Unitario: string;
    monto_Valor_Venta: string;
}

export interface FormaPago {
    id_formaPago: number;
    tipo: string;
    monto: string;
    cuota: number;
    fecha_emision: string;
    fecha_vencimiento: string;
}

export interface LegendComprobante {
    id_legend: number;
    legend_code: string;
    legend_value: string;
}

export interface Comprobante {
    id_comprobante: number;
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
    monto_Oper_Gravadas: string;
    monto_Igv: string;
    valor_venta: string;
    sub_Total: string;
    monto_Imp_Venta: string;
    estado_Documento: string;
    manual: boolean;
    detalle: Detalle[];
    forma_pago: FormaPago;
    legend_comprobante: LegendComprobante;
    pdf_url: string;
}