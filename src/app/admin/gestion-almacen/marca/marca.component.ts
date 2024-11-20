import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MarcaService } from '../../../core/services/marca.service';
import { Marca } from '../../../core/models/Marca';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.css',
  providers: [DatePipe]
})
export class MarcaComponent implements OnInit, AfterViewInit {
  @ViewChild('marcaForm', { static: false }) marcaForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id_marca', 'nombre', 'estado', 'created_at', 'update_at', 'acciones'];
  dataSource = new MatTableDataSource<Marca>();

  marca: Marca = { nombre_marca: '', estado_marca: true };

  // marca: Marca = new Marca();

    constructor(
        private marcaService: MarcaService,
        private snack: MatSnackBar,
        private datePipe: DatePipe
    ) {}

    ngOnInit() {
        this.obtenerMarcas();
        
        this.dataSource.filterPredicate = (data: Marca, filter: string) => {
            const transformedFilter = filter.trim().toLowerCase();
            return (
              (data.id_marca?.toString().toLowerCase().includes(transformedFilter) || false) || 
              (data.nombre_marca?.toLowerCase().includes(transformedFilter) || false)
            );
        };
          
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    obtenerMarcas() {
        this.marcaService.getMarcaLista().subscribe(marcas => {
            this.dataSource.data = marcas.map(marca => ({
                ...marca,
                created_at: this.datePipe.transform(marca.created_at, 'yyyy-MM-dd HH:mm'), 
                update_at: this.datePipe.transform(marca.update_at, 'yyyy-MM-dd HH:mm')
            }));
        });
    }

    guardarMarca() {
      if (this.marcaForm.valid) {
          if (this.marca.id_marca) {
              this.marcaService.putActualizarMarca(this.marca.id_marca, this.marca).subscribe({
                  next: () => this.onSuccess('Marca actualizada con éxito'),
                  error: (error) => this.handleError(error)
              });
          } else {
              this.marcaService.postAgregarMarca(this.marca).subscribe({
                  next: () => this.onSuccess('Marca guardada con éxito'),
                  error: (error) => this.handleError(error)
              });
          }
      } else {
          this.snack.open('Rellene todos los campos', 'Aceptar', { duration: 3000 });
      }
  }
  handleError(error: any) {  // Método para manejar errores
    if (error.error) {
        if (error.error.nombre_marca) {
          this.snack.open('El campo Nombre está en uso', 'Aceptar', { duration: 3000 });
        } else {
          this.snack.open('Error al guardar Marca', 'Aceptar', { duration: 3000 });
        }
    }
  }
  
  eliminarMarca(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
          this.marcaService.eliminarMarca(id).subscribe(() => {
          this.obtenerMarcas();
          Swal.fire('¡Eliminado!', 'La marca ha sido eliminada.', 'success');
        });
      }
    });
  }
    
  editarMarca(marca: Marca) {
    this.marca = { ...marca };  // Clonar el objeto marca para evitar referencia directa
    this.abrirModal();  // Abrir el modal con los datos de la marca actual
  }

  abrirModalParaAgregar() {
    this.marcaForm.reset({
      id_marca: null,
      nombre_marca: '',
      estado_marca: true
    });
    this.abrirModal();
  }
  
  // -------------- venta modal --------------
  onSuccess(message: string) {
    Swal.fire('Éxito', message, 'success');
    this.obtenerMarcas();
    this.cerrarModal();  // Cerrar el modal después del éxito
  }

  onError(message: string) {
    Swal.fire('Error', message, 'error');
  }

  cancelar() {
    //this.marca = new Marca();  // Reset the form data
    this.marca = { nombre_marca: '', estado_marca: true }; 
  }
  abrirModal() {
    const modalElement = document.getElementById('agregarMarcaModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
      }
  }

  cerrarModal() {
    const modalElement = document.getElementById('agregarMarcaModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.cancelar();  // Clear the form after closing
    }
  }
  // --------------------------------------------------


  // ------- Mantener el Elementos por Pagina. -------
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
  // -------------------------------------------------
    
  
}
