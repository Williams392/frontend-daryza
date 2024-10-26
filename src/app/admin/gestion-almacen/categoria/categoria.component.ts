import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CategoriaService } from '../../../core/services/categoria.service';
import Swal from 'sweetalert2';
import { Categoria } from '../../../core/models/Categoria';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
  providers: [DatePipe]
})
export class CategoriaComponent implements OnInit {
  @ViewChild('categoriaForm', { static: false }) categoriaForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id_categoria', 'nombre', 'estado', 'created_at', 'update_at', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>();

  categoria: Categoria = { nombre_categoria: '', estado_categoria: true };

  constructor(
    private snack: MatSnackBar,
    private categoriaService: CategoriaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerCategorias();

    this.dataSource.filterPredicate = (data: Categoria, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      return (
        (data.id_categoria?.toString().toLowerCase().includes(transformedFilter) || false) || 
        (data.nombre_categoria?.toLowerCase().includes(transformedFilter) || false)
      );
    };

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
          error: (error) => this.handleError(error)
        });
      } else {
        this.categoriaService.postAgregarCategoria(this.categoria).subscribe({
          next: () => this.onSuccess('Categoría guardada con éxito'),
          error: (error) => this.handleError(error)
        });
      }
    } 
  }
  handleError(error: any) { // Método para manejar errores
    if (error.error.nombre_categoria) {
      this.snack.open('El campo Nombre está en uso', 'Aceptar', { duration: 3000 });
    } else {
      this.snack.open('Error al guardar nombre_categoria', 'Aceptar', { duration: 3000 });
    }
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(id).subscribe(() => {
          this.obtenerCategorias();
          Swal.fire('¡Eliminado!', 'La categoría ha sido eliminada.', 'success');
        });
      }
    });
  }

  editarCategoria(categoria: Categoria) {
    this.categoria = { ...categoria };
    this.abrirModal();
  }

  abrirModalParaAgregar() {
    this.categoriaForm.reset({
      id_categoria: null,
      nombre_categoria: '',
      estado_categoria: true
    });
    this.abrirModal();
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
    this.categoria = { nombre_categoria: '', estado_categoria: true }; 
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