import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/Cliente';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/Producto';
import { Sucursal } from '../../../core/models/Sucursal';
import { SucursalService } from '../../../core/services/sucursal.service';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { Comprobante, DetalleComprobante, FormaPago }  from '../../../core/models/Comprobante';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';

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

  tipoDoc: string = '';
  cliente: string = '';
  producto: string = '';
  sucursal: string = '';
  tipoComprobante: string = '';

  selectedComprobante: string = ''; // POR DEFECTO
  selectedTipoDoc: string = '';

  selectFormaPago: string = 'Efectivo';
  selectedSucursal: string = '';
  selectedCliente: string = '';
  selectedProducto: string = '';

  stock: number = 0;
  cantidad: number = 1;

  productosSeleccionados: { producto: Producto, cantidad: number, valor: number, igv: number, precioConIgv: number }[] = [];
  totalGravada: number = 0;
  igv: number = 0;
  totalPagar: number = 0;

  // Define las opciones disponibles según el comprobante
  opcionesTipoDoc: { value: string, label: string }[] = [];

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
    this.ElegirComprobante();
    this.ElegirTipoDoc();
  
    const tipoComprobanteSelect = document.getElementById('tipoComprobante') as HTMLSelectElement;
    const serieInput = document.getElementById('serie') as HTMLInputElement;
  
    tipoComprobanteSelect.addEventListener('change', () => {
      this.selectedComprobante = tipoComprobanteSelect.value;
      if (this.selectedComprobante === 'boleta') {
        this.tipoDoc = '03';
        serieInput.value = 'B001';
      } else if (this.selectedComprobante === 'factura') {
        this.tipoDoc = '01';
        serieInput.value = 'F001';
      }
    });
    serieInput.value = 'B001';  // Valor inicial

    // Configurar la fecha de emisión
    const fechaEmisionInput = document.getElementById('fechaEmision') as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];
    fechaEmisionInput.value = today;

    this.actualizarHoraEmision();
  }


  // ------------------------------------------------------
  ElegirComprobante() {
    if (this.selectedComprobante === 'factura') {
      this.filtroCliente = this.listaClientes.filter(cliente => cliente.ruc_cliente != null && cliente.ruc_cliente !== '');
      this.opcionesTipoDoc = [
        { value: '6', label: 'RUC' }
      ];
      this.selectedTipoDoc = '6';  // Selecciona automáticamente RUC
    } else {
      this.filtroCliente = this.listaClientes;
      this.opcionesTipoDoc = [
        { value: '1', label: 'DNI' },
        { value: '6', label: 'RUC' }
      ];
    }
  }


  // ------------------------------------------------------
  emitirComprobante() {
    const clienteObj = this.listaClientes.find(cliente => cliente.id_cliente === parseInt(this.selectedCliente));
    const sucursalObj = this.listaSursales.find(sucursal => sucursal.id_sucursal === parseInt(this.selectedSucursal));
  
    if (!clienteObj) {
      alert('Por favor, selecciona un cliente válido');
      return; 
    }
    if (!sucursalObj) {
      alert('Por favor, selecciona una sucursal válida');
      return; 
    }
  
    // Valida la selección del Tipo de Documento
    let clienteTipoDoc = null;
    if (this.selectedTipoDoc === '1') {
      clienteTipoDoc = '1'; // DNI
    } else if (this.selectedTipoDoc === '6') {
      clienteTipoDoc = '6'; // RUC
    }
    
    if (!clienteTipoDoc) {
      alert('Por favor, selecciona un tipo de documento válido para el cliente');
      return;
    }
  
    // Validar el monto máximo para boletas
    if (this.selectedComprobante === 'boleta' && this.totalPagar > 700.00) {
      alert('El monto máximo permitido para una boleta es de 700.00');
      return;
    }
  
    // Configurar los datos del comprobante
    const comprobanteData: Comprobante = {
      tipo_operacion: '0101',
      tipo_doc: this.tipoDoc,
      numero_serie: this.tipoDoc === '03' ? 'B001' : 'F001',
      tipo_moneda: 'PEN',
      fecha_emision: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      hora_emision: formatDate(new Date(), 'HH:mm:ss.SSS', 'en-US'),
      empresa_ruc: '20144109458',
      razon_social: 'Daryza S.A.C.',
      nombre_comercial: 'Daryza',
      urbanizacion: 'Lurin',
      distrito: 'Lurin',
      departamento: 'Lima',
      email_empresa: 'daryza@gmail.com',
      telefono_emp: '+51996638762',
      cliente_tipo_doc: clienteTipoDoc, 
      cliente: clienteObj.id_cliente,  
      sucursal: sucursalObj.id_sucursal,  
      detalle: this.productosSeleccionados.map(item => ({
        id_producto: item.producto.id_producto?.toString() || '',
        cantidad: item.cantidad
      })),           
      forma_pago: {
        tipo: this.selectFormaPago
      }
    };
  
    // Llamada al servicio para crear el comprobante
    this.comprobanteService.crearComprobante(comprobanteData).subscribe(
      response => {
        console.log('Comprobante registrado exitosamente:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Comprobante registrado exitosamente',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Descargar PDF'
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            // Descargar el PDF automáticamente
            if (response.id_comprobante !== undefined) {
              this.descargarPDF(response.id_comprobante);
            } else {
              console.error('El id_comprobante es undefined');
            }
          }
        });
        this.resetForm();
        this.actualizarHoraEmision();
        this.ElegirTipoDoc();
        this.cargarSucursales(); // para manterner.
      },
      error => {
        console.error('Error al registrar el comprobante:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al registrar el comprobante',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
  elegirSucursal() {
    this.sucursal = this.selectedSucursal;
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

  // ------------------------------------------------------
  descargarPDF(id: number) {
    this.comprobanteService.obtenerComprobantePDF(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // ------------------------------------------------------
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
      
      // Establecer el primer ID de sucursal como valor predeterminado
      if (this.filtroSucursal.length > 0) {
        this.selectedSucursal = this.filtroSucursal[0].id_sucursal.toString();
      }
    });
  }

  // ------------------------------------------------------
  ElegirTipoDoc() {
    this.tipoDoc = this.selectedTipoDoc;
    this.ElegirComprobante(); 
  }
  ElegirCliente() {
    const clienteSeleccionado = this.listaClientes.find(cliente => cliente.id_cliente === Number(this.selectedCliente));
    if (clienteSeleccionado) {
      this.opcionesTipoDoc = [];
      if (clienteSeleccionado.dni_cliente) {
        this.opcionesTipoDoc.push({ value: '1', label: 'DNI' });
      }
      if (clienteSeleccionado.ruc_cliente) {
        this.opcionesTipoDoc.push({ value: '6', label: 'RUC' });
      }
      if (this.opcionesTipoDoc.length === 1) {
        this.selectedTipoDoc = this.opcionesTipoDoc[0].value;  // Selecciona automáticamente si solo hay una opción
      }
      // Asegúrate de que si el tipo de comprobante es factura, el tipo de documento sea RUC
      if (this.selectedComprobante === 'factura') {
        this.selectedTipoDoc = '6';
      }
      //this.ElegirComprobante(); 
    }
  }
  cargarClientes() {
    this.clienteService.getClientes().subscribe((data) => {
      this.listaClientes = data;
      this.ElegirComprobante(); 
    });
  }
  // Método para buscar clientes
  buscarCliente(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();

    if (this.selectedComprobante === 'factura') {
      // Solo permite buscar clientes con RUC
      this.filtroCliente = this.listaClientes.filter(
        (pro) =>
          (pro.ruc_cliente?.toLowerCase().includes(searchText) || pro.nombre_clie.toLowerCase().includes(searchText)) &&
          pro.ruc_cliente != null,
          this.ElegirComprobante() // NUEVO .------------------------------
      );
    } else {
      // Permite buscar todos los clientes si el comprobante es boleta
      this.filtroCliente = this.listaClientes.filter(
        (pro) =>
          (pro.dni_cliente?.toLowerCase().includes(searchText) || pro.nombre_clie.toLowerCase().includes(searchText))
      );
    }
    this.ElegirComprobante(); 
  }

  // ------------------------------------------------------
  // SECUNDARIO:

  actualizarCantidadInput() {
    this.cantidad = parseInt((<HTMLInputElement>document.getElementById('cantidad')).value, 10);
  }
  resetForm() {
    this.productosSeleccionados = [];
    this.totalGravada = 0;
    this.igv = 0;
    this.totalPagar = 0;
    this.cantidad = 1;

    this.tipoDoc = '';
    this.tipoComprobante = '';
    this.selectedComprobante = '';

    this.selectedProducto = '';
    this.selectedCliente = '';
    this.selectedSucursal = '';
    this.cdr.detectChanges();
  }

  actualizarHoraEmision() {
    const horaEmisionInput = document.getElementById('horaEmision') as HTMLInputElement;
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    horaEmisionInput.value = `${hours}:${minutes}`;
    this.cdr.detectChanges(); // Forzar la actualización de la vista
  }  

}
