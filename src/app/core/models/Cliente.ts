export class Cliente {
    id_cliente: number;
    nombre_clie: string;
    apellido_clie: string;
    
    dni_cliente: string;
    ruc_cliente: string | null | undefined;

    direccion_clie: string;
    razon_socialCliente: string;

    tipo_empresa: string;
    email_cliente: string;
    telefono_cliente: string;

    constructor() {
        this.id_cliente = 0;
        this.nombre_clie = '';
        this.apellido_clie = '';
        this.dni_cliente = '';
        this.ruc_cliente = null;  // Inicializado como null
        this.direccion_clie = '';
        this.razon_socialCliente = '';
        this.tipo_empresa = '';
        this.email_cliente = '';
        this.telefono_cliente = '';
    }
}
