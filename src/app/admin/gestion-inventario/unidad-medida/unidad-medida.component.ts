import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DatePipe } from '@angular/common';
import { UnidadMedida } from '../../../core/models/UnidadMedida';
import { UnidadMedidaService } from '../../../core/services/unidad.medida.service';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styleUrl: './unidad-medida.component.css',
  providers: [DatePipe]
})
export class UnidadMedidaComponent implements OnInit {
  @ViewChild('unidadMedidaForm', { static: false }) unidadMedidaForm!: NgForm;
  unidades: UnidadMedida[] = [];
  paginatedUnidadesMedida: UnidadMedida[] = []; // Unidades de medida paginadas
  unidadMedida: UnidadMedida = new UnidadMedida();

  pageSize = 5; // Tamaño de página
  currentPage = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  pages: number[] = []; // Array de páginas

  constructor(
    private unidadMedidaService: UnidadMedidaService,
    private snack: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerUnidades();
  }

  obtenerUnidades() {
    this.unidadMedidaService.getUnidadMedidaLista().subscribe(unidades => {
      this.unidades = unidades.map(unidad => ({
        ...unidad,
        created_at: this.datePipe.transform(unidad.created_at, 'yyyy-MM-dd HH:mm'), // Formatear la fecha
        update_at: this.datePipe.transform(unidad.update_at, 'yyyy-MM-dd HH:mm')    // Formatear la fecha
      }));
      this.totalPages = Math.ceil(this.unidades.length / this.pageSize); // Calcular total de páginas
      this.updatePages();
      this.irAlaPagina(1); // Mostrar la primera página al cargar
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
    });
  }

  onSuccess(message: string) {
    Swal.fire('Éxito', message, 'success').then(() => {
      this.obtenerUnidades();
      this.unidadMedidaForm.reset();
    });
  }

  onError(message: string) {
    Swal.fire('Error', message, 'error');
  }

  cancelar() {
    this.unidadMedidaForm.reset();
  }

  // -------------------------
  // Métodos para paginación

  // Actualiza el array de páginas
  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  irAlaPagina(page: number) {
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedUnidadesMedida = this.unidades.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.irAlaPagina(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.irAlaPagina(this.currentPage - 1);
    }
  }

}

