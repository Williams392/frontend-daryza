import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CategoriaService } from '../../../core/services/categoria.service';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id_categoria', 'nombre', 'estado', 'created_at', 'update_at', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<Categoria>();

  categoria: Categoria = { nombre: '', estado: true };

  constructor(
    private categoriaService: CategoriaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  obtenerCategorias() {
    this.categoriaService.getCategoriaLista().subscribe(categorias => {
      this.dataSource.data = categorias.map(categoria => ({
        ...categoria,
        created_at: this.datePipe.transform(categoria.created_at, 'yyyy-MM-dd HH:mm'),
        update_at: this.datePipe.transform(categoria.update_at, 'yyyy-MM-dd HH:mm')
      }));
    });
  }

  guardarCategoria() {
    if (this.categoriaForm.valid) {
      if (this.categoria.id_categoria) {
        this.categoriaService.putActualizarCategoria(this.categoria.id_categoria, this.categoria).subscribe({
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

  editarCategoria(categoria: Categoria) {
    this.categoria = { ...categoria };
    this.abrirModal(); // Abrir modal para edición
  }

  // -------------- venta modal --------------
  onSuccess(message: string) {
    Swal.fire('Éxito', message, 'success');
    this.obtenerCategorias();
    this.cerrarModal();
  }

  onError(message: string) {
    Swal.fire('Error', message, 'error');
  }

  cancelar() {
    this.categoria = { nombre: '', estado: true }; 
  }
  
  abrirModal() {
    const modalElement = document.getElementById('agregarCategoriaModal');
    if (modalElement) {
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        document.body.classList.add('modal-open');
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('agregarCategoriaModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
     document.body.classList.remove('modal-open');
      this.cancelar();  // Clear the form after closing
    }
  }
  // ------------------------------------------

}