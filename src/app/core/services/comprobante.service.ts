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

    crearComprobante(comprobante: Comprobante): Observable<Comprobante> {
        return this.http.post<Comprobante>(this.apiUrl, comprobante);
    }

    obtenerComprobantes(): Observable<Comprobante[]> {
        return this.http.get<Comprobante[]>(this.apiUrl);
    }

    obtenerComprobantePorId(id: number): Observable<Comprobante> {
        return this.http.get<Comprobante>(`${this.apiUrl}${id}/`);
    }
    obtenerComprobantePDF(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}pdf/${id}/`, { responseType: 'blob' });
    }

    actualizarComprobante(id: number, comprobante: Comprobante): Observable<Comprobante> {
        return this.http.put<Comprobante>(`${this.apiUrl}${id}/`, comprobante);
    }

    eliminarComprobante(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }

}
