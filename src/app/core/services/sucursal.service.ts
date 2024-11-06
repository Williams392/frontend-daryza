// services/cliente.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Sucursal } from '../models/Sucursal';
// import { Cliente } from '../models/Cliente';


@Injectable({
  providedIn: 'root'
})
export class SucursalService {
    
    private apiUrl = `${environment.apiUrl}/venta/sucursales/`;

    constructor(private http: HttpClient) {}

    cargarSucursales(): Observable<Sucursal[]> {
        return this.http.get<Sucursal[]>(this.apiUrl);
    }
    
    getSucursal(id_cliente: number): Observable<Sucursal> {
        return this.http.get<Sucursal>(`${this.apiUrl}${id_cliente}/`);
    }

    createSucursal(cliente: Sucursal): Observable<Sucursal> {
        return this.http.post<Sucursal>(this.apiUrl, cliente);
    }

    updateSucursal(id_cliente: number, cliente: Sucursal): Observable<Sucursal> {
        return this.http.put<Sucursal>(`${this.apiUrl}${id_cliente}/`, cliente);
    }

    deleteSucursal(id_cliente: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id_cliente}/`);
    }

}
