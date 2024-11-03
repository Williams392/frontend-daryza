import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Comprobante } from '../../../core/models/Comprobante';
import { ComprobanteService } from '../../../core/services/comprobante.service';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrl: './historial-ventas.component.css'
})
export class HistorialVentasComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id_comprobante', 'numero_serie', 'tipo_moneda', 'fecha_emision', 'departamento', 'pdf_url'];	
  dataSource = new MatTableDataSource<Comprobante>();
  tipoVentaFiltro: string = 'Todos';

  constructor(private historialVentasService: ComprobanteService) {}

  ngOnInit() {
    this.obtenerHistorialVentas();
    this.applyFilter();
  }

  applyFilter() {
    const filterValue = this.tipoVentaFiltro;
    if (filterValue === 'Todos') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  obtenerHistorialVentas() {
    this.historialVentasService.getComprobantes().subscribe(comprobantes => {
      this.dataSource.data = comprobantes;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.getPageSize();
    this.paginator.page.subscribe(() => {
      this.setPageSize(this.paginator.pageSize);
    });
  }

  getPageSize(): number {
    const pageSize = localStorage.getItem('pageSize');
    return pageSize ? +pageSize : 5; // Valor por defecto 5
  }

  setPageSize(size: number) {
    localStorage.setItem('pageSize', size.toString());
  }
}

