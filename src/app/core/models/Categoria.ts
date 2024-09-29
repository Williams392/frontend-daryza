export interface Categoria {
    id_categoria?: number;
    nombre: string;
    estado: boolean;
    created_at?: string | null;  // Permite null
    update_at?: string | null;    // Permite null
}
