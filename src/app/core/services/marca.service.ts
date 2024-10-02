import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/Marca';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private apiUrl = 'http://localhost:8000/api/almacen/marcas/'; 

  constructor(private http: HttpClient) {}

  getMarcaLista(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  getMarca(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}${id}/`);
  }

  postAgregarMarca(data: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, data);
  }

  putActualizarMarca(id: number, data: Marca): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}${id}/`, data);
  }

  eliminarMarca(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

}
