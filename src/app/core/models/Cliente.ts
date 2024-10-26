// core/models/cliente.ts

export class Cliente {
    id_cliente: number;
    nombre_clie: string;
    apellido_clie: string;

    //cliente_tipo_doc: string;
    dni_cliente: string;
    ruc_cliente: string;

    direccion_clie: string;
    razon_socialCliente: string;

    tipo_empresa: string;
    email_cliente: string;
    telefono_cliente: string;

    constructor() {
        this.id_cliente = 0;
        this.nombre_clie = '';
        //this.cliente_tipo_doc = '';
        this.apellido_clie = '';
        this.dni_cliente = '';
        this.ruc_cliente = '';
        this.direccion_clie = '';
        this.razon_socialCliente = '';
        this.tipo_empresa = '';
        this.email_cliente = '';
        this.telefono_cliente = '';
    }
}


// export class Cliente {
//     id_cliente: number;
//     nombre_clie: string;
//     apellido_clie: string;

//     cliente_tipo_doc: string;
//     cliente_numDoc: string;

//     direccion_clie: string;
//     razon_socialCliente: string;

//     tipo_empresa: string;
//     email_cliente: string;
//     telefono_cliente: string;

//     constructor() {
//         this.id_cliente = 0;
//         this.nombre_clie = '';
//         this.apellido_clie = '';
//         this.cliente_tipo_doc = '';
//         this.cliente_numDoc = '';
//         this.direccion_clie = '';
//         this.razon_socialCliente = '';
//         this.tipo_empresa = '';
//         this.email_cliente = '';
//         this.telefono_cliente = '';
//     }
// }
