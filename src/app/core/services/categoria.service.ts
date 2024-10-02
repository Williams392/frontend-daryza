import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service'; 
import { Categoria } from '../models/Categoria'; // Asegúrate de crear el modelo correspondiente

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://127.0.0.1:8000/api/almacen/categorias/';

  constructor(private http: HttpClient) {}

  getCategoriaLista(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl); // No se necesita headers manuales
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}${id}/`); // No se necesita headers manuales
  }

  postAgregarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria); // No se necesita headers manuales
  }

  putActualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}${id}/`, categoria); // No se necesita headers manuales
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`); // No se necesita headers manuales
  }
  
}
