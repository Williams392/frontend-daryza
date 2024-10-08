export class User {
    id: number;
    username: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    name_role: Rol[]; 
    constructor() {
        this.id = 0; 
        this.username = '';
        this.last_name = '';
        this.email = '';
        this.password = '';
        this.phone_number = '';
        this.name_role = [];
    }
}

export interface Rol {
    id: number;
    name_role: string;
}
