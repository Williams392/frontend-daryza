// src/app/core/services/unidad-medida.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadMedida } from '../models/UnidadMedida';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {
    
  private baseUrl = 'http://localhost:8000/api/inventario/unidadesmedida/'; 

  constructor(private http: HttpClient) {}

  getUnidadMedidaLista(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(this.baseUrl);
  }

  getUnidadMedida(id: number): Observable<UnidadMedida> {
    return this.http.get<UnidadMedida>(`${this.baseUrl}${id}/`);
  }

  postAgregarUnidadMedida(data: UnidadMedida): Observable<UnidadMedida> {
    return this.http.post<UnidadMedida>(this.baseUrl, data);
  }

  putActualizarUnidadMedida(id: number, data: UnidadMedida): Observable<UnidadMedida> {
    return this.http.put<UnidadMedida>(`${this.baseUrl}${id}/`, data);
  }

  eliminarUnidadMedida(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }

}
