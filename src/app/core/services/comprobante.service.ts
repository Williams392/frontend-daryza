// src/app/services/comprobante.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Comprobante } from '../models/Comprobante';

@Injectable({
    providedIn: 'root',
})
export class ComprobanteService {
    private apiUrl = `${environment.apiUrl}/venta/comprobantes/`; 

    constructor(private http: HttpClient) {}

    // Obtener todos los comprobantes
    getComprobantes(): Observable<Comprobante[]> {
        return this.http.get<Comprobante[]>(this.apiUrl);
    }

    // Obtener un comprobante por ID
    getComprobante(id: number): Observable<Comprobante> {
        return this.http.get<Comprobante>(`${this.apiUrl}/${id}`);
    }

    // Eliminar un comprobante
    deleteComprobante(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
