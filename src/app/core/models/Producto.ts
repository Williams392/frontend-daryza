

export class Producto {
    id_producto?: number;
    nombre: string;
    precio_compra: number;
    precio_venta: number;
    codigo: string;
    estado?: boolean;
    descripcion?: string | null; // Permite null
    estock: number;
    estock_minimo: number;
    marca: number; // ID de la marca
    categoria: number; // ID de la categoría
    unidad_medida: number; // ID de la unidad de medida
    created_at?: string | null;  // Permite null
    update_at?: string | null;   // Permite null

    constructor(
        nombre: string,
        precio_compra: number,
        precio_venta: number,
        codigo: string,
        estock: number,
        estock_minimo: number,
        marca: number,
        categoria: number,
        unidad_medida: number,
        descripcion?: string | null,
        estado?: boolean
    ) {
        this.nombre = nombre;
        this.precio_compra = precio_compra;
        this.precio_venta = precio_venta;
        this.codigo = codigo;
        this.estock = estock;
        this.estock_minimo = estock_minimo;
        this.marca = marca;
        this.categoria = categoria;
        this.unidad_medida = unidad_medida;
        this.descripcion = descripcion ?? null;
        this.estado = estado ?? true; // Valor predeterminado
    }
}
