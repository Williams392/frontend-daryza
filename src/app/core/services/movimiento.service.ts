// movimiento.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento } from '../models/movimiento.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = 'http://127.0.0.1:8000/api/movimientos/movimientos/';

  constructor(private http: HttpClient) {}

  getMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.apiUrl);
  }

  getMovimiento(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.apiUrl}${id}/`);
  }

  addMovimiento(movimiento: Movimiento): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.apiUrl, movimiento);
  }

  updateMovimiento(id: number, movimiento: Movimiento): Observable<Movimiento> {
    return this.http.put<Movimiento>(`${this.apiUrl}${id}/`, movimiento);
  }

  deleteMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
