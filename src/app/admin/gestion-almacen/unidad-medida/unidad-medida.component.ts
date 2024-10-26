import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  //@ViewChild('unidadMedidaForm', { static: false }) unidadMedidaForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  unidades: UnidadMedida[] = [];
  unidadMedidaForm: FormGroup;
  unidadMedida: UnidadMedida = new UnidadMedida();

  displayedColumns: string[] = ['id_unidad_medida', 'nombre', 'abreviacion', 'created_at', 'update_at', 'acciones'];
  unidades_dataSource = new MatTableDataSource<UnidadMedida>();
  
  constructor(
    private fb: FormBuilder,
    private unidadMedidaService: UnidadMedidaService,
    private snack: MatSnackBar,
    private datePipe: DatePipe
  ) {
    // Nuevo: Inicialización del formulario reactivo
    this.unidadMedidaForm = this.fb.group({
      id_unidadMedida: [null],
      nombre_unidad: ['', [Validators.required]],
      abreviacion: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.obtenerUnidades();

    this.unidades_dataSource.filterPredicate = (data: UnidadMedida, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      return (
        (data.id_unidadMedida?.toString().toLowerCase().includes(transformedFilter) || false) || 
        (data.nombre_unidad?.toLowerCase().includes(transformedFilter) || false)
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
      const unidadMedida = this.unidadMedidaForm.value;
      if (unidadMedida.id_unidadMedida) {
        this.unidadMedidaService.putActualizarUnidadMedida(unidadMedida.id_unidadMedida, unidadMedida).subscribe({
          next: () => this.onSuccess('Unidad de Medida actualizada con éxito'),
          error: (error) => this.handleError(error) // Nuevo: Manejo de errores
        });
      } else {
        this.unidadMedidaService.postAgregarUnidadMedida(unidadMedida).subscribe({
          next: () => this.onSuccess('Unidad de Medida guardada con éxito'),
          error: (error) => this.handleError(error) // Nuevo: Manejo de errores
        });
      }
    } else {
      this.snack.open('Rellene todos los campos', 'Aceptar', { duration: 3000 });
    }
  }
  handleError(error: any) { // Método para manejar errores
    if (error.error.nombre_unidad) {
      this.snack.open('El campo Nombre está en uso', 'Aceptar', { duration: 3000 });
    } else if (error.error.abreviacion) {
      this.snack.open('El campo Abreviación está en uso', 'Aceptar', { duration: 3000 });
    } else {
      this.snack.open('Error al guardar la Unidad de Medida', 'Aceptar', { duration: 3000 });
    }
  }

  eliminarUnidadMedida(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.unidadMedidaService.eliminarUnidadMedida(id).subscribe(() => {
          this.obtenerUnidades();
          Swal.fire('¡Eliminado!', 'La unidad de medida ha sido eliminada.', 'success');
        });
      }
    });
  }

  editarUnidadMedida(id: number) {
    this.unidadMedidaService.getUnidadMedida(id).subscribe(unidad => {
      this.unidadMedidaForm.patchValue(unidad); // Nuevo: Cargar datos en el formulario
      this.abrirModal(); // Nuevo: Abrir el modal al editar
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

  // Nuevo: Método para resetear el formulario
  resetForm() {
    this.unidadMedidaForm.reset({
      id_unidadMedida: null,
      nombre_unidad: '',
      abreviacion: ''
    });
  }

  abrirModalParaAgregar() {
    this.resetForm(); // Nuevo: Resetear el formulario al abrir el modal para agregar
    this.abrirModal();
  }

  abrirModalParaEditar(id: number) {
    this.unidadMedidaService.getUnidadMedida(id).subscribe(unidad => {
      this.unidadMedidaForm.patchValue(unidad); // Nuevo: Cargar datos en el formulario
      this.abrirModal();
    });
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
      this.cancelar();
    }
  }
  // ------------------------------------------

  // --- Mantener el Elementos por Pagina. ----
  getPageSize(): number {
    const pageSize = localStorage.getItem('pageSize');
    return pageSize ? +pageSize : 5; // Valor por defecto 5
  }

  setPageSize(size: number) {
      localStorage.setItem('pageSize', size.toString());
  }
  // ------------------------------------------

}
