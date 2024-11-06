import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/Cliente';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/Producto';
import { Sucursal } from '../../../core/models/Sucursal';
import { SucursalService } from '../../../core/services/sucursal.service';
import { ChangeDetectorRef } from '@angular/core';
import { ComprobanteService } from '../../../core/services/comprobante.service';

@Component({
  selector: 'app-generar-venta',
  templateUrl: './generar-venta.component.html',
  styleUrls: ['./generar-venta.component.css']
})
export class GenerarVentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaClientes: Cliente[] = [];
  listaSursales: Sucursal[] = [];

  filtroProductos: Producto[] = [];
  filtroCliente: Cliente[] = [];
  filtroSucursal: Sucursal[] = [];

  cliente: string = '';
  producto: string = '';
  sucursal: string = '';
  selectedCliente: string = '';
  selectedProducto: string = '';
  selectedSucursal: string = '';

  stock: number = 0;
  cantidad: number = 1;

  productosSeleccionados: { producto: Producto, cantidad: number, valor: number, igv: number, precioConIgv: number }[] = [];
  totalGravada: number = 0;
  igv: number = 0;
  totalPagar: number = 0;

  constructor(
    private comprobanteService: ComprobanteService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private sucursalService: SucursalService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.cargarClientes();
    this.cargarProductos();
    this.cargarSucursales();

    const fechaEmisionInput = document.getElementById('fechaEmision') as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];
    fechaEmisionInput.value = today;

    // Selecciona el elemento de tipo de comprobante y el campo de serie:
    const tipoComprobanteSelect = document.getElementById('tipoComprobante') as HTMLSelectElement;
    const serieInput = document.getElementById('serie') as HTMLInputElement;
    tipoComprobanteSelect.addEventListener('change', () => {
      const tipoComprobante = tipoComprobanteSelect.value;
      if (tipoComprobante === 'boleta') {
        serieInput.value = 'B001';
      } else if (tipoComprobante === 'factura') {
        serieInput.value = 'F001';
      }
    });
    serieInput.value = 'B001';

  }

  // ------------------------------------------------------
  cargarProductos() {
    this.productoService.getProductoLista().subscribe(
      (response: Producto[]) => {
        this.listaProductos = response;
        this.filtroProductos = this.listaProductos;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  removeProducto(item: Producto) {
    this.filtroProductos = this.filtroProductos.filter(prod => prod.id_producto !== item.id_producto);
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
    const productoSeleccionado = this.listaProductos.find(
      (prod) => prod.id_producto === parseInt(this.selectedProducto)
    );
    if (productoSeleccionado) {
      this.stock = productoSeleccionado.estock;
      this.cdr.detectChanges(); 
    }
  }

  anadirArticulo() {
    const productoSeleccionado = this.listaProductos.find(
      (prod) => prod.id_producto === parseInt(this.selectedProducto)
    );
    if (productoSeleccionado && !this.productosSeleccionados.find(p => p.producto.id_producto === productoSeleccionado.id_producto)) {
      this.productosSeleccionados.push({
        producto: productoSeleccionado,
        cantidad: this.cantidad,
        valor: productoSeleccionado.precio_venta * this.cantidad,
        igv: productoSeleccionado.precio_venta * this.cantidad * 0.18,
        precioConIgv: productoSeleccionado.precio_venta * this.cantidad * 1.18
      });
      this.actualizarTotales();
      this.cdr.detectChanges(); 
    }
  }

  actualizarCantidad(index: number, cantidad: number) {
    const producto = this.productosSeleccionados[index];
    producto.cantidad = cantidad;
    producto.valor = producto.cantidad * producto.producto.precio_venta;
    producto.igv = producto.valor * 0.18;
    producto.precioConIgv = producto.valor + producto.igv;
    this.actualizarTotales();
  }
  actualizarTotales() {
    this.totalGravada = this.calcularTotalGravada();
    this.igv = this.calcularIgv();
    this.totalPagar = this.calcularTotalPagar();
    this.cdr.detectChanges();
  }
  calcularTotalGravada(): number {
    return this.productosSeleccionados.reduce((total, item) => total + (item.valor || 0), 0); 
  }

  calcularIgv(): number {
    return this.productosSeleccionados.reduce((total, item) => total + (item.igv || 0), 0);  
  }

  calcularTotalPagar(): number {
    return this.productosSeleccionados.reduce((total, item) => total + (item.precioConIgv || 0), 0); 
  }

  eliminarProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
    this.actualizarTotales();
  }
  
  // ------------------------------------------------------
  cargarSucursales() {
    this.sucursalService.cargarSucursales().subscribe((data) => {
      this.listaSursales = data;
      this.filtroSucursal = data;
    });
  }
  elegirSucursal() {
    this.sucursal = this.selectedSucursal;
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe((data) => {
      this.listaClientes = data;
      this.filtroCliente = data;
    });
  }
  buscarCliente(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();
  
    if (searchText) {
      this.filtroCliente = this.listaClientes.filter(
        (pro) =>
          pro.dni_cliente.toLowerCase().includes(searchText) ||
          pro.nombre_clie.toLowerCase().includes(searchText)
      );
    } else {
      // Restaura la lista original cuando el campo de búsqueda está vacío
      this.filtroCliente = this.listaClientes;
    }
  }  
  ElegirCliente() {
    this.cliente = this.selectedCliente;
  }
  // ------------------------------------------------------

  actualizarCantidadInput() {
    this.cantidad = parseInt((<HTMLInputElement>document.getElementById('cantidad')).value, 10);
  }
  

}
