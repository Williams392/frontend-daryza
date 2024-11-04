import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

    private apiUrlDashboard = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {}

    // Método para obtener el conteo y el porcentaje de aumento:

    getConteoProductos(): Observable<{ total_productos: number; porcentaje_aumento_producto: number }> {
        return this.http.get<{ total_productos: number; porcentaje_aumento_producto: number }>(`${this.apiUrlDashboard}/dashboard/productos/conteo_y_aumento_productos/`);
    }

    getConteoClientes(): Observable<{ total_clientes: number; porcentaje_aumento_clientes: number }> {
        return this.http.get<{ total_clientes: number; porcentaje_aumento_clientes: number }>(`${this.apiUrlDashboard}/dashboard/clientes/conteo_y_aumento_clientes/`);
    }

    getConteoVentas(): Observable<{ total_comprobantes: number; porcentaje_aumento_comprobantes: number }> {
        return this.http.get<{ total_comprobantes: number; porcentaje_aumento_comprobantes: number }>(`${this.apiUrlDashboard}/dashboard/comprobantes/conteo_y_aumento_comprobantes/`);
    }

    getConteoUsuarios(): Observable<{ total_usuarios: number; porcentaje_aumento_usuarios: number }> {
        return this.http.get<{ total_usuarios: number; porcentaje_aumento_usuarios: number }>(`${this.apiUrlDashboard}/dashboard/usuarios/conteo_y_aumento_usuarios/`);
    }

}
