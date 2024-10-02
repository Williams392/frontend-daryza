import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://127.0.0.1:8000/api/almacen/productos/';

  constructor(private http: HttpClient) {}

  getProductoLista(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}${id}/`);
  }

  postAgregarProducto(productoData: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, productoData);
  } 

  putActualizarProducto(id: number, productoData: FormData): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}${id}/`, productoData);
  }


  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
  
}
