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

  displayedColumns: string[] = ['id_marca', 'nombre', 'created_at', 'update_at', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<Marca>();

  marca: Marca = new Marca();

  constructor(
    private marcaService: MarcaService,
    private snack: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerMarcas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Obtener lista de marcas con fechas formateadas
  obtenerMarcas() {
    this.marcaService.getMarcaLista().subscribe(marcas => {
      this.dataSource.data = marcas.map(marca => ({
        ...marca,
        created_at: this.datePipe.transform(marca.created_at, 'yyyy-MM-dd HH:mm'), 
        update_at: this.datePipe.transform(marca.update_at, 'yyyy-MM-dd HH:mm')
      }));
    });
  }

  // Guardar o actualizar marca
  guardarMarca() {
    if (this.marcaForm.valid) {
      if (this.marca.id_marca) {
        this.marcaService.putActualizarMarca(this.marca.id_marca, this.marca).subscribe({
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

}
