import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MarcaService } from '../../../core/services/marca.service';
import { Marca } from '../../../core/models/Marca';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.css',
  providers: [DatePipe]
})
export class MarcaComponent {
  @ViewChild('marcaForm', { static: false }) marcaForm!: NgForm;
  marcas: Marca[] = [];
  marca: Marca = new Marca();

  paginatedMarcas: Marca[] = []; // Arreglo para almacenar las marcas paginadas
  pageSize = 5; // Tamaño de página
  currentPage = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  pages: number[] = []; // Array de páginas

  constructor(
    private marcaService: MarcaService, 
    private snack: MatSnackBar,
    private datePipe: DatePipe 
  ) {}

  ngOnInit() {
    this.obtenerMarcas();
  }

  // Obtener lista de marcas con fechas formateadas
  obtenerMarcas() {
    this.marcaService.getMarcaLista().subscribe(marcas => {
      this.marcas = marcas.map(marca => ({
        ...marca,
        created_at: this.datePipe.transform(marca.created_at, 'yyyy-MM-dd HH:mm'), // Formatear la fecha
        update_at: this.datePipe.transform(marca.update_at, 'yyyy-MM-dd HH:mm')    // Formatear la fecha
      }));
      this.totalPages = Math.ceil(this.marcas.length / this.pageSize); // Calcular total de páginas
      this.updatePages();
      this.irAlaPagina(1); // Mostrar la primera página al cargar
    });
  }

  // Guardar o actualizar marca
  guardarMarca() {
    if (this.marcaForm.valid) {
      if (this.marca.id) {
        this.marcaService.putActualizarMarca(this.marca.id, this.marca).subscribe({
          next: () => this.onSuccess('Marca actualizada con éxito'),
          error: () => this.onError('Error al actualizar la marca')
        });
      } else {
        this.marcaService.postAgregarMarca(this.marca).subscribe({
          next: () => this.onSuccess('Marca guardada con éxito'),
          error: () => this.onError('Error al guardar la marca')
        });
      }
    } else {
      this.snack.open('Rellene todos los campos', 'Aceptar', { duration: 3000 });
    }
  }

  // Eliminar marca
  eliminarMarca(id: number) {
    this.marcaService.eliminarMarca(id).subscribe(() => {
      this.obtenerMarcas();
    });
  }

  // Editar marca
  editarMarca(id: number) {
    this.marcaService.getMarca(id).subscribe(marca => {
      this.marca = marca;
    });
  }

  // Mensajes de éxito y error
  onSuccess(message: string) {
    Swal.fire('Éxito', message, 'success');
    this.obtenerMarcas();
    this.cancelar();
  }

  onError(message: string) {
    Swal.fire('Error', message, 'error');
  }

  cancelar() {
    this.marca = new Marca();
  }

  // -------------------------
  // Métodos para paginación

  updatePages() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  irAlaPagina(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMarcas = this.marcas.slice(startIndex, endIndex); // Paginamos las marcas
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.irAlaPagina(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.irAlaPagina(this.currentPage + 1);
    }
  }
  
}