// core/models/cliente.ts

export class Cliente {
    id: number;
    nombre: string;
    apellido: string;
    direccion: string;
    razon_social: string;
    tipo_empresa: string;
    email: string;
    telefono_1: string;
    telefono_2: string;

    constructor() {
        this.id = 0;
        this.nombre = '';
        this.apellido = '';
        this.direccion = '';
        this.razon_social = '';
        this.tipo_empresa = '';
        this.email = '';
        this.telefono_1 = '';
        this.telefono_2 = '';
    }
}
