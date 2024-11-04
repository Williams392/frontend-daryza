// services/cliente.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Cliente } from '../models/Cliente';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
    
    private apiUrl = `${environment.apiUrl}/venta/clientes/`;

    constructor(private http: HttpClient) {}

    getClientes(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.apiUrl);
    }
    
    getCliente(id_cliente: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.apiUrl}${id_cliente}/`);
    }

    createCliente(cliente: Cliente): Observable<Cliente> {
        return this.http.post<Cliente>(this.apiUrl, cliente);
    }

    updateCliente(id_cliente: number, cliente: Cliente): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.apiUrl}${id_cliente}/`, cliente);
    }

    deleteCliente(id_cliente: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id_cliente}/`);
    }
}
