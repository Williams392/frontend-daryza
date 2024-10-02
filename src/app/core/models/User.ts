export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    roles: RolResponse[]; // Puede contener múltiples roles
}

export interface RolResponse {
    id: number;
    name_role: string;
}

export interface Perfil {
    id: number;
    user: User; 
    name_role: RolResponse; // Podría ser un array si un perfil tiene múltiples roles
}
