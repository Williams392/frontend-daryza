export interface Categoria {
    id?: number;
    nombre: string;
    estado: boolean;
    created_at?: string | null;  // Permite null
    update_at?: string | null;    // Permite null
}
