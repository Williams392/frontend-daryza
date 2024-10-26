import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models/Cliente';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit, AfterViewInit {
    @ViewChild('clienteForm', { static: false }) clienteForm!: NgForm;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    displayedColumns: string[] = ['id_cliente', 'nombre_clie', 'apellido_clie', 'razon_socialCliente', 'tipo_empresa', 'acciones'];
    dataSource = new MatTableDataSource<Cliente>();
  
    cliente: Cliente = new Cliente();

    constructor(
        private clienteService: ClienteService,
        private snack: MatSnackBar
    ) {}

    ngOnInit() {
        this.obtenerClientes();
        
        this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
            const transformedFilter = filter.trim().toLowerCase();
            return (
              (data.id_cliente?.toString().toLowerCase().includes(transformedFilter) || false) || 
              (data.nombre_clie?.toLowerCase().includes(transformedFilter) || false)
            );
        };
          
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    obtenerClientes() {
      this.clienteService.getClientes().subscribe(clientes => {
          this.dataSource.data = clientes.map(cliente => ({
              ...cliente
          }));
          this.dataSource.paginator = this.paginator; // Asocia el paginador aquí
      });
  }
  

    guardarClientes() {
        if (this.clienteForm.valid) {
            if (this.cliente.id_cliente) {
                this.clienteService.updateCliente(this.cliente.id_cliente, this.cliente).subscribe({
                    next: () => this.onSuccess('Cliente actualizado con éxito'),
                    error: () => this.onError('Error al actualizar cliente')
                });
            } else {
                this.clienteService.createCliente(this.cliente).subscribe({
                    next: () => this.onSuccess('Cliente guardado con éxito'),
                    error: () => this.onError('Error al guardar cliente')
                });
            }
        } else {
            this.snack.open('Rellene todos los campos', 'Aceptar', { duration: 3000 });
        }
    }

    editarCliente(cliente: Cliente) {
        this.cliente = { ...cliente }; 
        this.abrirModal(); 
    }

    abrirModalParaAgregar() {
        this.clienteForm.reset({
            id_cliente: null,
            nombre_clie: '',
            apellido_clie: '',

            cliente_tipo_doc: '',
            cliente_numDoc: '',

            direccion_clie: '',
            razon_socialCliente: '',
            tipo_empresa: '',
            email_cliente: '',
            telefono_cliente: '',
        });
        this.abrirModal();
      }

    eliminarCliente(id_cliente: number): void {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminarlo',
          cancelButtonText: 'No, cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.clienteService.deleteCliente(id_cliente).subscribe(() => {
              this.obtenerClientes();
              Swal.fire('¡Eliminado!', 'El cliente ha sido eliminado.', 'success');
            });
          }
        });
    }
    

    // -------------- venta modal --------------
    onSuccess(message: string) {
        Swal.fire('Éxito', message, 'success');
        this.obtenerClientes();
        this.cerrarModal();  // Cerrar el modal después del éxito
    }

    onError(message: string) {
        Swal.fire('Error', message, 'error');
    }

    cancelar() {
        this.cliente = new Cliente();  // Reset the form data
    }
    abrirModal() {
        const modalElement = document.getElementById('agregarClienteModal');
        if (modalElement) {
            modalElement.classList.add('show');
            modalElement.style.display = 'block';
            document.body.classList.add('modal-open');
        }
    }

    cerrarModal() {
        const modalElement = document.getElementById('agregarClienteModal');
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