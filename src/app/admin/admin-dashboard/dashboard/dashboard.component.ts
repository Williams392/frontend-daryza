import { Component, OnInit  } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ClienteService } from '../../../core/services/cliente.service';
import { ProductoService } from '../../../core/services/producto.service';
import { DashboardService } from '../../../core/services/dashboard.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  totalClientes: number = 0;
  porcentaje_aumento_clientes: number = 0;

  totalProductos: number = 0;
  porcentaje_aumento_producto: number = 0;

  totalVentas: number = 0;
  porcentaje_aumento_comprobantes: number = 0;

  totalUsuarios: number = 0;
  porcentaje_aumento_usuarios: number = 0;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getConteoClientes().subscribe(data => {
      this.totalClientes = data.total_clientes;
      this.porcentaje_aumento_clientes = data.porcentaje_aumento_clientes;
    }, error => {
      console.error("Error fetching client data:", error);
    });

    this.dashboardService.getConteoProductos().subscribe(data => {
      this.totalProductos = data.total_productos;
      this.porcentaje_aumento_producto = data.porcentaje_aumento_producto;
    }, error => {
      console.error("Error fetching product data:", error);
    });

    this.dashboardService.getConteoVentas().subscribe(data => {
      this.totalVentas = data.total_comprobantes;
      this.porcentaje_aumento_comprobantes = data.porcentaje_aumento_comprobantes;
    }, error => {
      console.error("Error fetching venta data:", error);
    });

    this.dashboardService.getConteoUsuarios().subscribe(data => {
      this.totalUsuarios = data.total_usuarios;
      this.porcentaje_aumento_usuarios = data.porcentaje_aumento_usuarios;
    }, error => {
      console.error("Error fetching user data:", error);
    });

  }
  
}
