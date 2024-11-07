import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Comprobante } from '../../../core/models/Comprobante';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrl: './historial-ventas.component.css',
  providers: [DatePipe]
})
export class HistorialVentasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id_comprobante', 'numero_serie', 'tipo_moneda', 'fecha_emision', 'departamento', 'pdf_url'];	
  dataSource = new MatTableDataSource<Comprobante>();
  tipoVentaFiltro: string = 'Todos';
  ordenarPor: string = 'asc';
  pdfSrc: string | Uint8Array | undefined = undefined;

  constructor(
    private historialVentasService: ComprobanteService,
    private datePipe: DatePipe
  ) {}

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
    this.applySort();
  }
  applySort() {
    const sortDirection = this.ordenarPor;
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sortDirection === 'asc';
      return this.compare(a.id_comprobante, b.id_comprobante, isAsc);
    });
  }

  compare(a: number | string | undefined, b: number | string | undefined, isAsc: boolean) {
    if (a === undefined || b === undefined) {
      return 0;
    }
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  obtenerHistorialVentas() {
    this.historialVentasService.obtenerComprobantes().subscribe(comprobantes => {
      this.dataSource.data = comprobantes.map(comprobante => ({
        ...comprobante,
        fecha_emision: this.datePipe.transform(comprobante.fecha_emision, 'yyyy-MM-dd') || ''
      }));
      this.dataSource.paginator = this.paginator;
      this.applyFilter();
    });
  }

  descargarPDF(id: number) {
    this.historialVentasService.obtenerComprobantePDF(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // -- tabla -----------------------------------------------
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

