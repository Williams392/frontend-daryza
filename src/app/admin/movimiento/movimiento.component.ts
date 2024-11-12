import { Component, ViewChild,OnInit, AfterViewInit  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MovimientoService } from '../../core/services/movimiento.service';
import { Movimiento } from '../../core/models/movimiento.model';

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.css'
})
export class MovimientoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id_movimiento', 'nombre_prod', 'referencia', 'cant_total', 'tipo_movimiento', 'created_at'];
  dataSource = new MatTableDataSource<Movimiento>();
  ordenarPor: string = 'asc';
  tipoMovimientoFiltro: string = 'Todos';
  isLoading: boolean = true; // Para el estado de carga

  constructor(private movimientoService: MovimientoService) {}

  ngOnInit() {
    this.obtenerMovimientos();
  }

  obtenerMovimientos() {
    this.isLoading = true; // Inicia la carga
    this.movimientoService.getMovimientos().subscribe(movimientos => {
      this.dataSource.data = movimientos;
      this.dataSource.paginator = this.paginator;
      this.applyFilter(); // Aplicar filtro después de obtener los datos
      this.isLoading = false; // Finaliza la carga
    }, error => {
      this.isLoading = false; // En caso de error, también finaliza la carga
      console.error('Error al obtener movimientos:', error);
    });
  }

  applyFilter() {
    const filterValue = this.tipoMovimientoFiltro;
    if (filterValue === 'Todos') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    };
    this.applySort();
  }
  applySort() {
    const sortDirection = this.ordenarPor;
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sortDirection === 'asc';
      return this.compare(a.id_movimiento, b.id_movimiento, isAsc);
    });
  }
  compare(a: number | string | undefined, b: number | string | undefined, isAsc: boolean) {
    if (a === undefined || b === undefined) {
      return 0;
    }
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // ------- Metodos para descargar el PDF y Excel -------

  descargarPDF() {
    this.movimientoService.descargarPDF().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movimientos.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  descargarExcel() {
    this.movimientoService.descargarExcel().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movimientos.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // ------- Mantener el Elementos por Pagina. -------
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.getPageSize();
    this.paginator.page.subscribe(() => {
      this.setPageSize(this.paginator.pageSize);
    });

    // Configurar el filtro personalizado para tipo de movimiento
    this.dataSource.filterPredicate = (data: Movimiento, filter: string) => {
      if (filter === '') {
        return true;
      }
      const tipoMovimiento = data.tipo_movimiento === 1 ? 'entrada' : 'salida';
      return tipoMovimiento.includes(filter);
    };
  }

  getPageSize(): number {
    const pageSize = localStorage.getItem('pageSize');
    return pageSize ? +pageSize : 5; // Valor por defecto 5
  }

  setPageSize(size: number) {
    localStorage.setItem('pageSize', size.toString());
  }
  // -------------------------------------------------
  
}