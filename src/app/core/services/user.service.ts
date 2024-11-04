import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { User, Rol } from '../models/User'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/auth/users/`;  
    private rolesUrl = `${environment.apiUrl}/auth/roles/`;

    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }    

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}${id}/`);
    }

    createUser(formData: FormData): Observable<User> {
        return this.http.post<User>(this.apiUrl, formData);
    }

    updateUser(id: number, formData: FormData): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}${id}/`, formData);
    }    

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }

    // CRUD para Roles
    getRoles(): Observable<Rol[]> {
        return this.http.get<Rol[]>(this.rolesUrl);
    }

    getRole(id: number): Observable<Rol> {
        return this.http.get<Rol>(`${this.rolesUrl}${id}/`);
    }

    createRole(role: Rol): Observable<Rol> {
        return this.http.post<Rol>(this.rolesUrl, role);
    }


    updateRole(id: number, role: Rol): Observable<Rol> {
        return this.http.put<Rol>(`${this.rolesUrl}${id}/`, role);
    }

    deleteRole(id: number): Observable<void> {
        return this.http.delete<void>(`${this.rolesUrl}${id}/`);
    }

}

