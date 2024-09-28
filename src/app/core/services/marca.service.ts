import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/Marca';


@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private baseUrl = 'http://localhost:8000/api/inventario/marcas/'; 

  constructor(private http: HttpClient) {}

  getMarcaLista(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.baseUrl);
  }

  getMarca(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.baseUrl}${id}/`);
  }

  postAgregarMarca(data: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.baseUrl, data);
  }

  putActualizarMarca(id: number, data: Marca): Observable<Marca> {
    return this.http.put<Marca>(`${this.baseUrl}${id}/`, data);
  }

  eliminarMarca(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }

}
