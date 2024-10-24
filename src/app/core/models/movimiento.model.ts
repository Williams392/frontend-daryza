// movimiento.model.ts

export interface DetalleMovimiento {
    id_detalleMovimiento: number;
    cantidad: number;
    nombre_prod: string;
    movimiento: number;
}

export interface Movimiento {
    id_movimiento: number;
    referencia: string;
    cant_total: number;
    created_at: string;
    updated_at: string;
    sucursal: number;
    usuario: number;
    tipo_movimiento: number;
    detalles: DetalleMovimiento[];
}
