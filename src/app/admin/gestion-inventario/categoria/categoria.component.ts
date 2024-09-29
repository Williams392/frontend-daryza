import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriaService } from '../../../core/services/categoria.service';

import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Categoria } from '../../../core/models/Categoria';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
  providers: [DatePipe]
})
export class CategoriaComponent implements OnInit {
  @ViewChild('categoriaForm', { static: false }) categoriaForm!: NgForm;
  categorias: Categoria[] = [];
  categoria: Categoria = { nombre: '', estado: true };
  
  paginatedCategorias: Categoria[] = [];
  pageSize = 5;
  currentPage = 1;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.categoriaService.getCategoriaLista().subscribe(categorias => {
      this.categorias = categorias.map(categoria => ({
        ...categoria,
        created_at: this.datePipe.transform(categoria.created_at, 'yyyy-MM-dd HH:mm'),
        update_at: this.datePipe.transform(categoria.update_at, 'yyyy-MM-dd HH:mm')
      }));
      this.totalPages = Math.ceil(this.categorias.length / this.pageSize);
      this.updatePages();
      this.irAlaPagina(1);
    });
  }

  guardarCategoria() {
    if (this.categoriaForm.valid) {
      if (this.categoria.id) {
        this.categoriaService.putActualizarCategoria(this.categoria.id, this.categoria).subscribe({
          next: () => this.onSuccess('Categoría actualizada con éxito'),
          error: () => this.onError('Error al actualizar la categoría')
        });
      } else {
        this.categoriaService.postAgregarCategoria(this.categoria).subscribe({
          next: () => this.onSuccess('Categoría guardada con éxito'),
          error: () => this.onError('Error al guardar la categoría')
        });
      }
    }
  }

  eliminarCategoria(id: number) {
    this.categoriaService.eliminarCategoria(id).subscribe(() => {
      this.obtenerCategorias();
    });
  }

  editarCategoria(id: number) {
    this.categoriaService.getCategoria(id).subscribe(categoria => {
      this.categoria = categoria;
    });
  }

  onSuccess(message: string) {
    Swal.fire('Éxito', message, 'success');
    this.obtenerCategorias();
    this.cancelar();
  }

  onError(message: string) {
    Swal.fire('Error', message, 'error');
  }

  cancelar() {
    this.categoria = { nombre: '', estado: true };
  }

  // Métodos de paginación
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
    this.paginatedCategorias = this.categorias.slice(startIndex, endIndex);
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
