import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/Cliente';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/Producto';

@Component({
  selector: 'app-generar-venta',
  templateUrl: './generar-venta.component.html',
  styleUrls: ['./generar-venta.component.css']
})
export class GenerarVentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  filtroProductos: Producto[] = [];
  clientes: Cliente[] = [];
  filtroCliente: Cliente[] = [];

  cliente: string = '';
  producto: string = '';
  selectedCliente: string = '';
  selectedProducto: string = '';

  constructor(
    private clienteService: ClienteService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {

    this.cargarClientes();
    this.cargarProductos();

    const fechaEmisionInput = document.getElementById('fechaEmision') as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];
    fechaEmisionInput.value = today;

  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe((data) => {
      this.clientes = data;
      this.filtroCliente = data;
    });
  }
  buscarCliente(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();

    if (searchText) {
      this.filtroCliente = this.filtroCliente.filter(
        (pro) =>
          //cambiar busqueda (id/nombre/marca) para buscar
          pro.dni_cliente.toLowerCase().includes(searchText) ||
          pro.nombre_clie.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.filtroCliente = this.clientes;
    }
  }
  ElegirCliente() {
    this.cliente = this.selectedCliente;
  }


  cargarProductos() {
    this.productoService.getProductoLista().subscribe(
      (response: Producto[]) => {
        this.listaProductos = response;
        this.filtroProductos = response;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }
  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();

    if (searchText) {
      this.filtroProductos = this.listaProductos.filter(
        (prod) =>
          prod.codigo.toLowerCase().includes(searchText) ||
          prod.nombre_prod.toLowerCase().includes(searchText)
      );
    } else {
      this.filtroProductos = this.listaProductos;
    }
  }
  ElegirProducto() {
    this.producto = this.selectedProducto;
  }

}
