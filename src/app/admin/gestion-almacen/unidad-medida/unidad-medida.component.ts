import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DatePipe } from '@angular/common';
import { UnidadMedida } from '../../../core/models/UnidadMedida';
import { UnidadMedidaService } from '../../../core/services/unidad.medida.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styleUrl: './unidad-medida.component.css',
  providers: [DatePipe]
})
export class UnidadMedidaComponent implements OnInit {
  @ViewChild('unidadMedidaForm', { static: false }) unidadMedidaForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  unidades: UnidadMedida[] = [];
  unidadMedida: UnidadMedida = new UnidadMedida();

  displayedColumns: string[] = ['id_unidad_medida', 'nombre', 'abreviacion', 'created_at', 'update_at', 'editar', 'eliminar'];
  unidades_dataSource = new MatTableDataSource<UnidadMedida>();
  
  constructor(
    private unidadMedidaService: UnidadMedidaService,
    private snack: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerUnidades();

    this.unidades_dataSource.filterPredicate = (data: UnidadMedida, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      return (
        (data.id_unidad_medida?.toString().toLowerCase().includes(transformedFilter) || false) || 
        (data.nombre?.toLowerCase().includes(transformedFilter) || false)
      );
    };

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.unidades_dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.unidades_dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.getPageSize();
    this.paginator.page.subscribe(() => {
        this.setPageSize(this.paginator.pageSize);
    });
  }

  // -------------- Mantener el Elementos por Pagina. --------------
  getPageSize(): number {
    const pageSize = localStorage.getItem('pageSize');
    return pageSize ? +pageSize : 5; // Valor por defecto 5
  }

  setPageSize(size: number) {
      localStorage.setItem('pageSize', size.toString());
  }
  // ------------------------------------------

    obtenerUnidades() {
        this.unidadMedidaService.getUnidadMedidaLista().subscribe(unidades => {
            this.unidades_dataSource.data = unidades.map(unidad => ({
                ...unidad,
                created_at: this.datePipe.transform(unidad.created_at, 'yyyy-MM-dd HH:mm'),
                update_at: this.datePipe.transform(unidad.update_at, 'yyyy-MM-dd HH:mm')
            }));
        });
    }

    guardarUnidadMedida() {
        if (this.unidadMedidaForm.valid) {
            if (this.unidadMedida.id_unidad_medida) {
                this.unidadMedidaService.putActualizarUnidadMedida(this.unidadMedida.id_unidad_medida, this.unidadMedida).subscribe({
                    next: () => this.onSuccess('Unidad de Medida actualizada con éxito'),
                    error: () => this.onError('Error al actualizar la Unidad de Medida')
                });
            } else {
                this.unidadMedidaService.postAgregarUnidadMedida(this.unidadMedida).subscribe({
                    next: () => this.onSuccess('Unidad de Medida guardada con éxito'),
                    error: () => this.onError('Error al guardar la Unidad de Medida')
                });
            }
        } else {
            this.snack.open('Rellene todos los campos', 'Aceptar', { duration: 3000 });
        }
    }

    eliminarUnidadMedida(id: number) {
        this.unidadMedidaService.eliminarUnidadMedida(id).subscribe(() => {
            this.obtenerUnidades();
        });
    }

    editarUnidadMedida(id: number) {
        this.unidadMedidaService.getUnidadMedida(id).subscribe(unidad => {
            this.unidadMedida = unidad;
            this.abrirModal(); // Abrir el modal al editar
        });
    }

  // -------------- venta modal --------------
  onSuccess(message: string) {
    Swal.fire('Éxito', message, 'success').then(() => {
      this.obtenerUnidades();
      this.cerrarModal(); // Cerrar el modal en caso de éxito
    });
  }

    onError(message: string) {
        Swal.fire('Error', message, 'error');
    }
    cancelar() {
      this.unidadMedida = new UnidadMedida();  // Reset the form data
    }

  abrirModal() {
    const modalElement = document.getElementById('agregarUnidadMedidaModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('agregarUnidadMedidaModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.cancelar();  // Clear the form after closing
    }
  }
  // ------------------------------------------

}
