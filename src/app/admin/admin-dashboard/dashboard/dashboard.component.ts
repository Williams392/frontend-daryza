import { Component, OnInit  } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ClienteService } from '../../../core/services/cliente.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  totalClientes: number = 0;
  porcentajeAumento: number = 0;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.clienteService.getConteoClientes().subscribe(data => {
      this.totalClientes = data.total_clientes;
      this.porcentajeAumento = data.porcentaje_aumento;
    }, error => {
      console.error("Error fetching client data:", error);
    });
  }
  
}
