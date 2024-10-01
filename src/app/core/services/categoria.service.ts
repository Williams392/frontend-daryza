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

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Obtiene el token del servicio de autenticación
    console.log('Token obtenido para headers:', token); // Verifica el token
    return new HttpHeaders({
      'Authorization': `Token ${token}`, // Agrega el token en el encabezado
    });
  }
  

  getCategoriaLista(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  postAgregarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria, { headers: this.getHeaders() });
  }

  putActualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}${id}/`, categoria, { headers: this.getHeaders() });
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}