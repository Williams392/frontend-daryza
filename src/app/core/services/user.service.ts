import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { User, RolResponse } from '../models/User'; // Asegúrate de definir estos modelos

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.apiUrl + "/users";  // URL base para los usuarios
    private rolesUrl = environment.apiUrl + "/roles"; // URL base para los roles
    //private perfilesUrl = environment.apiUrl + "/perfiles"; // URL base para los perfiles

    constructor(private http: HttpClient) {}

    // CRUD para Usuarios
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}/`);
    }

    createUser(user: User): Observable<User> {
        // Elimina roles duplicados y filtra 'undefined'
        user.roles = Array.from(new Set(user.roles.map(role => role.id)))
            .map(id => user.roles.find(role => role.id === id))
            .filter((role): role is RolResponse => role !== undefined); // Filtrar undefined
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(id: number, user: User): Observable<User> {
        // Elimina roles duplicados y filtra 'undefined'
        user.roles = Array.from(new Set(user.roles.map(role => role.id)))
            .map(id => user.roles.find(role => role.id === id))
            .filter((role): role is RolResponse => role !== undefined); // Filtrar undefined
        return this.http.put<User>(`${this.apiUrl}/${id}/`, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}/`);
    }

    // CRUD para Roles
    getRoles(): Observable<RolResponse[]> {
        return this.http.get<RolResponse[]>(this.rolesUrl);
    }

    getRole(id: number): Observable<RolResponse> {
        return this.http.get<RolResponse>(`${this.rolesUrl}/${id}/`);
    }

    createRole(role: RolResponse): Observable<RolResponse> {
        return this.http.post<RolResponse>(this.rolesUrl, role);
    }

    updateRole(id: number, role: RolResponse): Observable<RolResponse> {
        return this.http.put<RolResponse>(`${this.rolesUrl}/${id}/`, role);
    }

    deleteRole(id: number): Observable<void> {
        return this.http.delete<void>(`${this.rolesUrl}/${id}/`);
    }

    // CRUD para Perfiles
    // getPerfiles(): Observable<Perfil[]> {
    //     return this.http.get<Perfil[]>(this.perfilesUrl);
    // }

    // getPerfil(id: number): Observable<Perfil> {
    //     return this.http.get<Perfil>(`${this.perfilesUrl}/${id}/`);
    // }

    // createPerfil(perfil: Perfil): Observable<Perfil> {
    //     return this.http.post<Perfil>(this.perfilesUrl, perfil);
    // }

    // updatePerfil(id: number, perfil: Perfil): Observable<Perfil> {
    //     return this.http.put<Perfil>(`${this.perfilesUrl}/${id}/`, perfil);
    // }

    // deletePerfil(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.perfilesUrl}/${id}/`);
    // }

}
