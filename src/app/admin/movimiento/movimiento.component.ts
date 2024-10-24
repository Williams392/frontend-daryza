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
  tipoMovimientoFiltro: string = 'Todos';

  constructor(private movimientoService: MovimientoService) {}

  ngOnInit() {
    this.obtenerMovimientos();
  }

  obtenerMovimientos() {
    this.movimientoService.getMovimientos().subscribe(movimientos => {
      this.dataSource.data = movimientos;
      this.dataSource.paginator = this.paginator;
      this.applyFilter(); // Aplicar filtro después de obtener los datos
    });
  }

  applyFilter() {
    const filterValue = this.tipoMovimientoFiltro;
    if (filterValue === 'Todos') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
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