export class Producto {
    id_producto?: number;
    nombre_prod: string;
    descripcion_pro?: string | null; 
    precio_compra: number;
    precio_venta: number;
    codigo: string;
    estado?: boolean;
    estock: number;
    estock_minimo: number;
    marca: number; 
    categoria: number; 
    unidad_medida: number; 
    imagen?: string | null; 
    created_at?: string | null; 
    update_at?: string | null;  

    constructor(
        nombre_prod: string,
        precio_compra: number,
        precio_venta: number,
        codigo: string,
        estock: number,
        estock_minimo: number,
        marca: number,
        categoria: number,
        unidad_medida: number,
        imagen?: string | null, // Acepta null
        descripcion_pro?: string | null,
        estado?: boolean
    ) {
        this.nombre_prod = nombre_prod;
        this.precio_compra = precio_compra;
        this.precio_venta = precio_venta;
        this.codigo = codigo;
        this.estock = estock;
        this.estock_minimo = estock_minimo;
        this.marca = marca;
        this.categoria = categoria;
        this.unidad_medida = unidad_medida;
        this.imagen = imagen ?? null; // Inicializa la imagen a null si no se proporciona
        this.descripcion_pro = descripcion_pro ?? null;
        this.estado = estado ?? true; // Valor predeterminado
    }
}
