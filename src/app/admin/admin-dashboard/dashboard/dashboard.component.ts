import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexDataLabels, ApexPlotOptions, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { DashboardService } from '../../../core/services/dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  title: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  labels?: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public movimientosChartOptions: Partial<ChartOptions> = {};
  public ventasChartOptions: Partial<ChartOptions> = {};

  totalClientes: number = 0;
  porcentaje_aumento_clientes: number = 0;

  totalProductos: number = 0;
  porcentaje_aumento_producto: number = 0;

  totalVentas: number = 0;
  porcentaje_aumento_comprobantes: number = 0;

  totalUsuarios: number = 0;
  porcentaje_aumento_usuarios: number = 0;

  constructor(private dashboardService: DashboardService) {}

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

    // GRAFCIO:
    this.dashboardService.getMovimientos().subscribe(data => {
      const fechas = data.map((mov: any) => this.formatDate(mov.created_at));
      const entradas = data
        .filter((mov: any) => mov.tipo_movimiento === 1)  // tipo_movimiento 1 = Entrada
        .map((mov: any) => mov.cant_total);
      const salidas = data
        .filter((mov: any) => mov.tipo_movimiento === 2)  // tipo_movimiento 2 = Salida
        .map((mov: any) => mov.cant_total);

      this.createMovimientosChart(fechas, entradas, salidas);
    });
    this.dashboardService.getVentasPorDiaSemana().subscribe(data => {
      const dias = data.map((venta: any) => venta.dia_semana);
      const ventas = data.map((venta: any) => venta.total_ventas);

      this.createVentasChart(dias, ventas);
    });

  }

  createVentasChart(dias: string[], ventas: number[]) {
    this.ventasChartOptions = {
      series: [
        {
          name: 'Ventas',
          data: ventas
        }
      ],
      chart: {
        height: 400,
        type: 'line'
      },
      title: {
        text: 'Ventas Diarias por Día de la Semana'
      },
      xaxis: {
        categories: dias,
        title: {
          text: 'Días de la Semana'
        }
      },
      dataLabels: {
        enabled: false
      }
    };
  }

  createMovimientosChart(fechas: string[], entradas: number[], salidas: number[]) {
    this.movimientosChartOptions = {
      series: [
        {
          name: 'Entradas',
          data: entradas
        },
        {
          name: 'Salidas',
          data: salidas
        }
      ],
      chart: {
        height: 400,
        type: 'bar'
      },
      title: {
        text: 'Movimientos'
      },
      xaxis: {
        categories: fechas,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5
        }
      },
      dataLabels: {
        enabled: false
      }
    };
  }


  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

}
